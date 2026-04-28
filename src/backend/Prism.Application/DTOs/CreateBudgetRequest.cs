using System.ComponentModel.DataAnnotations;

namespace Prism.Application.DTOs;

/// <summary>
/// Request DTO for creating a new budget.
/// </summary>
public record CreateBudgetRequest(
    [Required] decimal Amount,
    [Required] string Category,
    [Required][Range(2000, 2100)] int Year,
    [Required][Range(1, 12)] int Month
);
