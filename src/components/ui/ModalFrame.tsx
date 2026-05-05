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

export default function ModalFrame({ isOpen, onClose, eyebrow, title, size = "md", children }: ModalFrameProps) {
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const maxW = size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-4 py-4 sm:py-6 backdrop-blur-md"
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
            className={`relative flex w-full ${maxW} max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] flex-col overflow-hidden rounded-2xl border border-hairline bg-brand-navy/85 backdrop-blur-glass shadow-glass-lift`}
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-90"
              aria-hidden
              style={{
                background:
                  "radial-gradient(circle at 80% 0%, rgba(0,224,255,0.15) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(255,214,0,0.10) 0%, transparent 50%)",
              }}
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 rounded-full border border-hairline bg-surface-glass p-1.5 text-white/70 backdrop-blur-glass transition hover:border-accent-cyan hover:text-accent-cyan"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="relative z-10 overflow-y-auto overscroll-contain p-6 sm:p-7">
              <span className="text-eyebrow uppercase text-accent-cyan mb-2 block">{eyebrow}</span>
              <h2 id="modal-title" className="text-xl font-bold text-white mb-6 pr-8">{title}</h2>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
