import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate(); // ✅ FIX

  // // 🔐 Check auth
  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     navigate("/"); // ✅ FIX
  //   }
  // }, [navigate]);

  // 📥 Fetch data
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

  // ➕ Add Transaction
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

  // ❌ Delete Transaction
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
    navigate("/"); // ✅ FIX
  };

  // 🎨 Styles
  const cardStyle = (color) => ({
    flex: 1,
    padding: "20px",
    borderRadius: "15px",
    background: color,
    color: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  });

  const inputStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    flex: 1,
  };

  const addBtn = {
    background: "#3b82f6",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        padding: "20px 40px",
        color: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2>💰 Expense Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={cardStyle("#3b82f6")}>
          <h6>Total Balance</h6>
          <h3>₹{balance}</h3>
        </div>

        <div style={cardStyle("#22c55e")}>
          <h6>Total Income</h6>
          <h3>₹{totalIncome}</h3>
        </div>

        <div style={cardStyle("#ef4444")}>
          <h6>Total Expense</h6>
          <h3>₹{totalExpense}</h3>
        </div>
      </div>

      {/* Add */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <input
          placeholder="Amount (+income / -expense)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        />

        <button onClick={addTransaction} style={addBtn}>
          Add
        </button>
      </div>

      {/* Transactions */}
      <h4>Recent Transactions</h4>

      {transactions.length === 0 && (
        <p style={{ color: "#aaa" }}>Start tracking your expenses 💸</p>
      )}

      {transactions.map((t) => (
        <div
          key={t._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "15px",
            marginBottom: "10px",
            background: "#1e293b",
            borderRadius: "10px",
            borderLeft:
              Number(t.amount) > 0
                ? "5px solid #22c55e"
                : "5px solid #ef4444",
          }}
        >
          <div>
            <strong>₹{Number(t.amount)}</strong>
            <div style={{ fontSize: "13px", color: "#aaa" }}>
              {t.title}
            </div>
          </div>

          <button
            className="btn btn-sm btn-danger"
            onClick={() => deleteTransaction(t._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;