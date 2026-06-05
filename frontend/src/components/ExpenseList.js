// ==============================================
//  components/ExpenseList.js
//  Displays all expenses with filter controls.
//  Allows editing and deleting each row.
//
//  Props:
//    onEdit(expense) – called when user clicks Edit
//    onToast(msg, type) – show a toast message
// ==============================================

import React, { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from "../utils/constants";
import { formatCurrency, formatDate } from "../utils/helpers";

const ExpenseList = ({ onEdit, onToast }) => {
  const {
    expenses, loading, error,
    filterCat, setFilterCat,
    filterMonth, setFilterMonth,
    deleteExpense,
  } = useExpenses();

  const [deletingId, setDeletingId] = useState(null); // track which row is being deleted

  // Build unique month options from existing expenses
  const months = ["All", ...Array.from(new Set(expenses.map((e) => e.date.slice(0, 7)))).sort((a, b) => b.localeCompare(a))];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteExpense(id);
      onToast("Expense deleted", "info");
    } catch (err) {
      onToast("Delete failed: " + err.message, "error");
    } finally {
      setDeletingId(null);
    }
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      {/* ── Filter bar ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} style={styles.select}>
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
        </select>

        <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} style={styles.select}>
          {months.map((m) => (
            <option key={m} value={m}>
              {m === "All" ? "All Months" : new Date(m + "-01").toLocaleString("en", { month: "long", year: "numeric" })}
            </option>
          ))}
        </select>
      </div>

      {/* ── Summary bar ── */}
      <div style={styles.summaryBar}>
        <span style={{ fontSize: 13, color: "#6b7280" }}>{expenses.length} expense{expenses.length !== 1 ? "s" : ""}</span>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#3b82f6" }}>Total: {formatCurrency(total)}</span>
      </div>

      {/* ── States: loading / error / empty ── */}
      {loading && <p style={styles.stateText}>⏳ Loading expenses...</p>}
      {error   && <p style={{ ...styles.stateText, color: "#dc2626" }}>❌ {error}</p>}

      {!loading && !error && expenses.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <p style={{ margin: 0, fontSize: 15 }}>No expenses found. Add your first one!</p>
        </div>
      )}

      {/* ── Expense rows ── */}
      {!loading && expenses.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {expenses.map((exp) => (
            <div key={exp._id} style={styles.row}>

              {/* Category icon badge */}
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: CATEGORY_COLORS[exp.category] + "18",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              }}>
                {CATEGORY_ICONS[exp.category]}
              </div>

              {/* Title + meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {exp.title}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 99, fontWeight: 500,
                    background: CATEGORY_COLORS[exp.category] + "18",
                    color: CATEGORY_COLORS[exp.category],
                  }}>
                    {exp.category}
                  </span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>{formatDate(exp.date)}</span>
                </div>
              </div>

              {/* Amount */}
              <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 16, flexShrink: 0 }}>
                {formatCurrency(exp.amount)}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button onClick={() => onEdit(exp)} style={styles.editBtn}>Edit</button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  disabled={deletingId === exp._id}
                  style={styles.deleteBtn}
                >
                  {deletingId === exp._id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Inline styles ──────────────────────────────
const styles = {
  select: {
    flex: 1, minWidth: 140, padding: "10px 14px", borderRadius: 10,
    border: "1px solid var(--color-border)", background: "var(--color-bg)",
    color: "var(--color-text)", fontSize: 13, fontFamily: "inherit", outline: "none",
  },
  summaryBar: {
    background: "var(--color-bg-card)", borderRadius: 12,
    padding: "12px 16px", border: "0.5px solid var(--color-border)",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 12,
  },
  stateText: { textAlign: "center", color: "#9ca3af", padding: "40px 0" },
  row: {
    background: "var(--color-bg-card)", borderRadius: 12,
    padding: "14px 16px", border: "0.5px solid var(--color-border)",
    display: "flex", alignItems: "center", gap: 14,
  },
  editBtn: {
    padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
    background: "#eff6ff", color: "#2563eb", fontSize: 12, fontWeight: 500,
    fontFamily: "inherit",
  },
  deleteBtn: {
    padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
    background: "#fef2f2", color: "#dc2626", fontSize: 12, fontWeight: 500,
    fontFamily: "inherit",
  },
};

export default ExpenseList;
