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
      <div className="min-h-screen flex flex-col items-center justify-center bg-atelier-ink text-atelier-paper gap-3">
        <span
          className="inline-block h-10 w-10 border-2 border-atelier-gold border-t-transparent rounded-full animate-spin"
          aria-hidden
        />
        <span className="text-sm text-atelier-muted">Checking session…</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
