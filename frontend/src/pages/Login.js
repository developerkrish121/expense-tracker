import { useState, useEffect } from "react";
import API from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      return toast.error("Please fill all fields ❌");
    }

    try {
      const res = await API.post("/login", {
        email,
        password,
      });

      // 🔥 Save token
      localStorage.setItem("token", res.data.token);

      toast.success("Login successful 🚀");

      // 🔥 Redirect
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);

    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed ❌";

      toast.error(message);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
      }}
    >
      <div
        className="p-4 shadow-lg"
        style={{
          width: "380px",
          borderRadius: "20px",
          background: "#1e293b",
        }}
      >
        <h2 className="text-center mb-4">Welcome Back 👋</h2>

        {/* Email */}
        <input
          className="form-control mb-3"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          className="btn w-100"
          style={{
            background: "#3b82f6",
            color: "#fff",
            borderRadius: "10px",
          }}
          onClick={handleLogin}
        >
          Login
        </button>

        {/* Register */}
        <p className="text-center mt-3">
          Don’t have an account?{" "}
          <span
            style={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => (window.location.href = "/register")}
          >
            Register
          </span>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;