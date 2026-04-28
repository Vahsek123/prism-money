namespace Prism.Core.Enums;

/// <summary>
/// Standard spending categories for transaction classification.
/// Users can also use custom category strings, but these provide
/// a baseline for auto-categorization and analytics.
/// </summary>
public enum SpendingCategory
{
    Uncategorized = 0,
    Housing,
    Utilities,
    Groceries,
    DiningOut,
    Transportation,
    Healthcare,
    Insurance,
    Entertainment,
    Shopping,
    Education,
    PersonalCare,
    Travel,
    Subscriptions,
    Savings,
    Investments,
    Gifts,
    Salary,
    Freelance,
    Other
}
