import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [dark, setDark] = useState(true);

  const navigate = useNavigate();

  // 🔐 Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  // 📥 Fetch
  const fetchTransactions = async () => {
    try {
      const res = await API.get("/expenses");
      setTransactions(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ➕ Add
  const addTransaction = async () => {
    if (!amount || !category) return;

    try {
      await API.post("/add-expense", {
        title: category,
        amount: Number(amount),
      });

      setAmount("");
      setCategory("");
      fetchTransactions();
    } catch (err) {
      console.log(err);
    }
  };

  // ❌ Delete
  const deleteTransaction = async (id) => {
    try {
      await API.delete(`/delete-expense/${id}`);
      fetchTransactions();
    } catch (err) {
      console.log(err);
    }
  };

  // 📊 Calculations
  const totalIncome = transactions
    .filter((t) => Number(t.amount) > 0)
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => Number(t.amount) < 0)
    .reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);

  const balance = totalIncome - totalExpense;

  // 🔐 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // 🎨 THEME COLORS
  const theme = dark
    ? { bg: "#0f172a", card: "#1e293b", text: "#fff" }
    : { bg: "#f1f5f9", card: "#ffffff", text: "#000" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: theme.bg }}>
      
      {/* 🔥 SIDEBAR */}
      <div
        style={{
          width: "220px",
          background: theme.card,
          padding: "20px",
          color: theme.text,
        }}
      >
        <h3>Expense Tracker</h3>

        <button
          onClick={() => setDark(!dark)}
          style={{
            marginTop: "20px",
            padding: "10px",
            width: "100%",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Toggle Theme
        </button>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "10px",
            width: "100%",
            borderRadius: "8px",
            background: "#ef4444",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div style={{ flex: 1, padding: "20px", color: theme.text }}>
        <h2>Dashboard</h2>

        {/* 📊 CARDS */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          {[balance, totalIncome, totalExpense].map((val, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "20px",
                borderRadius: "12px",
                background: theme.card,
                transition: "0.3s",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <h4>
                {i === 0
                  ? "Balance"
                  : i === 1
                  ? "Income"
                  : "Expense"}
              </h4>
              <h2>₹{val}</h2>
            </div>
          ))}
        </div>

        {/* ➕ ADD */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button onClick={addTransaction}>Add</button>
        </div>

        {/* 📄 LIST */}
        {transactions.map((t) => (
          <div
            key={t._id}
            style={{
              padding: "10px",
              marginBottom: "10px",
              background: theme.card,
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              transition: "0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <span>{t.title} - ₹{t.amount}</span>
            <button onClick={() => deleteTransaction(t._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;