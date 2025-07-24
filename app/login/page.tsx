"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "next/navigation";

const yellow = "#FFD600";
const darkBlue = "#0a0f29";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", form);
      login(res.data.token);
      toast.success("Login successful!");
      router.push("/"); // or "/inbox" if you want to redirect to inbox
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f29] via-[#1a1f3a] to-[#23284a] px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl border border-yellow-100 p-10 flex flex-col gap-6 relative z-10"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <h2 className="text-3xl font-bold text-center text-[#0a0f29] mb-2">Login</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 rounded-full mx-auto mb-6" />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border-b-2 bg-transparent text-[#0a0f29] placeholder-[#0a0f29]/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg py-2"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border-b-2 bg-transparent text-[#0a0f29] placeholder-[#0a0f29]/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg py-2"
          value={form.password}
          onChange={handleChange}
          required
        />
        <motion.button
          type="submit"
          className="border border-yellow-400 px-8 py-3 text-white bg-yellow-400 hover:bg-yellow-300 hover:text-black font-bold rounded-full transition flex items-center justify-center relative overflow-hidden shadow-lg mt-4"
          disabled={loading}
          whileHover={{ scale: 1.04, boxShadow: `0 0 16px 2px ${yellow}` }}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
          <motion.span
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            whileTap={{ opacity: 0.2, scale: 1.2, background: yellow }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </motion.form>
    </motion.section>
  );
}
