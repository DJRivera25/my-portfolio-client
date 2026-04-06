"use client";

import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

type ModalFrameProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Wide modals (e.g. forms with two columns) */
  size?: "md" | "lg";
};

export default function ModalFrame({ isOpen, onClose, title, children, size = "md" }: ModalFrameProps) {
  if (!isOpen) return null;

  const maxW = size === "lg" ? "max-w-2xl" : "max-w-md";

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        className={`relative w-full ${maxW} rounded-2xl border border-accent/30 bg-brand-navy p-6 shadow-brand-glow`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="modal-title" className="text-xl font-bold text-accent">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
