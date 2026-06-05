// ==============================================
//  components/Dashboard.js
//  Shows dashboard summary cards and category chart.
//  No props needed - reads from ExpenseContext.
// ==============================================

import React from "react";
import { useExpenses } from "../context/ExpenseContext";
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from "../utils/constants";
import { formatCurrency, buildCategoryTotals } from "../utils/helpers";

const Dashboard = () => {
  const { expenses } = useExpenses();

  // ── Derived data ─────────────────────────────
  const catTotals    = buildCategoryTotals(expenses, CATEGORIES);
  const totalSpend   = expenses.reduce((s, e) => s + e.amount, 0);
  const topCat       = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
  const avgPerExpense = expenses.length ? Math.round(totalSpend / expenses.length) : 0;

  const maxCatAmt  = Math.max(...Object.values(catTotals), 1);

  return (
    <div>
      {/* ── 4 metric cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Spent",      value: formatCurrency(totalSpend),   sub: `${expenses.length} expenses`, color: "#3b82f6" },
          { label: "Top Category",     value: topCat?.[0] || "—",           sub: topCat ? formatCurrency(topCat[1]) : "No data", color: "#f59e0b" },
          { label: "Avg per Expense",  value: formatCurrency(avgPerExpense), sub: "average", color: "#a855f7" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={styles.metricCard}>
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6, fontWeight: 600, letterSpacing: "0.3px" }}>{label.toUpperCase()}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color, letterSpacing: "-0.5px", marginBottom: 3 }}>{value}</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{sub}</div>
          </div>
        ))}
      </div>

  {/* ── Chart ── */}
  <div style={{ marginBottom: 20 }}>

        {/* Category breakdown */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Spending by Category</h3>
          {CATEGORIES.filter((c) => catTotals[c] > 0)
            .sort((a, b) => catTotals[b] - catTotals[a])
            .map((cat) => (
              <div key={cat} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                  <span>{CATEGORY_ICONS[cat]} {cat}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#6b7280" }}>
                    {formatCurrency(catTotals[cat])}
                  </span>
                </div>
                <div style={{ height: 6, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 99,
                    width: `${(catTotals[cat] / maxCatAmt) * 100}%`,
                    background: CATEGORY_COLORS[cat],
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            ))}
          {!CATEGORIES.some((c) => catTotals[c] > 0) && (
            <p style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", marginTop: 20 }}>No expenses yet</p>
          )}
        </div>

      </div>

      
    </div>
  );
};

// ── Styles ─────────────────────────────────────
const styles = {
  metricCard: {
    background: "var(--color-bg-card)", borderRadius: 14,
    padding: "16px 18px", border: "0.5px solid var(--color-border)",
  },
  card: {
    background: "var(--color-bg-card)", borderRadius: 14,
    padding: "18px", border: "0.5px solid var(--color-border)",
  },
  cardTitle: { margin: "0 0 16px", fontSize: 14, fontWeight: 600 },
};

export default Dashboard;
