"use client";

import React, { useState, useEffect, useRef } from "react";
import { scroller } from "react-scroll";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import myPhoto from "../images/my-photo.png";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { navLinks, NAV_SCROLL_OFFSET } from "../config/navigation";
import { siteConfig } from "@/lib/site";
import { heroContent } from "../config/content";
import GetInTouchModal from "./GetInTouchModal";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const { isLoggedIn, unseenCount, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(navLinks[0].to);
  const navRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      let found = navLinks[0].to;
      for (let i = 0; i < navLinks.length; i++) {
        const section = document.getElementById(navLinks[i].to);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) {
            found = navLinks[i].to;
            break;
          }
        }
      }
      setActiveSection(found);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const scrollToSection = (to: string) => {
    scroller.scrollTo(to, {
      smooth: !reduceMotion,
      duration: reduceMotion ? 0 : 500,
      offset: NAV_SCROLL_OFFSET,
    });
  };

  const handleNavClick = (to: string) => {
    if (!isHome) {
      router.push(`/#${to}`);
      setActiveSection(to);
      closeMenu();
      return;
    }
    scrollToSection(to);
    setActiveSection(to);
    closeMenu();
  };

  const handleLogoClick = () => {
    if (!isHome) {
      router.push("/");
      return;
    }
    scrollToSection("landing");
  };

  const handleLogoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleLogoClick();
    }
  };

  const handleToggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const [underlineProps, setUnderlineProps] = useState({ left: 0, width: 0 });
  useEffect(() => {
    const ref = navRefs.current[activeSection];
    if (ref) {
      const rect = ref.getBoundingClientRect();
      const parentRect = ref.parentElement?.getBoundingClientRect();
      if (parentRect) {
        setUnderlineProps({ left: rect.left - parentRect.left, width: rect.width });
      }
    }
  }, [activeSection, isOpen]);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 z-50 w-full backdrop-blur-glass transition-all duration-300 ${scrolled ? "bg-brand-navy/85 border-b border-hairline" : "bg-brand-navy/40"}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:py-4">
        <button
          type="button"
          className="group flex items-center gap-2.5 rounded-lg p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
          onClick={handleLogoClick}
          onKeyDown={handleLogoKeyDown}
          aria-label={`${siteConfig.name} — go to home`}
        >
          <span className="inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-hairline-strong">
            <Image
              src={myPhoto}
              alt=""
              width={40}
              height={40}
              className="h-full w-full rounded-full object-cover"
            />
          </span>
          <span className="text-base font-bold tracking-tight text-white transition group-hover:text-accent-cyan sm:text-lg">
            {siteConfig.shortName}
          </span>
        </button>

        <ul className="relative hidden items-center gap-8 lg:flex">
          <motion.div
            className="absolute -bottom-2 h-px rounded-full pointer-events-none"
            style={{
              left: underlineProps.left,
              width: underlineProps.width,
              background: "linear-gradient(90deg, transparent, #00E0FF, transparent)",
              boxShadow: "0 0 10px rgba(0, 224, 255, 0.6)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            layout
          />
          {navLinks.map(({ to, label }) => (
            <li
              key={to}
              ref={(el: HTMLLIElement | null) => {
                navRefs.current[to] = el;
              }}
              className="relative"
              aria-current={activeSection === to ? "page" : undefined}
            >
              <button
                type="button"
                onClick={() => handleNavClick(to)}
                className={`text-eyebrow uppercase transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan rounded ${activeSection === to ? "text-white" : "text-white/55 hover:text-white"}`}
                aria-label={label}
              >
                {label}
              </button>
            </li>
          ))}
          {isLoggedIn && (
            <li>
              <button
                type="button"
                onClick={() => router.push("/inbox")}
                className="relative text-eyebrow uppercase text-white/70 transition hover:text-accent-cyan"
                aria-label="Inbox"
              >
                Inbox
                {unseenCount > 0 && (
                  <span className="absolute -top-2 -right-3 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-brand-navy">
                    {unseenCount}
                  </span>
                )}
              </button>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-hairline-strong bg-surface-glass px-3 py-1.5 text-eyebrow uppercase text-white transition hover:border-accent-cyan hover:text-accent-cyan"
                aria-label="Logout"
              >
                Logout
              </button>
            </li>
          )}
        </ul>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setContactModalOpen(true)}
            className="rounded-lg bg-accent px-3 py-2 text-xs font-bold uppercase tracking-wide text-brand-navy shadow-brand-glow transition hover:bg-accent-hover"
            aria-label={heroContent.primaryCta}
          >
            {heroContent.primaryCta}
          </button>
          <button
            type="button"
            onClick={handleToggle}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline-strong text-white transition hover:border-accent-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-brand-navy/80 backdrop-blur-glass lg:hidden"
              onClick={closeMenu}
              aria-hidden
            />
            <motion.aside
              key="mobile-menu-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 38 }}
              className="fixed top-0 right-0 z-[110] flex h-[100dvh] w-[min(85vw,18rem)] flex-col border-l border-hairline-strong bg-brand-navy shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-hairline px-4 py-3">
                <span className="text-eyebrow uppercase text-white/55">Menu</span>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="rounded-lg p-2 text-white transition hover:text-accent-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4">
                <ul className="flex flex-col gap-1">
                  {navLinks.map(({ to, label }) => (
                    <li key={to} aria-current={activeSection === to ? "page" : undefined}>
                      <button
                        type="button"
                        onClick={() => handleNavClick(to)}
                        className={`flex w-full items-center rounded-xl px-3 py-3 text-left text-sm font-semibold uppercase tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan ${
                          activeSection === to
                            ? "bg-surface-glass text-accent-cyan"
                            : "text-white/70 hover:bg-surface-glass hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>

                {isLoggedIn && (
                  <div className="mt-4 border-t border-hairline pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        router.push("/inbox");
                        closeMenu();
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-white/80 transition hover:bg-surface-glass hover:text-accent-cyan"
                      aria-label="Inbox"
                    >
                      <span>Inbox</span>
                      {unseenCount > 0 && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-brand-navy">
                          {unseenCount > 99 ? "99+" : unseenCount}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </nav>

              {isLoggedIn && (
                <div className="shrink-0 border-t border-hairline px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-bold text-brand-navy shadow-brand-glow transition hover:bg-accent-hover"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <GetInTouchModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </motion.nav>
  );
};

export default Navbar;
