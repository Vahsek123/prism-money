namespace Prism.Core.Entities;

/// <summary>
/// Represents an investment holding (stock, ETF, etc.)
/// </summary>
public class Holding
{
  /// <summary>
  /// Unique Identifier for this holding
  /// </summary>
  public required string Id { get; init; }

  /// <summary>
  /// The ID of the user who owns this holding
  /// </summary>
  public required string UserId { get; init; }

  /// <summary>
  /// The ticker symbol of the asset (e.g., "AAPL", "MSFT").
  /// Immutable — selling one stock and buying another creates separate holdings.
  /// </summary>
  public required string TickerSymbol { get; init; }

  /// <summary>
  /// The quantity of shares held. Decimal to support fractional shares.
  /// </summary>
  public required decimal Quantity { get; set; }

  /// <summary>
  /// The average cost per share at time of purchase.
  /// </summary>
  public required decimal CostPerShare { get; set; }

  /// <summary>
  /// Total cost basis (Quantity × CostPerShare). Read-only, not stored in DB.
  /// </summary>
  public decimal TotalCostBasis => Quantity * CostPerShare;

  /// <summary>
  /// When the shares were purchased.
  /// </summary>
  public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;

  /// <summary>
  /// When this record was created. Set once on creation, never modified.
  /// </summary>
  public DateTime CreatedAt { get; init; } = DateTime.UtcNow;

  /// <summary>
  /// When this record was last updated.
  /// </summary>
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}