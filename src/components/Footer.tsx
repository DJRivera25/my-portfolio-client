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
import AuroraBackdrop from "./ui/AuroraBackdrop";

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden border-t border-hairline bg-brand-navy text-white"
    >
      <AuroraBackdrop tint="violet-yellow" withGrid={false} />
      <div className="container relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold tracking-tight text-white">{siteConfig.name}</span>
          <p className="max-w-md text-sm text-white/60 leading-relaxed">{footerContent.tagline}</p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
          {navLinks.map(({ to, label }) => (
            <button
              key={to}
              type="button"
              onClick={() => goToSection(to)}
              className="text-eyebrow uppercase text-white/55 transition hover:text-accent-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan rounded"
              aria-label={label}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          {socials.map((social) => (
            <a
              key={social._id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline-strong bg-surface-glass backdrop-blur-glass transition hover:border-accent-cyan hover:shadow-cyan-glow"
              aria-label={social.platform}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={social.icon} alt="" className="h-5 w-5 object-contain" />
            </a>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t border-hairline px-6 py-4 text-center text-xs text-white/45 sm:px-8">
        &copy; {new Date().getFullYear()} {siteConfig.name}. {footerContent.rights}
      </div>
    </motion.footer>
  );
};

export default Footer;
