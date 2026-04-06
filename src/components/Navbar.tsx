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
  const [hovered, setHovered] = useState<string | null>(null);
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
  }, [activeSection, hovered, isOpen]);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const navListVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200 } },
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-brand-navy/80 transition-all duration-300 ${scrolled ? "shadow-2xl" : "shadow-lg"}`}
      style={{
        boxShadow: scrolled ? "0 8px 32px 0 rgba(10,15,41,0.35)" : "0 4px 24px 0 rgba(10,15,41,0.25)",
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div
        className="absolute left-0 right-0 bottom-0 h-0.5 lg:h-1 pointer-events-none z-50"
        style={{ filter: "blur(4px)" }}
      >
        <div className="w-full h-full bg-gradient-to-r from-yellow-400/60 via-yellow-200/40 to-yellow-400/60" />
      </div>
      <div className="container mx-auto flex min-h-0 justify-between items-center gap-3 py-3.5 px-4 sm:px-5 lg:py-5 lg:px-6 relative max-w-7xl">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          animate={{ scale: scrolled ? 0.96 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="group flex min-w-0 items-center gap-2.5 sm:gap-3 cursor-pointer bg-transparent border-0 p-0 text-left rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy shrink"
          onClick={handleLogoClick}
          onKeyDown={handleLogoKeyDown}
          aria-label={`${siteConfig.name} — go to home`}
        >
          <span className="inline-flex h-10 w-10 shrink-0 rounded-full border-2 border-yellow-400 shadow-sm overflow-hidden transition-transform duration-200 ease-out group-hover:scale-105 sm:h-11 sm:w-11">
            <Image
              src={myPhoto}
              alt=""
              width={44}
              height={44}
              className="h-full w-full rounded-full object-cover"
            />
          </span>
          <span className="text-xl font-extrabold text-white tracking-widest transition-colors duration-200 group-hover:text-yellow-200 sm:text-2xl">
            {siteConfig.shortName}
          </span>
        </motion.button>

        <motion.ul
          className="hidden lg:flex gap-10 font-semibold text-base tracking-wide uppercase items-center relative"
          variants={navListVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="absolute top-full h-2 rounded-full pointer-events-none"
            style={{
              left: underlineProps.left,
              width: underlineProps.width,
              background: `linear-gradient(90deg, #FFD600 60%, #fff 100%)`,
              boxShadow: `0 2px 16px 0 #FFD60099`,
              filter: "blur(0.5px)",
            }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
            layout
          />
          {navLinks.map(({ to, label }) => (
            <motion.li
              key={to}
              ref={(el: HTMLLIElement | null) => {
                navRefs.current[to] = el;
              }}
              className="relative"
              variants={navItemVariants}
              aria-current={activeSection === to ? "page" : undefined}
            >
              <button
                type="button"
                onClick={() => handleNavClick(to)}
                className={`cursor-pointer px-2 py-1 transition-colors text-white hover:text-yellow-400 focus:text-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${activeSection === to ? "font-bold" : ""}`}
                onMouseEnter={() => setHovered(to)}
                onMouseLeave={() => setHovered(null)}
                style={{ letterSpacing: hovered === to ? "0.08em" : undefined, transition: "letter-spacing 0.2s" }}
                aria-label={label}
              >
                {label}
              </button>
            </motion.li>
          ))}
          {isLoggedIn && (
            <motion.li variants={navItemVariants}>
              <motion.button
                type="button"
                onClick={() => router.push("/inbox")}
                className="relative px-4 py-2 rounded-lg bg-transparent text-white hover:text-yellow-400 transition font-semibold focus-visible:ring-2 focus-visible:ring-yellow-400 overflow-hidden"
                whileTap={{ scale: 0.95 }}
                aria-label="Inbox"
              >
                <span className="relative z-10">Inbox</span>
                {unseenCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full font-bold shadow">
                    {unseenCount}
                  </span>
                )}
              </motion.button>
            </motion.li>
          )}
          {isLoggedIn && (
            <motion.li variants={navItemVariants}>
              <motion.button
                type="button"
                onClick={handleLogout}
                className="ml-4 px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-base font-bold rounded-lg shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                whileTap={{ scale: 0.95 }}
                aria-label="Logout"
              >
                Logout
              </motion.button>
            </motion.li>
          )}
        </motion.ul>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setContactModalOpen(true)}
            className="rounded-lg bg-yellow-400 px-3 py-2.5 text-sm font-semibold leading-snug text-black shadow-md transition hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy sm:px-4 sm:text-[0.9375rem]"
            aria-label={heroContent.primaryCta}
          >
            {heroContent.primaryCta}
          </button>
          <motion.button
            type="button"
            onClick={handleToggle}
            className="text-white -mr-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            whileTap={{ scale: 0.95 }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={26} strokeWidth={2.25} /> : <Menu size={26} strokeWidth={2.25} />}
          </motion.button>
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
              className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md lg:hidden"
              onClick={closeMenu}
              aria-hidden
            />
            <motion.aside
              key="mobile-menu-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 38 }}
              className="fixed top-0 right-0 z-[110] flex h-[100dvh] w-[min(88vw,20rem)] flex-col bg-brand-navy shadow-[-8px_0_32px_rgba(0,0,0,0.35)] lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Menu</span>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="rounded-lg p-2 text-white transition hover:bg-white/10 hover:text-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                  aria-label="Close menu"
                >
                  <X size={24} strokeWidth={2} />
                </button>
              </div>

              <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-3 pb-4 pt-2">
                <ul className="flex flex-col gap-0.5">
                  {navLinks.map(({ to, label }) => (
                    <li key={to} aria-current={activeSection === to ? "page" : undefined}>
                      <button
                        type="button"
                        onClick={() => handleNavClick(to)}
                        className={`flex w-full items-center rounded-xl px-3 py-3 text-left text-base font-semibold tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-inset ${
                          activeSection === to
                            ? "bg-white/10 text-yellow-300"
                            : "text-white hover:bg-white/5 hover:text-yellow-300"
                        }`}
                        onMouseEnter={() => setHovered(to)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>

                {isLoggedIn && (
                  <div className="mt-4 border-t border-white/10 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        router.push("/inbox");
                        closeMenu();
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-base font-semibold text-white transition hover:bg-white/5 hover:text-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-inset"
                      aria-label="Inbox"
                    >
                      <span>Inbox</span>
                      {unseenCount > 0 && (
                        <span className="inline-flex min-h-[1.5rem] min-w-[1.5rem] shrink-0 items-center justify-center rounded-full bg-yellow-400 px-2 text-xs font-bold text-black tabular-nums">
                          {unseenCount > 99 ? "99+" : unseenCount}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </nav>

              {isLoggedIn && (
                <div className="shrink-0 border-t border-white/10 bg-brand-navy/95 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="w-full rounded-xl bg-yellow-400 px-4 py-3.5 text-left text-base font-bold text-black shadow-md transition hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
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
