"use client";

import React, { useEffect } from "react";
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
  const { form, sending, handleSubmit, handleFieldChange } = useContactFormSubmission({
    onSuccess: onClose,
  });

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  return (
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
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
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
            className="relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-brand-navy shadow-2xl sm:max-h-[85dvh] sm:rounded-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute left-0 right-0 top-0 h-0.5 pointer-events-none" style={{ filter: "blur(3px)" }}>
              <div className="h-full w-full bg-gradient-to-r from-yellow-400/60 via-yellow-200/40 to-yellow-400/60" />
            </div>

            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 id="get-in-touch-title" className="text-xl font-bold tracking-wide text-white">
                {contactSectionContent.heading}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-white transition hover:bg-white/10 hover:text-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                aria-label="Close"
              >
                <X size={22} strokeWidth={2.25} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-4">
              <p className="mb-4 text-sm leading-relaxed text-white/80 sm:text-base">{contactSectionContent.subhead}</p>
              <div className="mb-5 h-1 w-20 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400" />

              <div className="mb-6 flex flex-col gap-3 text-sm text-white/90 sm:flex-row sm:items-center sm:gap-6">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-2 break-all hover:text-yellow-300 transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-yellow-400" aria-hidden />
                  {siteConfig.contact.email}
                </a>
                <a href={siteConfig.contact.phoneHref} className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
                  <Phone className="h-4 w-4 shrink-0 text-yellow-400" aria-hidden />
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
    </AnimatePresence>
  );
}
