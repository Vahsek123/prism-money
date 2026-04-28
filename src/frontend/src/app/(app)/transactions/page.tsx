"use client";

import { useEffect, useState } from "react";
import { transactions as txApi, type Transaction, type CreateTransactionInput } from "@/lib/api";
import { formatCurrency, formatDate, categoryLabel, CATEGORIES, todayInputValue } from "@/lib/utils";

export default function TransactionsPage() {
  const [list, setList] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetch = () => { setLoading(true); txApi.list({ limit: 100 }).then(setList).catch(console.error).finally(() => setLoading(false)); };
  useEffect(fetch, []);

  const handleCreate = async (d: CreateTransactionInput) => { await txApi.create(d); setShowForm(false); fetch(); };
  const handleDelete = async (id: string) => { await txApi.delete(id); fetch(); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Transactions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track income and expenses.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 active:translate-y-0">
          {showForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      {showForm && <TxForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}

      {loading ? (
        <div className="flex justify-center py-16"><div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : list.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-16 text-center text-muted-foreground text-sm">No transactions yet.</div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Description</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium text-right">Amount</th>
              <th className="px-5 py-3 w-10" />
            </tr></thead>
            <tbody>
              {list.map((tx) => (
                <tr key={tx.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium">{tx.description}{tx.notes && <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">{tx.notes}</p>}</td>
                  <td className="px-5 py-3.5"><span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{categoryLabel(tx.customCategory || tx.category)}</span></td>
                  <td className="px-5 py-3.5 text-muted-foreground">{formatDate(tx.transactionDate)}</td>
                  <td className={`px-5 py-3.5 text-right font-medium tabular-nums ${tx.type === "Income" ? "text-success" : "text-danger"}`}>{tx.type === "Income" ? "+" : "-"}{formatCurrency(tx.amount)}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleDelete(tx.id)} className="text-muted-foreground hover:text-danger transition-colors" title="Delete">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TxForm({ onSubmit, onCancel }: { onSubmit: (d: CreateTransactionInput) => Promise<void>; onCancel: () => void }) {
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setBusy(true);
    const f = new FormData(e.currentTarget);
    await onSubmit({ amount: Number(f.get("amount")), type: f.get("type") as string, category: f.get("category") as string, description: f.get("description") as string, transactionDate: new Date(f.get("date") as string).toISOString(), notes: (f.get("notes") as string) || undefined });
    setBusy(false);
  };
  return (
    <form onSubmit={submit} className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-1.5"><span className="text-xs font-medium text-muted-foreground">Description *</span><input name="description" required placeholder="e.g. Groceries" className="input" /></label>
        <label className="flex flex-col gap-1.5"><span className="text-xs font-medium text-muted-foreground">Amount *</span><input name="amount" type="number" step="0.01" min="0.01" required placeholder="0.00" className="input" /></label>
        <label className="flex flex-col gap-1.5"><span className="text-xs font-medium text-muted-foreground">Type *</span><select name="type" required className="input"><option value="Expense">Expense</option><option value="Income">Income</option></select></label>
        <label className="flex flex-col gap-1.5"><span className="text-xs font-medium text-muted-foreground">Category</span><select name="category" className="input">{CATEGORIES.map((c) => <option key={c} value={c}>{categoryLabel(c)}</option>)}</select></label>
        <label className="flex flex-col gap-1.5"><span className="text-xs font-medium text-muted-foreground">Date *</span><input name="date" type="date" required defaultValue={todayInputValue()} className="input" /></label>
        <label className="flex flex-col gap-1.5"><span className="text-xs font-medium text-muted-foreground">Notes</span><input name="notes" placeholder="Optional" className="input" /></label>
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
        <button type="submit" disabled={busy} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{busy ? "Saving..." : "Save"}</button>
      </div>
    </form>
  );
}
