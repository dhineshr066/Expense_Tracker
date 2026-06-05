// ==============================================
//  components/Toast.js
//  Small popup notification at top-right corner.
//  Props: message (string), type ("success"|"error"|"info")
// ==============================================

import React from "react";

const COLORS = {
  success: { bg: "#f0fdf4", border: "#86efac", text: "#16a34a" },
  error:   { bg: "#fef2f2", border: "#fca5a5", text: "#dc2626" },
  info:    { bg: "#eff6ff", border: "#93c5fd", text: "#2563eb" },
};

const Toast = ({ message, type = "success" }) => {
  const c = COLORS[type] || COLORS.success;

  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 9999,
      padding: "12px 20px", borderRadius: 12,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontWeight: 500, fontSize: 14,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      animation: "slideIn 0.3s ease",
    }}>
      {message}
    </div>
  );
};

export default Toast;
