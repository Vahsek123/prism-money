using Prism.Core.Entities;
using Prism.Core.Enums;
using Prism.Application.DTOs;

namespace Prism.Application.Mapping;

/// <summary>
/// Maps between Budget entities and DTOs.
/// </summary>
public static class BudgetMapper
{
    public static BudgetResponse ToResponse(Budget entity, decimal spentAmount) => new(
        Id: entity.Id,
        UserId: entity.UserId,
        Amount: entity.Amount,
        Category: entity.Category.ToString(),
        Year: entity.Year,
        Month: entity.Month,
        SpentAmount: spentAmount,
        RemainingAmount: entity.Amount - spentAmount,
        PercentUsed: entity.Amount > 0
            ? Math.Round((double)(spentAmount / entity.Amount) * 100, 1)
            : 0,
        CreatedAt: entity.CreatedAt,
        UpdatedAt: entity.UpdatedAt
    );

    public static Budget ToEntity(CreateBudgetRequest request, string userId) => new()
    {
        Id = Guid.NewGuid().ToString("N"),
        UserId = userId,
        Amount = request.Amount,
        Category = Enum.TryParse<SpendingCategory>(request.Category, true, out var cat)
            ? cat
            : SpendingCategory.Uncategorized,
        Year = request.Year,
        Month = request.Month,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };
}
