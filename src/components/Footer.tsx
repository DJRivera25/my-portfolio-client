"use client";

import React, { useEffect, useState } from "react";
import { scroller } from "react-scroll";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import api from "../lib/api/client";
import { navLinks, NAV_SCROLL_OFFSET } from "../config/navigation";
import type { Social } from "../types/portfolio";
import { siteConfig } from "@/lib/site";
import { footerContent } from "../config/content";

const yellow = "#FFD600";

const Footer: React.FC = () => {
  const [socials, setSocials] = useState<Social[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    api
      .get<Social[]>("/api/socials")
      .then((res) => setSocials(res.data))
      .catch(() => {});
  }, []);

  const goToSection = (to: string) => {
    if (pathname !== "/") {
      router.push(`/#${to}`);
      return;
    }
    scroller.scrollTo(to, {
      smooth: !reduceMotion,
      duration: reduceMotion ? 0 : 500,
      offset: NAV_SCROLL_OFFSET,
    });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full bg-brand-navy text-white pt-14 pb-6 relative overflow-hidden"
    >
      <div className="absolute left-0 right-0 top-0 h-1 pointer-events-none z-10" style={{ filter: "blur(4px)" }}>
        <div className="w-full h-full bg-gradient-to-r from-yellow-400/60 via-yellow-200/40 to-yellow-400/60" />
      </div>
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[80vw] h-32 bg-yellow-400/10 blur-2xl rounded-full" />
        <div className="absolute right-0 bottom-0 w-40 h-40 bg-yellow-400/10 blur-2xl rounded-full" />
      </div>
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10 max-w-7xl">
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <span className="text-2xl font-extrabold tracking-widest text-yellow-400 drop-shadow">{siteConfig.name}</span>
          <span className="text-lg font-medium text-white/80">{footerContent.tagline}</span>
        </div>
        <nav className="flex flex-wrap gap-4 items-center justify-center" aria-label="Footer">
          {navLinks.map(({ to, label }) => (
            <motion.button
              key={to}
              type="button"
              onClick={() => goToSection(to)}
              className="text-white hover:text-yellow-400 font-semibold transition-colors text-base px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
              whileHover={{ scale: 1.08, color: yellow }}
              whileTap={{ scale: 0.95 }}
              aria-label={label}
            >
              {label}
            </motion.button>
          ))}
        </nav>
        <div className="flex flex-wrap gap-4 items-center justify-center md:justify-end">
          {socials.map((social) => (
            <motion.a
              key={social._id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.12, boxShadow: `0 0 24px 4px ${yellow}` }}
              whileTap={{ scale: 0.95 }}
              className="relative group flex flex-col items-center gap-1"
              aria-label={social.platform}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={social.icon}
                alt=""
                className="w-9 h-9 rounded-full object-contain border-2 border-yellow-400 shadow bg-black/30 group-hover:scale-110 transition-transform"
              />
              <span className="md:hidden text-[10px] font-semibold text-white/80 max-w-[72px] truncate text-center">
                {social.platform}
              </span>
              <span className="hidden md:block absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-yellow-400 text-black text-xs font-bold rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                {social.platform}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
      <div className="my-6 h-px w-full max-w-4xl mx-auto bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent rounded-full" />
      <div className="text-center text-white/60 text-sm tracking-wide z-10 relative px-4">
        &copy; {new Date().getFullYear()} {siteConfig.name}. {footerContent.rights}
      </div>
    </motion.footer>
  );
};

export default Footer;
