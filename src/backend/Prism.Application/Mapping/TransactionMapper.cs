using Prism.Core.Entities;
using Prism.Core.Enums;
using Prism.Application.DTOs;

namespace Prism.Application.Mapping;

/// <summary>
/// Maps between domain entities and DTOs.
/// Static mapper avoids the overhead of AutoMapper for a small project.
/// </summary>
public static class TransactionMapper
{
    public static TransactionResponse ToResponse(Transaction entity) => new(
        Id: entity.Id,
        UserId: entity.UserId,
        Amount: entity.Amount,
        Type: entity.Type.ToString(),
        Category: entity.Category.ToString(),
        CustomCategory: entity.CustomCategory,
        Description: entity.Description,
        TransactionDate: entity.TransactionDate,
        Notes: entity.Notes,
        CreatedAt: entity.CreatedAt,
        UpdatedAt: entity.UpdatedAt
    );

    public static Transaction ToEntity(CreateTransactionRequest request, string userId) => new()
    {
        Id = Guid.NewGuid().ToString("N"),
        UserId = userId,
        Amount = request.Amount,
        Type = Enum.TryParse<TransactionType>(request.Type, true, out var type)
            ? type
            : TransactionType.Expense,
        Category = Enum.TryParse<SpendingCategory>(request.Category, true, out var cat)
            ? cat
            : SpendingCategory.Uncategorized,
        CustomCategory = request.CustomCategory,
        Description = request.Description,
        TransactionDate = request.TransactionDate,
        Notes = request.Notes,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };

    public static void ApplyUpdate(Transaction entity, UpdateTransactionRequest request)
    {
        if (request.Amount.HasValue)
            entity.Amount = request.Amount.Value;

        if (request.Type is not null && Enum.TryParse<TransactionType>(request.Type, true, out var type))
            entity.Type = type;

        if (request.Category is not null && Enum.TryParse<SpendingCategory>(request.Category, true, out var cat))
            entity.Category = cat;

        if (request.CustomCategory is not null)
            entity.CustomCategory = request.CustomCategory;

        if (request.Description is not null)
            entity.Description = request.Description;

        if (request.TransactionDate.HasValue)
            entity.TransactionDate = request.TransactionDate.Value;

        if (request.Notes is not null)
            entity.Notes = request.Notes;

        entity.UpdatedAt = DateTime.UtcNow;
    }
}
