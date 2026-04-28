using Prism.Application.DTOs;
using Prism.Application.Mapping;
using Prism.Core.Interfaces;

namespace Prism.Application.Services;

public class HoldingService
{
    private readonly IHoldingRepository _repository;

    public HoldingService(IHoldingRepository repository)
    {
        _repository = repository;
    }

    public async Task<HoldingResponse?> GetByIdAsync(string userId, string holdingId)
    {
        var entity = await _repository.GetByIdAsync(userId, holdingId);
        // TODO: Fetch current price from stock price cache (M4)
        return entity is null ? null : HoldingMapper.ToResponse(entity);
    }

    public async Task<IEnumerable<HoldingResponse>> GetByUserIdAsync(string userId)
    {
        var entities = await _repository.GetByUserIdAsync(userId);
        // TODO: Batch fetch current prices from cache (M4)
        return entities.Select(e => HoldingMapper.ToResponse(e));
    }

    public async Task<HoldingResponse> CreateAsync(string userId, CreateHoldingRequest request)
    {
        var entity = HoldingMapper.ToEntity(request, userId);
        var created = await _repository.CreateAsync(entity);
        return HoldingMapper.ToResponse(created);
    }

    public async Task<bool> DeleteAsync(string userId, string holdingId)
    {
        return await _repository.DeleteAsync(userId, holdingId);
    }
}
