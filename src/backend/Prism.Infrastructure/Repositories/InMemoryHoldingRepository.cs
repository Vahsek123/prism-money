using System.Collections.Concurrent;
using Prism.Core.Entities;
using Prism.Core.Interfaces;

namespace Prism.Infrastructure.Repositories;

/// <summary>
/// In-memory implementation of IHoldingRepository for local development.
/// </summary>
public class InMemoryHoldingRepository : IHoldingRepository
{
    private readonly ConcurrentDictionary<string, Holding> _store = new();

    public Task<Holding?> GetByIdAsync(string userId, string holdingId)
    {
        _store.TryGetValue(holdingId, out var holding);
        if (holding is not null && holding.UserId != userId)
            return Task.FromResult<Holding?>(null);
        return Task.FromResult(holding);
    }

    public Task<IEnumerable<Holding>> GetByUserIdAsync(string userId)
    {
        var results = _store.Values
            .Where(h => h.UserId == userId)
            .OrderBy(h => h.TickerSymbol)
            .AsEnumerable();
        return Task.FromResult(results);
    }

    public Task<Holding> CreateAsync(Holding holding)
    {
        _store[holding.Id] = holding;
        return Task.FromResult(holding);
    }

    public Task<Holding> UpdateAsync(Holding holding)
    {
        _store[holding.Id] = holding;
        return Task.FromResult(holding);
    }

    public Task<bool> DeleteAsync(string userId, string holdingId)
    {
        if (_store.TryGetValue(holdingId, out var holding) && holding.UserId == userId)
        {
            return Task.FromResult(_store.TryRemove(holdingId, out _));
        }
        return Task.FromResult(false);
    }
}
