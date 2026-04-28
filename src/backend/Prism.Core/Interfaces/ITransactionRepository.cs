namespace Prism.Core.Interfaces;

using Prism.Core.Entities;

/// <summary>
/// Defines data access operations for Transaction entities.
/// Implemented by infrastructure layer (DynamoDB, in-memory, etc.)
/// </summary>
public interface ITransactionRepository
{
    Task<Transaction?> GetByIdAsync(string userId, string transactionId);
    Task<IEnumerable<Transaction>> GetByUserIdAsync(
        string userId,
        DateTime? startDate = null,
        DateTime? endDate = null,
        string? category = null,
        int limit = 50,
        string? lastEvaluatedKey = null);
    Task<Transaction> CreateAsync(Transaction transaction);
    Task<Transaction> UpdateAsync(Transaction transaction);
    Task<bool> DeleteAsync(string userId, string transactionId);
}
