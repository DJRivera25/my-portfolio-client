"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowLeft, Loader2 } from "lucide-react";
import api from "../../src/lib/api/client";
import { useAuth } from "../../src/context/AuthContext";
import { loginContent } from "../../src/config/worklog";

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
      const res = await api.post<{ token: string }>("/api/auth/login", form);
      login(res.data.token);
      toast.success(loginContent.success);
      router.push("/worklog");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(msg || loginContent.failure);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20 max-[560px]:px-4">
      {/* One quiet gold bloom, echoing the homepage cursor glow without the interactivity. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(224,165,61,0.10) 0%, rgba(224,165,61,0.03) 40%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[400px]">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 font-codet text-[11px] uppercase tracking-[0.14em] text-atelier-faint transition-colors hover:text-atelier-paper"
        >
          <ArrowLeft size={13} aria-hidden />
          {loginContent.back}
        </Link>

        <div className="mb-7 flex items-center gap-3.5">
          <span className="h-px w-11 bg-atelier-gold" />
          <span className="font-codet text-xs tracking-[0.2em] text-atelier-muted">
            {loginContent.eyebrow}
          </span>
        </div>

        <h1 className="m-0 font-serifd text-[clamp(34px,7vw,46px)] font-normal leading-[1.06] text-atelier-paper">
          {loginContent.heading}
          <span className="italic text-atelier-gold">{loginContent.headingAccent}</span>.
        </h1>
        <p className="m-0 mb-9 mt-4 text-[15px] leading-[1.6] text-[#9D988E]">
          {loginContent.subhead}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="email" className="at-label">
              {loginContent.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              className="at-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="at-label">
              {loginContent.passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              className="at-field"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="at-btn mt-2 w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" aria-hidden />
                {loginContent.submitting}
              </>
            ) : (
              loginContent.submit
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
