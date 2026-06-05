// ==============================================
//  components/AddExpenseForm.js
//  Form to add a new expense OR edit an existing one.
//
//  Props:
//    editExpense  – expense object to pre-fill (or null)
//    onCancel     – callback when user clicks Cancel
//    onSuccess    – callback(message) after save
// ==============================================

import React, { useState, useEffect } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from "../utils/constants";
import { todayStr } from "../utils/helpers";

// Default empty form values
const EMPTY = { title: "", amount: "", category: "Food", date: todayStr() };

const AddExpenseForm = ({ editExpense, onCancel, onSuccess }) => {
  const { addExpense, updateExpense } = useExpenses();
  const [form, setForm]   = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  // When editExpense changes, pre-fill the form
  useEffect(() => {
    if (editExpense) {
      setForm({
        title:    editExpense.title,
        amount:   String(editExpense.amount),
        category: editExpense.category,
        date:     editExpense.date,
      });
    } else {
      setForm(EMPTY);
    }
  }, [editExpense]);

  // Generic change handler for all inputs/selects
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.amount || isNaN(+form.amount) || +form.amount <= 0) {
      alert("Please fill all fields with valid values.");
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (editExpense) {
        await updateExpense(editExpense._id, payload);
        onSuccess("Expense updated successfully!");
      } else {
        await addExpense(payload);
        onSuccess("Expense added successfully!");
        setForm(EMPTY); // reset only when adding
      }
    } catch (err) {
      alert("Error saving expense: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>

      {/* ── Main form card ── */}
      <div style={styles.card}>
        <h2 style={styles.heading}>
          {editExpense ? "✏️ Edit Expense" : "➕ Add New Expense"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Title */}
          <div>
            <label style={styles.label}>TITLE</label>
            <input
              name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Lunch at Cafe, Uber ride..."
              style={styles.input}
            />
          </div>

          {/* Amount */}
          <div>
            <label style={styles.label}>AMOUNT (₹)</label>
            <input
              type="number" name="amount" value={form.amount}
              onChange={handleChange} placeholder="0.00" min="0.01" step="0.01"
              style={styles.input}
            />
          </div>

          {/* Category dropdown */}
          <div>
            <label style={styles.label}>CATEGORY</label>
            <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label style={styles.label}>DATE</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} style={styles.input} />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {editExpense && (
              <button type="button" onClick={onCancel} style={styles.cancelBtn}>
                Cancel
              </button>
            )}
            <button type="submit" disabled={saving} style={{ ...styles.submitBtn, flex: editExpense ? 2 : 1 }}>
              {saving ? "Saving..." : editExpense ? "Update Expense" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Category quick-pick chips ── */}
      <div style={{ ...styles.card, marginTop: 14 }}>
        <p style={styles.label}>QUICK CATEGORIES</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CATEGORIES.map((c) => {
            const active = form.category === c;
            return (
              <button
                key={c} type="button"
                onClick={() => setForm((f) => ({ ...f, category: c }))}
                style={{
                  padding: "6px 12px", borderRadius: 99, cursor: "pointer",
                  border: `1.5px solid ${active ? CATEGORY_COLORS[c] : "#e5e7eb"}`,
                  background: active ? CATEGORY_COLORS[c] + "18" : "transparent",
                  color: active ? CATEGORY_COLORS[c] : "#6b7280",
                  fontSize: 12, fontWeight: 500, fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >
                {CATEGORY_ICONS[c]} {c}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Inline styles ──────────────────────────────
const styles = {
  card: {
    background: "var(--color-bg-card)",
    borderRadius: 16, padding: "22px 24px",
    border: "0.5px solid var(--color-border)",
    boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
  },
  heading: { margin: "0 0 20px", fontSize: 18, fontWeight: 600 },
  label: {
    display: "block", marginBottom: 6,
    fontSize: 11, fontWeight: 600,
    color: "#9ca3af", letterSpacing: "0.5px",
  },
  input: {
    width: "100%", boxSizing: "border-box",
    padding: "10px 14px", borderRadius: 10, fontSize: 14,
    border: "1px solid var(--color-border)",
    background: "var(--color-bg)", color: "var(--color-text)",
    fontFamily: "inherit", outline: "none",
  },
  cancelBtn: {
    flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer",
    border: "1px solid var(--color-border)", background: "transparent",
    color: "var(--color-text-muted)", fontWeight: 500, fontSize: 14, fontFamily: "inherit",
  },
  submitBtn: {
    padding: "12px", borderRadius: 10, cursor: "pointer",
    border: "none", background: "#3b82f6", color: "#fff",
    fontWeight: 600, fontSize: 14, fontFamily: "inherit",
  },
};

export default AddExpenseForm;
