"use client";

import { useEffect, useState } from "react";
import {
  transactions as txApi,
  budgets as budgetApi,
  holdings as holdingApi,
  type Transaction,
  type Budget,
  type Holding,
} from "@/lib/api";
import { formatCurrency, formatDate, categoryLabel } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      txApi.list({ limit: 5 }),
      budgetApi.list({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 }),
      holdingApi.list(),
    ])
      .then(([tx, bg, hd]) => { setTransactions(tx); setBudgets(bg); setHoldings(hd); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalExpenses = transactions.filter((t) => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
  const totalIncome = transactions.filter((t) => t.type === "Income").reduce((s, t) => s + t.amount, 0);
  const portfolioValue = holdings.reduce((s, h) => s + (h.currentValue ?? h.totalCostBasis), 0);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your financial overview.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Income" value={formatCurrency(totalIncome)} className="text-success" />
        <StatCard label="Expenses" value={formatCurrency(totalExpenses)} className="text-danger" />
        <StatCard label="Portfolio" value={formatCurrency(portfolioValue)} className="text-primary" />
        <StatCard label="Net" value={formatCurrency(totalIncome - totalExpenses + portfolioValue)} className="text-foreground" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent transactions */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Recent Transactions</h2>
            <Link href="/transactions" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No transactions yet. <Link href="/transactions" className="text-primary hover:underline">Add one</Link></p>
          ) : (
            <ul className="space-y-3">
              {transactions.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{categoryLabel(tx.category)} · {formatDate(tx.transactionDate)}</p>
                  </div>
                  <span className={tx.type === "Income" ? "text-success" : "text-danger"}>
                    {tx.type === "Income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Budget status */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Budgets</h2>
            <Link href="/budgets" className="text-xs text-primary hover:underline">Manage →</Link>
          </div>
          {budgets.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No budgets set. <Link href="/budgets" className="text-primary hover:underline">Create one</Link></p>
          ) : (
            <ul className="space-y-4">
              {budgets.map((b) => (
                <li key={b.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{categoryLabel(b.category)}</span>
                    <span className="text-muted-foreground text-xs">{formatCurrency(b.spentAmount)} / {formatCurrency(b.amount)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${b.percentUsed > 90 ? "bg-danger" : b.percentUsed > 70 ? "bg-warning" : "bg-primary"}`}
                      style={{ width: `${Math.min(b.percentUsed, 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`mt-1.5 text-lg font-semibold tabular-nums ${className}`}>{value}</p>
    </div>
  );
}
