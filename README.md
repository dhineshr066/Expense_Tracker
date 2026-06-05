# 💰 Expense Tracker

A modern web-based Expense Tracker application that helps users manage their daily expenses, monitor spending habits, and gain better control over personal finances through an intuitive dashboard.

## 🌐 Live Demo

**Deployment Link:**
https://expense-tracker-5-wa2u.onrender.com

---
# 💰 Smart Expense Tracker

A full-stack web application to track and manage expenses.

---

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── middleware/
│   │   ├── logger.js           ← Logs every HTTP request
│   │   └── errorHandler.js     ← Central error handler
│   ├── models/
│   │   └── Expense.js          ← MongoDB schema
│   ├── routes/
│   │   └── expenseRoutes.js    ← CRUD REST API
│   ├── .env                    ← Your keys go here
│   ├── server.js               ← Entry point
│   └── package.json
│
└── frontend/
    ├── public/index.html
    └── src/
        ├── components/
        │   ├── AddExpenseForm.js
        │   ├── Dashboard.js
        │   ├── ExpenseList.js
        │   └── Toast.js
        ├── context/
        │   └── ExpenseContext.js
        ├── utils/
        │   ├── api.js
        │   ├── constants.js
        │   └── helpers.js
        ├── App.js
        ├── App.css
        └── index.js
```

---

## 🚀 How to Run

### Step 1 — Setup Backend

```bash
cd expense-tracker/backend
npm install
```

Edit `.env` file:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```
Get free MongoDB Atlas at: https://www.mongodb.com/atlas

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

### Step 2 — Setup Frontend

Open a new terminal:
```bash
cd expense-tracker/frontend
npm install
npm start
```

App opens at: http://localhost:3000

---

## 🌐 API Endpoints

| Method | Endpoint              | Description             |
|--------|-----------------------|-------------------------|
| GET    | /api/expenses         | Get all expenses        |
| POST   | /api/expenses         | Add new expense         |
| PUT    | /api/expenses/:id     | Update expense          |
| DELETE | /api/expenses/:id     | Delete expense          |

---

## 🛠️ Tech Stack

| Layer    | Technology                  |
|----------|-----------------------------|
| Frontend | React 18, Context API, CSS  |
| Backend  | Node.js, Express.js         |
| Database | MongoDB, Mongoose           |
