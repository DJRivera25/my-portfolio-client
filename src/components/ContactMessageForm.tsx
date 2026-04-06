"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ContactFormState } from "../hooks/useContactFormSubmission";

const yellow = "#FFD600";

type ContactMessageFormProps = {
  form: ContactFormState;
  onFieldChange: (field: keyof ContactFormState, value: string) => void;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  sending: boolean;
  /** Framer motion fields (Contact section); false = modal */
  animated?: boolean;
  className?: string;
};

const inputClass =
  "w-full border-b-2 border-white/30 bg-transparent text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base sm:text-lg";

export default function ContactMessageForm({
  form,
  onFieldChange,
  onSubmit,
  sending,
  animated = true,
  className = "",
}: ContactMessageFormProps) {
  if (animated) {
    return (
      <form
        onSubmit={onSubmit}
        className={`relative flex flex-col justify-center space-y-5 sm:space-y-6 ${className}`}
      >
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400/10 blur-2xl rounded-full z-0 pointer-events-none" />
        <motion.input
          type="text"
          placeholder="Enter Your Name"
          className={inputClass}
          value={form.name}
          onChange={(e) => onFieldChange("name", e.target.value)}
          required
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        />
        <motion.input
          type="email"
          placeholder="Your Email Address"
          className={inputClass}
          value={form.email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          required
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
        <motion.input
          type="text"
          placeholder="Subject"
          className={inputClass}
          value={form.subject}
          onChange={(e) => onFieldChange("subject", e.target.value)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
        <motion.textarea
          placeholder="Write me a message"
          rows={6}
          className={inputClass}
          value={form.message}
          onChange={(e) => onFieldChange("message", e.target.value)}
          required
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        />
        <motion.button
          type="submit"
          className="border border-yellow-400 px-8 py-3 text-white bg-yellow-400 hover:bg-yellow-300 hover:text-black font-bold rounded-full transition flex items-center justify-center relative overflow-hidden shadow-lg mt-2"
          disabled={sending}
          whileHover={{ scale: 1.04, boxShadow: `0 0 16px 2px ${yellow}` }}
          whileTap={{ scale: 0.97 }}
        >
          {sending ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Sending...
            </span>
          ) : (
            "Submit"
          )}
          <motion.span
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            whileTap={{ opacity: 0.2, scale: 1.2, background: yellow }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`relative flex flex-col space-y-4 sm:space-y-5 ${className}`}>
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-28 h-28 bg-yellow-400/10 blur-2xl rounded-full pointer-events-none" />
      <input
        type="text"
        placeholder="Enter Your Name"
        className={inputClass}
        value={form.name}
        onChange={(e) => onFieldChange("name", e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Your Email Address"
        className={inputClass}
        value={form.email}
        onChange={(e) => onFieldChange("email", e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Subject"
        className={inputClass}
        value={form.subject}
        onChange={(e) => onFieldChange("subject", e.target.value)}
      />
      <textarea
        placeholder="Write me a message"
        rows={5}
        className={inputClass}
        value={form.message}
        onChange={(e) => onFieldChange("message", e.target.value)}
        required
      />
      <button
        type="submit"
        className="mt-1 border border-yellow-400 px-6 py-3 text-black bg-yellow-400 hover:bg-yellow-300 font-bold rounded-full transition flex items-center justify-center shadow-lg disabled:opacity-70"
        disabled={sending}
      >
        {sending ? (
          <span className="flex items-center gap-2 text-black">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Sending...
          </span>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
