using Prism.Application.DTOs;
using Prism.Application.Mapping;
using Prism.Core.Interfaces;

namespace Prism.Application.Services;

public class TransactionService
{
    private readonly ITransactionRepository _repository;

    public TransactionService(ITransactionRepository repository)
    {
        _repository = repository;
    }

    public async Task<TransactionResponse?> GetByIdAsync(string userId, string transactionId)
    {
        var entity = await _repository.GetByIdAsync(userId, transactionId);
        return entity is null ? null : TransactionMapper.ToResponse(entity);
    }

    public async Task<IEnumerable<TransactionResponse>> GetByUserIdAsync(
        string userId,
        DateTime? startDate = null,
        DateTime? endDate = null,
        string? category = null,
        int limit = 50)
    {
        var entities = await _repository.GetByUserIdAsync(userId, startDate, endDate, category, limit);
        return entities.Select(TransactionMapper.ToResponse);
    }

    public async Task<TransactionResponse> CreateAsync(string userId, CreateTransactionRequest request)
    {
        var entity = TransactionMapper.ToEntity(request, userId);
        var created = await _repository.CreateAsync(entity);
        return TransactionMapper.ToResponse(created);
    }

    public async Task<TransactionResponse?> UpdateAsync(string userId, string transactionId, UpdateTransactionRequest request)
    {
        var entity = await _repository.GetByIdAsync(userId, transactionId);
        if (entity is null) return null;

        TransactionMapper.ApplyUpdate(entity, request);
        var updated = await _repository.UpdateAsync(entity);
        return TransactionMapper.ToResponse(updated);
    }

    public async Task<bool> DeleteAsync(string userId, string transactionId)
    {
        return await _repository.DeleteAsync(userId, transactionId);
    }
}
