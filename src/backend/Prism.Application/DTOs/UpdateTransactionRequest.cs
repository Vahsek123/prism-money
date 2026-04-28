using System.ComponentModel.DataAnnotations;

namespace Prism.Application.DTOs;

/// <summary>
/// Request DTO for updating an existing transaction.
/// All fields are optional — only provided fields will be updated.
/// </summary>
public record UpdateTransactionRequest(
    decimal? Amount,
    string? Type,
    string? Category,
    string? CustomCategory,
    [StringLength(500)] string? Description,
    DateTime? TransactionDate,
    [StringLength(1000)] string? Notes
);
