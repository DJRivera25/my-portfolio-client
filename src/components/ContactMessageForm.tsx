"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ContactFormState } from "../hooks/useContactFormSubmission";

type ContactMessageFormProps = {
  form: ContactFormState;
  onFieldChange: (field: keyof ContactFormState, value: string) => void;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  sending: boolean;
  /** Framer motion fields (Contact section); false = modal */
  animated?: boolean;
  className?: string;
};

const fieldClass =
  "w-full rounded-lg border border-hairline-strong bg-brand-navy/40 px-4 py-3 text-sm text-white placeholder:text-white/40 transition focus:border-accent-cyan focus:bg-brand-navy/60 focus:outline-none focus:ring-1 focus:ring-accent-cyan";

const submitClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold uppercase tracking-wide text-brand-navy shadow-brand-glow transition hover:bg-accent-hover disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

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
        className={`flex flex-col space-y-4 ${className}`}
      >
        <motion.input
          type="text"
          placeholder="Enter Your Name"
          className={fieldClass}
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
          className={fieldClass}
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
          className={fieldClass}
          value={form.subject}
          onChange={(e) => onFieldChange("subject", e.target.value)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
        <motion.textarea
          placeholder="Write me a message"
          rows={6}
          className={`${fieldClass} resize-none`}
          value={form.message}
          onChange={(e) => onFieldChange("message", e.target.value)}
          required
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        />
        <button type="submit" className={submitClass} disabled={sending}>
          {sending ? (
            <>
              <Spinner />
              <span>Sending...</span>
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`flex flex-col space-y-4 ${className}`}>
      <input
        type="text"
        placeholder="Enter Your Name"
        className={fieldClass}
        value={form.name}
        onChange={(e) => onFieldChange("name", e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Your Email Address"
        className={fieldClass}
        value={form.email}
        onChange={(e) => onFieldChange("email", e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Subject"
        className={fieldClass}
        value={form.subject}
        onChange={(e) => onFieldChange("subject", e.target.value)}
      />
      <textarea
        placeholder="Write me a message"
        rows={5}
        className={`${fieldClass} resize-none`}
        value={form.message}
        onChange={(e) => onFieldChange("message", e.target.value)}
        required
      />
      <button type="submit" className={submitClass} disabled={sending}>
        {sending ? (
          <>
            <Spinner />
            <span>Sending...</span>
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
