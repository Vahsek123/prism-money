namespace Prism.Application.DTOs;

/// <summary>
/// Response DTO for a stock holding.
/// </summary>
public record HoldingResponse(
    string Id,
    string UserId,
    string TickerSymbol,
    decimal Quantity,
    decimal CostPerShare,
    decimal TotalCostBasis,
    decimal? CurrentPrice,
    decimal? CurrentValue,
    decimal? GainLoss,
    double? GainLossPercent,
    DateTime PurchaseDate,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
