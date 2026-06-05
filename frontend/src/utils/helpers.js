// ==============================================
//  utils/helpers.js
//  Small helper / formatting functions
// ==============================================

/** Format a number as Indian Rupees: ₹1,23,456 */
export const formatCurrency = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

/** Format a "YYYY-MM-DD" string to "12 Aug 2024" */
export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/** Return today's date as "YYYY-MM-DD" */
export const todayStr = () => new Date().toISOString().split("T")[0];

/** Build category totals from an array of expenses */
export const buildCategoryTotals = (expenses, categories) =>
  categories.reduce((acc, cat) => {
    acc[cat] = expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0);
    return acc;
  }, {});
