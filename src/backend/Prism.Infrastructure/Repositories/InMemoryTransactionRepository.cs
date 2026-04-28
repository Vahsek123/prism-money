using System.Collections.Concurrent;
using Prism.Core.Entities;
using Prism.Core.Enums;
using Prism.Core.Interfaces;

namespace Prism.Infrastructure.Repositories;

/// <summary>
/// In-memory implementation of ITransactionRepository for local development.
/// Will be replaced by DynamoDB implementation when deploying to AWS.
/// </summary>
public class InMemoryTransactionRepository : ITransactionRepository
{
    private readonly ConcurrentDictionary<string, Transaction> _store = new();

    public Task<Transaction?> GetByIdAsync(string userId, string transactionId)
    {
        _store.TryGetValue(transactionId, out var transaction);
        if (transaction is not null && transaction.UserId != userId)
            return Task.FromResult<Transaction?>(null);
        return Task.FromResult(transaction);
    }

    public Task<IEnumerable<Transaction>> GetByUserIdAsync(
        string userId,
        DateTime? startDate = null,
        DateTime? endDate = null,
        string? category = null,
        int limit = 50,
        string? lastEvaluatedKey = null)
    {
        var query = _store.Values.Where(t => t.UserId == userId);

        if (startDate.HasValue)
            query = query.Where(t => t.TransactionDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(t => t.TransactionDate <= endDate.Value);

        if (category is not null && Enum.TryParse<SpendingCategory>(category, true, out var cat))
            query = query.Where(t => t.Category == cat);

        var results = query
            .OrderByDescending(t => t.TransactionDate)
            .Take(limit);

        return Task.FromResult(results);
    }

    public Task<Transaction> CreateAsync(Transaction transaction)
    {
        _store[transaction.Id] = transaction;
        return Task.FromResult(transaction);
    }

    public Task<Transaction> UpdateAsync(Transaction transaction)
    {
        _store[transaction.Id] = transaction;
        return Task.FromResult(transaction);
    }

    public Task<bool> DeleteAsync(string userId, string transactionId)
    {
        if (_store.TryGetValue(transactionId, out var transaction) && transaction.UserId == userId)
        {
            return Task.FromResult(_store.TryRemove(transactionId, out _));
        }
        return Task.FromResult(false);
    }
}
