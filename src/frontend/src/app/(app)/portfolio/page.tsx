"use client";

import { useEffect, useState } from "react";
import { holdings as api, type Holding, type CreateHoldingInput } from "@/lib/api";
import { formatCurrency, formatDate, todayInputValue } from "@/lib/utils";

export default function PortfolioPage() {
  const [list, setList] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = () => { setLoading(true); api.list().then(setList).catch(console.error).finally(() => setLoading(false)); };
  useEffect(load, []);

  const totalCost = list.reduce((s, h) => s + h.totalCostBasis, 0);
  const totalVal = list.reduce((s, h) => s + (h.currentValue ?? h.totalCostBasis), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Portfolio</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track investment holdings.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5">
          {showForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          await api.create({ tickerSymbol: f.get("symbol") as string, quantity: Number(f.get("qty")), costPerShare: Number(f.get("cost")), purchaseDate: new Date(f.get("date") as string).toISOString() });
          setShowForm(false); load();
        }} className="rounded-xl border border-border bg-card p-5">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <label className="flex flex-col gap-1.5"><span className="text-xs font-medium text-muted-foreground">Symbol *</span><input name="symbol" required placeholder="AAPL" maxLength={10} className="input uppercase" /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-medium text-muted-foreground">Shares *</span><input name="qty" type="number" step="0.001" min="0.001" required placeholder="10" className="input" /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-medium text-muted-foreground">Cost/Share *</span><input name="cost" type="number" step="0.01" min="0.01" required placeholder="150.00" className="input" /></label>
            <label className="flex flex-col gap-1.5"><span className="text-xs font-medium text-muted-foreground">Date</span><input name="date" type="date" defaultValue={todayInputValue()} className="input" /></label>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground">Cancel</button>
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Add</button>
          </div>
        </form>
      )}

      {list.length > 0 && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Value</p><p className="mt-1.5 text-lg font-semibold tabular-nums">{formatCurrency(totalVal)}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Cost Basis</p><p className="mt-1.5 text-lg font-semibold tabular-nums text-muted-foreground">{formatCurrency(totalCost)}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Gain/Loss</p><p className={`mt-1.5 text-lg font-semibold tabular-nums ${totalVal - totalCost >= 0 ? "text-success" : "text-danger"}`}>{totalVal - totalCost >= 0 ? "+" : ""}{formatCurrency(totalVal - totalCost)}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Return</p><p className={`mt-1.5 text-lg font-semibold tabular-nums ${totalVal - totalCost >= 0 ? "text-success" : "text-danger"}`}>{totalCost > 0 ? `${((totalVal - totalCost) / totalCost * 100).toFixed(2)}%` : "—"}</p></div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : list.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-16 text-center text-muted-foreground text-sm">No holdings yet.</div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Symbol</th>
              <th className="px-5 py-3 font-medium text-right">Shares</th>
              <th className="px-5 py-3 font-medium text-right">Cost</th>
              <th className="px-5 py-3 font-medium text-right">Basis</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 w-10" />
            </tr></thead>
            <tbody>
              {list.map((h) => (
                <tr key={h.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-primary">{h.tickerSymbol}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums">{h.quantity}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">{formatCurrency(h.costPerShare)}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums">{formatCurrency(h.totalCostBasis)}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{formatDate(h.purchaseDate)}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={async () => { await api.delete(h.id); load(); }} className="text-muted-foreground hover:text-danger transition-colors">
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
