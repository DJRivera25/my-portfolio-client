"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-navy text-white gap-3">
        <span
          className="inline-block h-10 w-10 border-2 border-accent border-t-transparent rounded-full animate-spin"
          aria-hidden
        />
        <span className="text-sm text-white/70">Checking session…</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
