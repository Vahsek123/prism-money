using System.ComponentModel.DataAnnotations;

namespace Prism.Application.DTOs;

/// <summary>
/// Request DTO for creating a new transaction.
/// </summary>
public record CreateTransactionRequest(
    [Required] decimal Amount,
    [Required] string Type,
    string? Category,
    string? CustomCategory,
    [Required][StringLength(500)] string Description,
    [Required] DateTime TransactionDate,
    [StringLength(1000)] string? Notes
);
