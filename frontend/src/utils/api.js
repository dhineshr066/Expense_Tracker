// ==============================================
//  utils/api.js
//  All HTTP calls to the Express backend.
//  If you change the backend URL, only edit BASE_URL.
// ==============================================
 // proxied to http://localhost:5000 via package.json "proxy"
const BASE_URL = "https://expense-tracker-7498.onrender.com/";
// ── Expense CRUD ──────────────────────────────

/** GET all expenses (optional filters: category, month) */
export const getExpenses = async (category = "All", month = "All") => {
  const params = new URLSearchParams();
  if (category !== "All") params.append("category", category);
  if (month !== "All")    params.append("month", month);

  const res  = await fetch(`${BASE_URL}/expenses?${params}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
};

/** POST create a new expense */
export const addExpense = async (expense) => {
  const res  = await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
};

/** PUT update an expense by id */
export const updateExpense = async (id, updates) => {
  const res  = await fetch(`${BASE_URL}/expenses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
};

/** DELETE remove an expense by id */
export const deleteExpense = async (id) => {
  const res  = await fetch(`${BASE_URL}/expenses/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return true;
};
