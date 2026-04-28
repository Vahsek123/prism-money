namespace Prism.Core.Interfaces;

using Prism.Core.Entities;

/// <summary>
/// Defines data access operations for Budget entities.
/// </summary>
public interface IBudgetRepository
{
    Task<Budget?> GetByIdAsync(string userId, string budgetId);
    Task<IEnumerable<Budget>> GetByUserIdAsync(string userId, int? year = null, int? month = null);
    Task<Budget> CreateAsync(Budget budget);
    Task<Budget> UpdateAsync(Budget budget);
    Task<bool> DeleteAsync(string userId, string budgetId);
}
