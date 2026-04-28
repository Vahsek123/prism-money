using Prism.Core.Entities;
using Prism.Application.DTOs;

namespace Prism.Application.Mapping;

/// <summary>
/// Maps between Holding entities and DTOs.
/// </summary>
public static class HoldingMapper
{
    public static HoldingResponse ToResponse(Holding entity, decimal? currentPrice = null)
    {
        decimal? currentValue = currentPrice.HasValue
            ? entity.Quantity * currentPrice.Value
            : null;
        decimal? gainLoss = currentValue.HasValue
            ? currentValue.Value - entity.TotalCostBasis
            : null;
        double? gainLossPercent = gainLoss.HasValue && entity.TotalCostBasis > 0
            ? Math.Round((double)(gainLoss.Value / entity.TotalCostBasis) * 100, 2)
            : null;

        return new(
            Id: entity.Id,
            UserId: entity.UserId,
            TickerSymbol: entity.TickerSymbol,
            Quantity: entity.Quantity,
            CostPerShare: entity.CostPerShare,
            TotalCostBasis: entity.TotalCostBasis,
            CurrentPrice: currentPrice,
            CurrentValue: currentValue,
            GainLoss: gainLoss,
            GainLossPercent: gainLossPercent,
            PurchaseDate: entity.PurchaseDate,
            CreatedAt: entity.CreatedAt,
            UpdatedAt: entity.UpdatedAt
        );
    }

    public static Holding ToEntity(CreateHoldingRequest request, string userId) => new()
    {
        Id = Guid.NewGuid().ToString("N"),
        UserId = userId,
        TickerSymbol = request.TickerSymbol.ToUpperInvariant(),
        Quantity = request.Quantity,
        CostPerShare = request.CostPerShare,
        PurchaseDate = request.PurchaseDate ?? DateTime.UtcNow,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };
}
