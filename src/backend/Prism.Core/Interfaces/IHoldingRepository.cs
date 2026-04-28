namespace Prism.Core.Interfaces;

using Prism.Core.Entities;

/// <summary>
/// Defines data access operations for Holding entities.
/// </summary>
public interface IHoldingRepository
{
    Task<Holding?> GetByIdAsync(string userId, string holdingId);
    Task<IEnumerable<Holding>> GetByUserIdAsync(string userId);
    Task<Holding> CreateAsync(Holding holding);
    Task<Holding> UpdateAsync(Holding holding);
    Task<bool> DeleteAsync(string userId, string holdingId);
}
