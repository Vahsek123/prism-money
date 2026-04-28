const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5139";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// --- Transactions ---

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  category: string;
  customCategory: string | null;
  description: string;
  transactionDate: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionInput {
  amount: number;
  type: string;
  category?: string;
  customCategory?: string;
  description: string;
  transactionDate: string;
  notes?: string;
}

export interface UpdateTransactionInput {
  amount?: number;
  type?: string;
  category?: string;
  customCategory?: string;
  description?: string;
  transactionDate?: string;
  notes?: string;
}

export const transactions = {
  list: (params?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    if (params?.category) query.set("category", params.category);
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return request<Transaction[]>(`/api/transactions${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => request<Transaction>(`/api/transactions/${id}`),
  create: (data: CreateTransactionInput) =>
    request<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateTransactionInput) =>
    request<Transaction>(`/api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/api/transactions/${id}`, { method: "DELETE" }),
};

// --- Budgets ---

export interface Budget {
  id: string;
  userId: string;
  amount: number;
  category: string;
  year: number;
  month: number;
  spentAmount: number;
  remainingAmount: number;
  percentUsed: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetInput {
  amount: number;
  category: string;
  year: number;
  month: number;
}

export const budgets = {
  list: (params?: { year?: number; month?: number }) => {
    const query = new URLSearchParams();
    if (params?.year) query.set("year", String(params.year));
    if (params?.month) query.set("month", String(params.month));
    const qs = query.toString();
    return request<Budget[]>(`/api/budgets${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => request<Budget>(`/api/budgets/${id}`),
  create: (data: CreateBudgetInput) =>
    request<Budget>("/api/budgets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/api/budgets/${id}`, { method: "DELETE" }),
};

// --- Holdings ---

export interface Holding {
  id: string;
  userId: string;
  tickerSymbol: string;
  quantity: number;
  costPerShare: number;
  totalCostBasis: number;
  currentPrice: number | null;
  currentValue: number | null;
  gainLoss: number | null;
  gainLossPercent: number | null;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHoldingInput {
  tickerSymbol: string;
  quantity: number;
  costPerShare: number;
  purchaseDate?: string;
}

export const holdings = {
  list: () => request<Holding[]>("/api/holdings"),
  get: (id: string) => request<Holding>(`/api/holdings/${id}`),
  create: (data: CreateHoldingInput) =>
    request<Holding>("/api/holdings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/api/holdings/${id}`, { method: "DELETE" }),
};

// --- Health ---

export const health = {
  check: () =>
    request<{ status: string; timestamp: string; version: string }>(
      "/api/health"
    ),
};
