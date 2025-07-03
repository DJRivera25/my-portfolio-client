import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      if (data.user.role !== "admin") {
        setError("Access denied. You are not an admin.");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/"); // Redirect to homepage or admin dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f29] text-white px-4">
      <form onSubmit={handleSubmit} className="bg-black/80 backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400">Admin Login</h2>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded font-semibold transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
