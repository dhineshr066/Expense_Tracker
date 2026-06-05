// ==============================================
//  context/ExpenseContext.js
//  Global state for expenses using React Context.
//  Wrap <App> with <ExpenseProvider> so every
//  child component can read/update expenses.
// ==============================================

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as api from "../utils/api";

// 1. Create the context
const ExpenseContext = createContext();

// 2. Custom hook — components call useExpenses() to access the context
export const useExpenses = () => useContext(ExpenseContext);

// 3. Provider component — wraps the whole app
export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  // Filter state (shared between Dashboard and Expense List)
  const [filterCat, setFilterCat]     = useState("All");
  const [filterMonth, setFilterMonth] = useState("All");

  // ── Fetch all expenses from the backend ──────
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getExpenses(filterCat, filterMonth);
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterCat, filterMonth]);

  // Re-fetch whenever filters change
  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  // ── Add ──────────────────────────────────────
  const addExpense = async (expense) => {
    const newExp = await api.addExpense(expense);
    setExpenses((prev) => [newExp, ...prev]);
    return newExp;
  };

  // ── Update ───────────────────────────────────
  const updateExpense = async (id, updates) => {
    const updated = await api.updateExpense(id, updates);
    setExpenses((prev) => prev.map((e) => (e._id === id ? updated : e)));
    return updated;
  };

  // ── Delete ───────────────────────────────────
  const deleteExpense = async (id) => {
    await api.deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  };

  // ── Values exposed to all child components ───
  const value = {
    expenses,
    loading,
    error,
    filterCat,   setFilterCat,
    filterMonth, setFilterMonth,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};
