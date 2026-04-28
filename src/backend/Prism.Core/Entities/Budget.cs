using Prism.Core.Enums;

namespace Prism.Core.Entities;

/// <summary>
/// Represents a monthly budget plan per category
/// </summary>
public class Budget
{
  /// <summary>
  /// Unique Identifier for this budget entry
  /// </summary>
  public required string Id { get; init; }

  /// <summary>
  /// The ID of the user who owns this budget entry
  /// </summary>
  public required string UserId { get; init; }

  /// <summary>
  /// The amount of money allocated to this budget category
  /// </summary>
  public required decimal Amount { get; set; }

  /// <summary>
  /// The spending category this budget applies to
  /// </summary>
  public required SpendingCategory Category { get; set; }

  /// <summary>
  /// The year this budget applies to (e.g., 2026).
  /// Combined with <see cref="Month"/> to identify the budget period.
  /// </summary>
  public required int Year { get; set; }

  /// <summary>
  /// The month this budget applies to (1–12).
  /// Combined with <see cref="Year"/> to identify the budget period.
  /// </summary>
  public required int Month { get; set; }

  /// <summary>
  /// When this record was created. Set once on creation, never modified.
  /// </summary>
  public DateTime CreatedAt { get; init; } = DateTime.UtcNow;

  /// <summary>
  /// When this record was last updated.
  /// </summary>
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}