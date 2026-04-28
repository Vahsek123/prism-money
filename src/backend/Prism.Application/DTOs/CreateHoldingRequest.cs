using System.ComponentModel.DataAnnotations;

namespace Prism.Application.DTOs;

/// <summary>
/// Request DTO for adding a new holding.
/// </summary>
public record CreateHoldingRequest(
    [Required][StringLength(10)] string TickerSymbol,
    [Required] decimal Quantity,
    [Required] decimal CostPerShare,
    DateTime? PurchaseDate
);
