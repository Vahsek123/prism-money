namespace Prism.Application.DTOs;

/// <summary>
/// Response DTO for a budget entry.
/// </summary>
public record BudgetResponse(
    string Id,
    string UserId,
    decimal Amount,
    string Category,
    int Year,
    int Month,
    decimal SpentAmount,
    decimal RemainingAmount,
    double PercentUsed,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
