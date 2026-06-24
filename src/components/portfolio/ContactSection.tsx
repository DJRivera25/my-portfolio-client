"use client";

import React, { useState } from "react";
import { siteConfig } from "@/lib/site";
import { contactContent } from "../../config/atelier";
import { useContactFormSubmission } from "../../hooks/useContactFormSubmission";

type SocialLink = { platform: string; url: string; icon?: string };

const brandPaths: Record<string, string> = {
  facebook:
    "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07Z",
  instagram:
    "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.35 2.67.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.12-1.38 5.86 5.86 0 0 0 1.38-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.12A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84ZM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4Zm6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z",
  linkedin:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z",
  github:
    "M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.1.82-.25.82-.56v-2.2c-3.34.71-4.04-1.58-4.04-1.58-.55-1.37-1.34-1.74-1.34-1.74-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.79 2.81 1.27 3.5.97.11-.76.42-1.27.76-1.56-2.67-.3-5.47-1.31-5.47-5.83 0-1.29.47-2.34 1.24-3.16-.13-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.2.96-.26 1.98-.39 3-.4 1.02.01 2.04.14 3 .4 2.29-1.52 3.3-1.2 3.3-1.2.66 1.64.25 2.86.12 3.16.77.82 1.24 1.87 1.24 3.16 0 4.53-2.81 5.53-5.49 5.82.43.36.81 1.09.81 2.2v3.26c0 .31.22.67.83.56C20.56 21.88 24 17.49 24 12.29 24 5.78 18.63.5 12 .5Z",
};

const BrandGlyph: React.FC<{ platform: string }> = ({ platform }) => {
  const path = brandPaths[platform.toLowerCase()];
  if (path) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d={path} />
      </svg>
    );
  }
  // generic link glyph for any unmapped platform
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  );
};

const inputClass =
  "atelier-input w-full border-0 border-b border-white/[0.18] bg-transparent py-[9px] font-grotesk text-base text-atelier-paper outline-none placeholder:text-atelier-faint/70";
const labelClass = "mb-[11px] block font-codet text-[11px] tracking-[0.1em] text-atelier-faint";

const ContactSection: React.FC<{ socials: SocialLink[] }> = ({ socials }) => {
  const [sent, setSent] = useState(false);
  const { form, sending, handleSubmit, handleFieldChange } = useContactFormSubmission({
    onSuccess: () => setSent(true),
  });

  return (
    <section
      id="contact"
      className="relative z-10 mx-auto max-w-[1320px] border-t border-white/[0.07] px-12 py-[100px] max-[880px]:px-[22px] max-[880px]:pb-[84px] max-[880px]:pt-[70px] max-[560px]:px-4 max-[560px]:pb-[84px] max-[560px]:pt-[54px]"
    >
      <div className="grid grid-cols-[1fr_1.05fr] items-stretch gap-16 max-[880px]:grid-cols-1 max-[880px]:gap-11">
        {/* left */}
        <div>
          <div className="mb-6 inline-flex items-center gap-[9px] rounded-full border border-atelier-green/30 px-3.5 py-[7px] font-codet text-[11px] tracking-[0.08em] text-atelier-green">
            <span className="h-[7px] w-[7px] rounded-full bg-atelier-green shadow-[0_0_0_3px_rgba(127,185,150,0.18)]" />
            {contactContent.availability}
          </div>
          <div className="mb-[22px] flex items-center gap-3.5">
            <span className="h-px w-11 bg-atelier-gold" />
            <span className="font-codet text-xs tracking-[0.2em] text-atelier-muted">{contactContent.eyebrow}</span>
          </div>
          <h2 className="m-0 mb-6 font-serifd text-[clamp(38px,5vw,64px)] font-normal leading-[0.98] text-atelier-paper">
            {contactContent.headingTop}
            <br />
            {contactContent.headingTail}
            <span className="italic text-atelier-gold">{contactContent.headingAccent}</span>.
          </h2>
          <p className="m-0 mb-9 max-w-[430px] text-[16.5px] leading-[1.7] text-atelier-muted">
            {contactContent.paragraph}
          </p>

          <div className="flex flex-col gap-2.5">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-center gap-[15px] rounded-[10px] border border-white/10 bg-white/[0.015] px-[18px] py-4 no-underline transition hover:translate-x-1 hover:border-atelier-gold/45 hover:bg-atelier-gold/[0.04]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-atelier-gold/[0.12] text-atelier-gold">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-codet text-[10px] tracking-[0.1em] text-atelier-faint">EMAIL</span>
                <span className="text-base text-atelier-paper">{siteConfig.contact.email}</span>
              </span>
              <span className="ml-auto text-atelier-gold">→</span>
            </a>
            <a
              href={siteConfig.contact.phoneHref}
              className="flex items-center gap-[15px] rounded-[10px] border border-white/10 bg-white/[0.015] px-[18px] py-4 no-underline transition hover:translate-x-1 hover:border-atelier-gold/45 hover:bg-atelier-gold/[0.04]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-atelier-gold/[0.12] text-atelier-gold">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 4h4l2 5-3 2a14 14 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                </svg>
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-codet text-[10px] tracking-[0.1em] text-atelier-faint">PHONE</span>
                <span className="text-base text-atelier-paper">{siteConfig.contact.phone}</span>
              </span>
              <span className="ml-auto text-atelier-gold">→</span>
            </a>

            <div className="mt-1.5 flex flex-wrap items-center gap-4 px-1 pt-2.5">
              <span className="w-[60px] font-codet text-[11px] text-atelier-faint">SOCIAL</span>
              <div className="flex flex-wrap gap-3">
                {socials
                  .filter((s) => s.url && s.url !== "#")
                  .map((s) => (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.platform}
                      aria-label={s.platform}
                      className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/[0.16] text-[#C7C2B8] transition hover:-translate-y-[3px] hover:border-atelier-gold hover:text-atelier-gold"
                    >
                      <BrandGlyph platform={s.platform} />
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* form card */}
        <div className="flex flex-col rounded-[14px] border border-white/10 bg-gradient-to-b from-[#121214] to-[#0C0C0E] p-9 max-[560px]:p-6 max-[380px]:px-4">
          <div className="mb-[30px] flex items-center justify-between">
            <span className="font-codet text-[11px] tracking-[0.16em] text-atelier-muted">{contactContent.formTitle}</span>
            <span className="font-codet text-[11px] text-atelier-faint">✉ FORM</span>
          </div>

          {sent ? (
            <div className="flex min-h-[380px] flex-col items-start justify-center">
              <div className="mb-6 flex h-[52px] w-[52px] animate-pulse-ring items-center justify-center rounded-full border border-atelier-green text-2xl text-atelier-green">
                ✓
              </div>
              <h3 className="m-0 mb-3 font-serifd text-[32px] font-normal text-atelier-paper">
                {contactContent.success.title}
              </h3>
              <p className="m-0 mb-[26px] max-w-[360px] text-[15px] leading-[1.6] text-atelier-muted">
                {contactContent.success.body}
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="rounded-[7px] border border-white/20 bg-transparent px-[22px] py-3 font-grotesk text-[14px] font-medium text-atelier-paper"
              >
                {contactContent.success.again}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-[26px]">
              <div className="grid grid-cols-2 gap-[26px] max-[880px]:grid-cols-1 max-[880px]:gap-[22px]">
                <div>
                  <label className={labelClass}>YOUR NAME</label>
                  <input
                    required
                    placeholder="Jane Doe"
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>EMAIL</label>
                  <input
                    required
                    type="email"
                    placeholder="jane@studio.com"
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>SUBJECT</label>
                <input
                  placeholder="A new project"
                  className={inputClass}
                  value={form.subject}
                  onChange={(e) => handleFieldChange("subject", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>MESSAGE</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell me about it…"
                  className={`atelier-textarea ${inputClass} resize-none`}
                  value={form.message}
                  onChange={(e) => handleFieldChange("message", e.target.value)}
                />
              </div>
              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-lg border-none bg-atelier-gold px-[30px] py-[15px] font-grotesk text-[15px] font-semibold text-atelier-ink disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send message →"}
                </button>
                <span className="flex items-center gap-[7px] font-codet text-[11px] text-atelier-faint">
                  <span className="h-1.5 w-1.5 rounded-full bg-atelier-green" />
                  {contactContent.replyNote}
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
