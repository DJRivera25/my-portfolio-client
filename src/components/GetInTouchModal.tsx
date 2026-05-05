"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Mail, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { contactSectionContent } from "../config/content";
import { useContactFormSubmission } from "../hooks/useContactFormSubmission";
import ContactMessageForm from "./ContactMessageForm";

type GetInTouchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function GetInTouchModal({ isOpen, onClose }: GetInTouchModalProps) {
  const [mounted, setMounted] = useState(false);
  const { form, sending, handleSubmit, handleFieldChange } = useContactFormSubmission({
    onSuccess: onClose,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="get-in-touch-modal"
          className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-4 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
            aria-label="Close dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="get-in-touch-title"
            className="relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-hairline-strong bg-brand-navy shadow-glass-lift sm:max-h-[85dvh] sm:rounded-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
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

            <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-hairline px-5 py-4">
              <div className="flex flex-col gap-1">
                <span className="text-eyebrow uppercase text-accent-cyan">{contactSectionContent.eyebrow}</span>
                <h2 id="get-in-touch-title" className="text-lg font-bold text-white">
                  {contactSectionContent.heading}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-hairline-strong bg-surface-glass p-1.5 text-white/70 backdrop-blur-glass transition hover:border-accent-cyan hover:text-accent-cyan"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-4">
              <p className="mb-5 text-sm leading-relaxed text-white/75">{contactSectionContent.subhead}</p>

              <div className="mb-6 flex flex-col gap-2 text-sm text-white/85">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex items-center gap-2 break-all transition hover:text-accent-cyan"
                >
                  <Mail className="h-4 w-4 shrink-0 text-accent-cyan" aria-hidden />
                  {siteConfig.contact.email}
                </a>
                <a
                  href={siteConfig.contact.phoneHref}
                  className="inline-flex items-center gap-2 transition hover:text-accent-cyan"
                >
                  <Phone className="h-4 w-4 shrink-0 text-accent-cyan" aria-hidden />
                  {siteConfig.contact.phone}
                </a>
              </div>

              <ContactMessageForm
                form={form}
                onFieldChange={handleFieldChange}
                onSubmit={handleSubmit}
                sending={sending}
                animated={false}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
