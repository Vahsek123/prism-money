using System.Collections.Concurrent;
using Prism.Core.Entities;
using Prism.Core.Interfaces;

namespace Prism.Infrastructure.Repositories;

/// <summary>
/// In-memory implementation of IBudgetRepository for local development.
/// </summary>
public class InMemoryBudgetRepository : IBudgetRepository
{
    private readonly ConcurrentDictionary<string, Budget> _store = new();

    public Task<Budget?> GetByIdAsync(string userId, string budgetId)
    {
        _store.TryGetValue(budgetId, out var budget);
        if (budget is not null && budget.UserId != userId)
            return Task.FromResult<Budget?>(null);
        return Task.FromResult(budget);
    }

    public Task<IEnumerable<Budget>> GetByUserIdAsync(string userId, int? year = null, int? month = null)
    {
        var query = _store.Values.Where(b => b.UserId == userId);

        if (year.HasValue)
            query = query.Where(b => b.Year == year.Value);

        if (month.HasValue)
            query = query.Where(b => b.Month == month.Value);

        return Task.FromResult(query.OrderByDescending(b => b.Year * 100 + b.Month).AsEnumerable());
    }

    public Task<Budget> CreateAsync(Budget budget)
    {
        _store[budget.Id] = budget;
        return Task.FromResult(budget);
    }

    public Task<Budget> UpdateAsync(Budget budget)
    {
        _store[budget.Id] = budget;
        return Task.FromResult(budget);
    }

    public Task<bool> DeleteAsync(string userId, string budgetId)
    {
        if (_store.TryGetValue(budgetId, out var budget) && budget.UserId == userId)
        {
            return Task.FromResult(_store.TryRemove(budgetId, out _));
        }
        return Task.FromResult(false);
    }
}
