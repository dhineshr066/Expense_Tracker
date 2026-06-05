// ==============================================
//  App.js  –  Root component
//  Manages which tab is active and renders the
//  correct child component.
// ==============================================

import React, { useState } from "react";
import { ExpenseProvider } from "./context/ExpenseContext";
import Dashboard      from "./components/Dashboard";
import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseList    from "./components/ExpenseList";
import Toast          from "./components/Toast";
import "./App.css";

const App = () => {
  const [activeTab, setActiveTab]   = useState("dashboard");
  const [editExpense, setEditExpense] = useState(null); // expense being edited (or null)
  const [toast, setToast]           = useState(null);   // { msg, type }

  // Show a toast for 3 seconds
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Called when user clicks Edit on an expense row
  const handleEdit = (expense) => {
    setEditExpense(expense);
    setActiveTab("add");
  };

  // Called after a successful add or update
  const handleFormSuccess = (msg) => {
    showToast(msg);
    setEditExpense(null);
    setActiveTab("expenses");
  };

  // Cancel editing
  const handleCancel = () => {
    setEditExpense(null);
    setActiveTab("expenses");
  };

  const tabs = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "add",       label: editExpense ? "✏️ Edit" : "➕ Add" },
    { id: "expenses",  label: "📋 Expenses" },
  ];

  return (
    // ExpenseProvider wraps everything so all components share the same data
    <ExpenseProvider>
      <div className="app-container">

        {/* ── Toast notification ── */}
        {toast && <Toast message={toast.msg} type={toast.type} />}

        {/* ── Header ── */}
        <header className="app-header">
          <div>
            <h1 className="app-title">💰 Smart Expense Tracker</h1>
            <p className="app-subtitle">Track and optimize your spending</p>
          </div>

          {/* Tab switcher */}
          <nav className="tab-bar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => {
                  if (tab.id !== "add") setEditExpense(null); // clear edit when switching away
                  setActiveTab(tab.id);
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        {/* ── Main content ── */}
        <main className="app-main">
          {activeTab === "dashboard" && <Dashboard />}

          {activeTab === "add" && (
            <AddExpenseForm
              editExpense={editExpense}
              onCancel={handleCancel}
              onSuccess={handleFormSuccess}
            />
          )}

          {activeTab === "expenses" && (
            <ExpenseList
              onEdit={handleEdit}
              onToast={showToast}
            />
          )}
        </main>

      </div>
    </ExpenseProvider>
  );
};

export default App;
