"use client";
import React, { useState, useEffect, useRef } from "react";
import { scroller } from "react-scroll";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import myPhoto from "../images/my-photo.png";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const underlineColor = "#FFD600";
const darkBlue = "#0a0f29";
const navLinks = [
  { to: "landing", label: "Home" },
  { to: "about", label: "About" },
  { to: "projects", label: "Projects" },
  { to: "resume", label: "Resume" },
  { to: "tools", label: "Tools" },
  { to: "contact", label: "Contact" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, unseenCount, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(navLinks[0].to);
  const navRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  // Scroll spy logic
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      // Find the section in view
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // For logo pulse
  const [logoPulse, setLogoPulse] = useState(false);
  const handleLogoHover = () => setLogoPulse(true);
  const handleLogoUnhover = () => setLogoPulse(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleNavClick = (to: string) => {
    scroller.scrollTo(to, {
      smooth: true,
      duration: 500,
      offset: -80,
    });
    setActiveSection(to);
    closeMenu(); // for mobile
  };

  // Framer Motion variants
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

  // Get underline position and width
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

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#0a0f29]/80 transition-all duration-300 ${scrolled ? "shadow-2xl" : "shadow-lg"}`}
      style={{ boxShadow: scrolled ? "0 8px 32px 0 rgba(10,15,41,0.35)" : "0 4px 24px 0 rgba(10,15,41,0.25)" }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Glowing border */}
      <div className="absolute left-0 right-0 bottom-0 h-1 pointer-events-none z-50" style={{ filter: "blur(4px)" }}>
        <div className="w-full h-full bg-gradient-to-r from-yellow-400/60 via-yellow-200/40 to-yellow-400/60" />
      </div>
      <div className="container mx-auto flex justify-between items-center py-5 px-6 relative">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.08, boxShadow: `0 0 16px 2px ${underlineColor}` }}
          animate={{ scale: scrolled ? 0.92 : 1, boxShadow: logoPulse ? `0 0 32px 8px ${underlineColor}` : undefined }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center gap-3 cursor-pointer"
          onMouseEnter={handleLogoHover}
          onMouseLeave={handleLogoUnhover}
          tabIndex={0}
          aria-label="Homepage"
        >
          <Image
            src={myPhoto}
            alt="Logo"
            width={44}
            height={44}
            className="rounded-full border-2 border-yellow-400 shadow"
          />
          <span className="text-2xl font-extrabold text-white tracking-widest">DJR</span>
        </motion.div>
        {/* Desktop Nav Links */}
        <motion.ul
          className="hidden lg:flex gap-10 font-semibold text-base tracking-wide uppercase items-center relative"
          variants={navListVariants}
          initial="hidden"
          animate="show"
        >
          {/* Underline */}
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
              tabIndex={0}
              aria-current={activeSection === to ? "page" : undefined}
            >
              <button
                type="button"
                onClick={() => handleNavClick(to)}
                className={`cursor-pointer px-2 py-1 transition-colors text-white hover:text-yellow-400 focus:text-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${activeSection === to ? "font-bold" : ""}`}
                onMouseEnter={() => setHovered(to)}
                onMouseLeave={() => setHovered(null)}
                style={{ letterSpacing: hovered === to ? "0.08em" : undefined, transition: "letter-spacing 0.2s" }}
                tabIndex={0}
                aria-label={label}
              >
                {label}
              </button>
            </motion.li>
          ))}
          {isLoggedIn && (
            <motion.li variants={navItemVariants}>
              <motion.button
                onClick={() => router.push("/inbox")}
                className="relative px-4 py-2 rounded-lg bg-transparent text-white hover:text-yellow-400 transition font-semibold focus-visible:ring-2 focus-visible:ring-yellow-400 overflow-hidden"
                whileTap={{ scale: 0.95 }}
                aria-label="Inbox"
              >
                <span className="relative z-10">INBOX</span>
                {unseenCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full font-bold shadow">
                    {unseenCount}
                  </span>
                )}
                {/* Ripple effect */}
                <motion.span
                  className="absolute inset-0 rounded-lg"
                  initial={{ opacity: 0 }}
                  whileTap={{ opacity: 0.2, scale: 1.2, background: "#FFD600" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.li>
          )}
          {isLoggedIn && (
            <motion.li variants={navItemVariants}>
              <motion.button
                onClick={handleLogout}
                className="ml-4 px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-base font-bold rounded-lg shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 overflow-hidden"
                whileTap={{ scale: 0.95 }}
                aria-label="Logout"
              >
                <span className="relative z-10">Logout</span>
                {/* Ripple effect */}
                <motion.span
                  className="absolute inset-0 rounded-lg"
                  initial={{ opacity: 0 }}
                  whileTap={{ opacity: 0.2, scale: 1.2, background: "#FFD600" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.li>
          )}
        </motion.ul>
        {/* Mobile Toggle */}
        <div className="lg:hidden">
          <motion.button
            onClick={handleToggle}
            className="text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            whileTap={{ scale: 0.85, rotate: 90 }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </motion.button>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex"
            aria-modal="true"
            role="dialog"
          >
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.92 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-br from-[#0a0f29]/90 via-[#0a0f29]/80 to-black/80 backdrop-blur-md"
              style={{ background: darkBlue, opacity: 0.92 }}
              onClick={closeMenu}
            />
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative ml-auto w-4/5 max-w-xs h-full bg-[#0a0f29] shadow-2xl flex flex-col p-8 gap-8"
              style={{ background: darkBlue }}
            >
              <motion.button
                onClick={closeMenu}
                className="self-end text-white hover:text-yellow-400 transition mb-4 focus-visible:ring-2 focus-visible:ring-yellow-400"
                whileTap={{ scale: 0.85, rotate: 180 }}
                aria-label="Close menu"
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <X size={28} />
                </motion.div>
              </motion.button>
              <motion.ul
                className="flex flex-col gap-8 text-lg font-semibold"
                variants={navListVariants}
                initial="hidden"
                animate="show"
              >
                {navLinks.map(({ to, label }, idx) => (
                  <motion.li
                    key={to}
                    className="relative"
                    variants={navItemVariants}
                    tabIndex={0}
                    aria-current={activeSection === to ? "page" : undefined}
                  >
                    <button
                      type="button"
                      onClick={() => handleNavClick(to)}
                      className={`cursor-pointer px-2 py-1 transition-colors text-white hover:text-yellow-400 focus:text-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${activeSection === to ? "font-bold" : ""}`}
                      onMouseEnter={() => setHovered(to)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        letterSpacing: hovered === to ? "0.08em" : undefined,
                        transition: "letter-spacing 0.2s",
                      }}
                      tabIndex={0}
                      aria-label={label}
                    >
                      {label}
                    </button>
                  </motion.li>
                ))}
                {isLoggedIn && (
                  <motion.li variants={navItemVariants}>
                    <motion.button
                      onClick={() => {
                        router.push("/inbox");
                        closeMenu();
                      }}
                      className="relative px-4 py-2 rounded-lg bg-transparent text-white hover:text-yellow-400 transition font-semibold focus-visible:ring-2 focus-visible:ring-yellow-400 overflow-hidden"
                      whileTap={{ scale: 0.95 }}
                      aria-label="Inbox"
                    >
                      <span className="relative z-10">INBOX</span>
                      {unseenCount > 0 && (
                        <span className="absolute -top-2 -right-3 bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full font-bold shadow">
                          {unseenCount}
                        </span>
                      )}
                      {/* Ripple effect */}
                      <motion.span
                        className="absolute inset-0 rounded-lg"
                        initial={{ opacity: 0 }}
                        whileTap={{ opacity: 0.2, scale: 1.2, background: "#FFD600" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </motion.li>
                )}
                {isLoggedIn && (
                  <motion.li variants={navItemVariants}>
                    <motion.button
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="w-full px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-base font-bold rounded-lg shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 overflow-hidden"
                      whileTap={{ scale: 0.95 }}
                      aria-label="Logout"
                    >
                      <span className="relative z-10">Logout</span>
                      {/* Ripple effect */}
                      <motion.span
                        className="absolute inset-0 rounded-lg"
                        initial={{ opacity: 0 }}
                        whileTap={{ opacity: 0.2, scale: 1.2, background: "#FFD600" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </motion.li>
                )}
              </motion.ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
