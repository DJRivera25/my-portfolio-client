"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Inbox, LogOut, NotebookPen } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { siteConfig } from "@/lib/site";

const LINKS = [
  { href: "/worklog", label: "Worklog", Icon: NotebookPen },
  { href: "/inbox", label: "Inbox", Icon: Inbox },
];

/**
 * Chrome for the signed-in areas only. The homepage renders its own SiteNav, and the
 * public marketing routes now redirect to homepage anchors, so this bar exists purely
 * to move between admin surfaces and sign out.
 */
const AdminBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, unseenCount, logout } = useAuth();

  // The homepage owns its own navigation; /login has nothing to navigate to yet.
  if (pathname === "/" || pathname === "/login" || !isLoggedIn) return null;

  const handleSignOut = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-atelier-ink/85 backdrop-blur-glass">
      <nav className="mx-auto flex h-14 max-w-[1100px] items-center gap-6 px-6 max-[560px]:gap-4 max-[560px]:px-4">
        <Link
          href="/"
          className="font-serifd text-[19px] leading-none text-atelier-paper transition-colors hover:text-atelier-gold"
        >
          {siteConfig.shortName}
        </Link>

        <span className="h-4 w-px bg-white/[0.12]" aria-hidden />

        <div className="flex flex-1 items-center gap-1">
          {LINKS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-codet text-[11px] uppercase tracking-[0.12em] transition-colors ${
                  active
                    ? "text-atelier-gold"
                    : "text-atelier-faint hover:text-atelier-paper"
                }`}
              >
                <Icon size={14} aria-hidden />
                <span className="max-[560px]:sr-only">{label}</span>
                {href === "/inbox" && unseenCount > 0 && (
                  <span
                    className="rounded-full bg-atelier-gold px-1.5 py-px text-[10px] font-semibold text-atelier-ink"
                    aria-label={`${unseenCount} unread`}
                  >
                    {unseenCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-codet text-[11px] uppercase tracking-[0.12em] text-atelier-faint transition-colors hover:text-atelier-paper"
        >
          <LogOut size={14} aria-hidden />
          <span className="max-[560px]:sr-only">Sign out</span>
        </button>
      </nav>
    </header>
  );
};

export default AdminBar;
