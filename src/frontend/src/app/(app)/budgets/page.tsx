"use client";

import { useEffect, useState } from "react";
import { budgets as api, type Budget, type CreateBudgetInput } from "@/lib/api";
import { formatCurrency, categoryLabel, CATEGORIES, MONTHS } from "@/lib/utils";

export default function BudgetsPage() {
  const [list, setList] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const load = () => { setLoading(true); api.list({ year, month }).then(setList).catch(console.error).finally(() => setLoading(false)); };
  useEffect(load, [year, month]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Budgets</h1>
          <p className="mt-1 text-sm text-muted-foreground">Monthly spending limits.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5">
          {showForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="input w-auto">
          {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="input w-auto">
          {[year - 1, year, year + 1].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {showForm && (
        <form onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          await api.create({ amount: Number(f.get("amount")), category: f.get("category") as string, year, month });
          setShowForm(false); load();
        }} className="rounded-xl border border-border bg-card p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Category *</span>
              <select name="category" required className="input">
                {CATEGORIES.filter(c => c !== "Uncategorized").map(c => <option key={c} value={c}>{categoryLabel(c)}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Limit *</span>
              <input name="amount" type="number" step="0.01" min="1" required placeholder="500.00" className="input" />
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground">Cancel</button>
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Create</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : list.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-16 text-center text-muted-foreground text-sm">No budgets for {MONTHS[month - 1]} {year}.</div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {list.map((b) => (
            <div key={b.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold">{categoryLabel(b.category)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatCurrency(b.spentAmount)} of {formatCurrency(b.amount)}</p>
                </div>
                <span className={`text-sm font-semibold tabular-nums ${b.percentUsed > 90 ? "text-danger" : b.percentUsed > 70 ? "text-warning" : "text-success"}`}>{b.percentUsed}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${b.percentUsed > 90 ? "bg-danger" : b.percentUsed > 70 ? "bg-warning" : "bg-primary"}`} style={{ width: `${Math.min(b.percentUsed, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
