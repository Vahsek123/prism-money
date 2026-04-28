namespace Prism.Application.DTOs;

/// <summary>
/// Response DTO for a transaction. Returned by API endpoints.
/// </summary>
public record TransactionResponse(
    string Id,
    string UserId,
    decimal Amount,
    string Type,
    string Category,
    string? CustomCategory,
    string Description,
    DateTime TransactionDate,
    string? Notes,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
