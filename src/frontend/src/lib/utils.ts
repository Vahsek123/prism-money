/** Format a number as currency (USD) */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Format a date string to locale display */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Format a date string for input[type="date"] */
export function toDateInputValue(dateString: string): string {
  return new Date(dateString).toISOString().split("T")[0];
}

/** Get today's date as input value */
export function todayInputValue(): string {
  return new Date().toISOString().split("T")[0];
}

/** Spending category display names */
export const CATEGORIES = [
  "Uncategorized",
  "Housing",
  "Utilities",
  "Groceries",
  "DiningOut",
  "Transportation",
  "Healthcare",
  "Insurance",
  "Entertainment",
  "Shopping",
  "Education",
  "PersonalCare",
  "Travel",
  "Subscriptions",
  "Savings",
  "Investments",
  "Gifts",
  "Salary",
  "Freelance",
  "Other",
] as const;

/** Human-readable category label */
export function categoryLabel(cat: string): string {
  return cat.replace(/([A-Z])/g, " $1").trim();
}

/** Month names */
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;
