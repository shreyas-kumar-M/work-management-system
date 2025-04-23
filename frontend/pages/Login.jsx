import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme"; // Custom hook for theme management


const BASE_URL = import.meta.env.VITE_API_URL;


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ Use error state
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // Using the custom hook

  const handleLogin = async () => {
    try {
      const res = await fetch(`${BASE_URL}api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const decoded = jwtDecode(data.token); // ✅ Decode JWT
        console.log("Decoded token:", decoded); // Debugging log

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", decoded.role); // ✅ Store the role correctly
        localStorage.setItem("id", decoded.id); // ✅ Store the role correctly

        if (decoded.role === "Admin") {
          navigate("/admin-dashboard");
        } else if (decoded.role === "Manager") {
          navigate("/manager-dashboard");
        } else if (decoded.role === "Employee") {
          navigate("/employee-dashboard");
        } else {
          console.error("Invalid role:", decoded.role);
          setError("Invalid user role");
        }
      } else {
        setError(data.message); // ✅ Display error message in UI
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again."); // ✅ Handle fetch errors
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen transition-all duration-300 text-[var(--text-color)]"
      style={{ background: "var(--background-gradient)" }}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute text-white top-4 right-4 p-2 rounded-full bg-[var(--theme-bg)] hover:bg-opacity-80 transition-[transform,background-color] active:scale-95 "
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      {/* Login Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="p-8 rounded-lg shadow-xl w-96 transition-all duration-300 backdrop-blur-2xl ring-inset ring-1 ring-[var(--text-color)]/20 bg-[var(--form-bg)]"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 border rounded bg-[var(--input-bg)] text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded bg-[var(--input-bg)] text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] text-[var(--button-text)] p-3 rounded duration-200 transition-[transform,background-color] active:scale-95"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
