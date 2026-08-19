"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ModalFrameProps = {
  isOpen: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  size?: "md" | "lg";
  children: React.ReactNode;
};

/**
 * Shared chrome for every admin modal. These open on top of the Atelier homepage, so
 * they use its palette rather than the retired navy/cyan theme — a mismatched modal is
 * the most visible break in the site because it sits directly over the design it clashes
 * with.
 */
export default function ModalFrame({
  isOpen,
  onClose,
  eyebrow,
  title,
  size = "md",
  children,
}: ModalFrameProps) {
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const maxW = size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 py-4 backdrop-blur-md sm:py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            className={`relative flex w-full ${maxW} max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-2xl border border-white/[0.1] sm:max-h-[calc(100dvh-3rem)]`}
            style={{
              background: "linear-gradient(180deg,#141416,#0E0E10)",
              boxShadow: "0 40px 100px -40px rgba(0,0,0,0.85)",
            }}
            initial={{ scale: 0.97, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 rounded-full border border-white/[0.12] p-1.5 text-atelier-faint transition-colors hover:border-atelier-gold/60 hover:text-atelier-gold"
              aria-label="Close"
            >
              <X size={17} />
            </button>

            <div className="relative z-10 overflow-y-auto overscroll-contain p-6 sm:p-7">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-atelier-gold" />
                <span className="font-codet text-[11px] uppercase tracking-[0.16em] text-atelier-muted">
                  {eyebrow}
                </span>
              </div>
              <h2
                id="modal-title"
                className="m-0 mb-6 pr-8 font-serifd text-[26px] font-normal leading-tight text-atelier-paper"
              >
                {title}
              </h2>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
