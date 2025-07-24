"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const yellow = "#FFD600";
const darkBlue = "#0a0f29";
const navLinks = [
  { to: "landing", label: "Home" },
  { to: "about", label: "About" },
  { to: "projects", label: "Projects" },
  { to: "resume", label: "Resume" },
  { to: "tools", label: "Tools" },
  { to: "contact", label: "Contact" },
];

const Footer: React.FC = () => {
  const [socials, setSocials] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/socials")
      .then((res) => setSocials(res.data))
      .catch(() => {});
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full bg-[#0a0f29] text-white pt-12 pb-6 mt-12 relative overflow-hidden"
    >
      {/* Glowing top border */}
      <div className="absolute left-0 right-0 top-0 h-1 pointer-events-none z-10" style={{ filter: "blur(4px)" }}>
        <div className="w-full h-full bg-gradient-to-r from-yellow-400/60 via-yellow-200/40 to-yellow-400/60" />
      </div>
      {/* Layered background effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[80vw] h-32 bg-yellow-400/10 blur-2xl rounded-full" />
        <div className="absolute right-0 bottom-0 w-40 h-40 bg-yellow-400/10 blur-2xl rounded-full" />
      </div>
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
        {/* Left: Name & Role */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-2xl font-extrabold tracking-widest text-yellow-400 drop-shadow">
            Derem Joshua Rivera
          </span>
          <span className="text-lg font-semibold text-white/80">Full Stack Web Developer</span>
        </div>
        {/* Center: Navigation */}
        <nav className="flex flex-wrap gap-6 items-center justify-center">
          {navLinks.map(({ to, label }) => (
            <motion.button
              key={to}
              onClick={() => {
                if (typeof window !== "undefined") {
                  const section = document.getElementById(to);
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else {
                    router.push("/#" + to);
                  }
                }
              }}
              className="text-white hover:text-yellow-400 font-semibold transition-colors text-base px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
              whileHover={{ scale: 1.08, color: yellow }}
              whileTap={{ scale: 0.95 }}
              aria-label={label}
            >
              {label}
            </motion.button>
          ))}
        </nav>
        {/* Right: Socials */}
        <div className="flex gap-4 items-center justify-center">
          {socials.map((social) => (
            <motion.a
              key={social._id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.18, boxShadow: `0 0 24px 4px ${yellow}` }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
              aria-label={social.platform}
            >
              <img
                src={social.icon}
                alt={social.platform}
                className="w-9 h-9 rounded-full object-contain border-2 border-yellow-400 shadow bg-black/30 group-hover:scale-110 transition-transform"
              />
              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: -28 }}
                transition={{ duration: 0.3 }}
                className="absolute left-1/2 -translate-x-1/2 top-0 mt-2 px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded shadow-lg pointer-events-none z-40"
                style={{ whiteSpace: "nowrap" }}
              >
                {social.platform}
              </motion.div>
            </motion.a>
          ))}
        </div>
      </div>
      {/* Divider */}
      <div className="my-6 h-1 w-full bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent rounded-full" />
      {/* Copyright */}
      <div className="text-center text-white/60 text-sm tracking-wide z-10 relative">
        &copy; {new Date().getFullYear()} Derem Joshua Rivera. All Rights Reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
