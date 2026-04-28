using Prism.Core.Enums;

namespace Prism.Core.Entities;

/// <summary>
/// Represents a financial transaction (income or expense) belonging to a user.
/// This is the core domain entity for all spending/earning activity.
/// </summary>
public class Transaction
{
    /// <summary>
    /// Unique identifier for this transaction.
    /// Generated as a ULID string for time-sortable, globally unique IDs.
    /// </summary>
    public required string Id { get; init; }

    /// <summary>
    /// The ID of the user who owns this transaction.
    /// Used for row-level data isolation in DynamoDB.
    /// </summary>
    public required string UserId { get; init; }

    /// <summary>
    /// The monetary amount. Always stored as a positive value.
    /// The <see cref="Type"/> property determines if it's income or expense.
    /// </summary>
    /// <remarks>
    /// We use <c>decimal</c> instead of <c>double</c> because financial
    /// calculations require exact precision. <c>double</c> uses binary
    /// floating-point which causes rounding errors (e.g., 0.1 + 0.2 != 0.3).
    /// <c>decimal</c> uses base-10 representation — perfect for money.
    /// </remarks>
    public required decimal Amount { get; set; }

    /// <summary>
    /// Whether this is an income or expense transaction.
    /// </summary>
    public required TransactionType Type { get; set; }

    /// <summary>
    /// The spending/earning category from the predefined set.
    /// Used for budget tracking, aggregations, and habit analysis.
    /// </summary>
    public SpendingCategory Category { get; set; } = SpendingCategory.Uncategorized;

    /// <summary>
    /// Optional custom category label provided by the user.
    /// When set, takes display priority over <see cref="Category"/>.
    /// The predefined category is still used for analytics grouping.
    /// </summary>
    public string? CustomCategory { get; set; }

    /// <summary>
    /// A short description of the transaction (e.g., "Woolworths groceries").
    /// Used for display and auto-categorization matching.
    /// </summary>
    public required string Description { get; set; }

    /// <summary>
    /// The date the transaction occurred (not when it was entered).
    /// Stored as UTC. UI converts to local time for display.
    /// </summary>
    public required DateTime TransactionDate { get; set; }

    /// <summary>
    /// Optional free-text notes (e.g., "birthday dinner with friends").
    /// </summary>
    public string? Notes { get; set; }

    /// <summary>
    /// When this record was created. Set once on creation, never modified.
    /// </summary>
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;

    /// <summary>
    /// When this record was last updated.
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
