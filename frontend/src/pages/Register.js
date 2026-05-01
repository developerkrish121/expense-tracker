import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleRegister = async () => {
  if (!email || !password) {
    return toast.error("All fields required");
  }

  try {
    await axios.post("https://expense-tracker-y6hk.onrender.com/register", {
      email,
      password,
    });

    toast.success("Registered successfully");

    setTimeout(() => {
      window.location.href = "/";
    }, 1500);

  } catch (error) {
    console.log("REGISTER ERROR:", error);

    const message =
      error.response?.data?.message || "Registration failed";

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
        <h2 className="text-center mb-4">Create Account 🚀</h2>

       
       

      
        <input
          className="form-control mb-3"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

   
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

  
        <button
          className="btn w-100"
          style={{
            background: "#3b82f6",
            color: "#fff",
            borderRadius: "10px",
          }}
          onClick={handleRegister}
        >
          Register
        </button>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <span
            style={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => (window.location.href = "/")}
          >
            Login
          </span>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Register;