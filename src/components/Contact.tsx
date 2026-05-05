"use client";

import React, { useEffect, useState } from "react";
import api from "../lib/api/client";
import { Plus, Trash2, Pencil, Mail, Phone } from "lucide-react";
import SocialModal from "./SocialModal";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site";
import { contactSectionContent } from "../config/content";
import type { Social } from "../types/portfolio";
import { useContactFormSubmission } from "../hooks/useContactFormSubmission";
import ContactMessageForm from "./ContactMessageForm";
import AuroraBackdrop from "./ui/AuroraBackdrop";
import GlassCard from "./ui/GlassCard";
import SectionHeader from "./ui/SectionHeader";

const Contact: React.FC = () => {
  const [socials, setSocials] = useState<Social[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSocial, setEditSocial] = useState<Social | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadingSocials, setLoadingSocials] = useState(true);

  const { isLoggedIn } = useAuth();
  const { form, sending, handleSubmit, handleFieldChange } = useContactFormSubmission();

  const fetchSocials = async () => {
    try {
      const res = await api.get<Social[]>("/api/socials");
      setSocials(res.data);
    } catch (err) {
      console.error("Error fetching socials:", err);
    } finally {
      setLoadingSocials(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this social link?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/socials/${id}`);
      setSocials((prev) => prev.filter((s) => s._id !== id));
      toast.success("Social link deleted successfully!");
    } catch (err) {
      toast.error("Delete failed. Please try again.");
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const openModal = (social?: Social) => {
    setEditSocial(social || null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-brand-navy py-section-sm md:py-section text-white"
    >
      <AuroraBackdrop tint="cyan-violet" />
      <div className="container relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeader
          eyebrow={contactSectionContent.eyebrow}
          heading={contactSectionContent.heading}
          subhead={contactSectionContent.subhead}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4">
              <h3 className="text-eyebrow uppercase text-accent-cyan">{contactSectionContent.followLabel}</h3>
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => openModal()}
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-brand-navy shadow-brand-glow transition hover:bg-accent-hover"
                >
                  <Plus size={14} /> Add social
                </button>
              )}
              <div className="flex flex-wrap gap-3">
                {loadingSocials && socials.length === 0
                  ? [...Array(4)].map((_, i) => (
                      <div key={i} className="h-12 w-12 rounded-xl bg-white/10 shimmer" />
                    ))
                  : socials.map((social) => (
                      <div key={social._id} className="group relative">
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.platform}
                          className="flex h-12 w-12 items-center justify-center rounded-xl border border-hairline-strong bg-surface-glass backdrop-blur-glass transition hover:border-accent-cyan hover:shadow-cyan-glow"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={social.icon} alt="" className="h-6 w-6 object-contain" />
                        </a>
                        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-brand-navy-light px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                          {social.platform}
                        </span>
                        {isLoggedIn && (
                          <div className="absolute -top-2 -right-2 flex gap-1">
                            <button
                              onClick={() => handleDelete(social._id!)}
                              className="rounded-full border border-white/30 bg-red-500/80 p-0.5 text-white backdrop-blur-glass hover:bg-red-500"
                              disabled={deletingId === social._id}
                              aria-label="Delete social"
                            >
                              {deletingId === social._id ? (
                                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              ) : (
                                <Trash2 size={11} />
                              )}
                            </button>
                            <button
                              onClick={() => openModal(social)}
                              className="rounded-full border border-white/30 bg-blue-500/80 p-0.5 text-white backdrop-blur-glass hover:bg-blue-500"
                              aria-label="Edit social"
                            >
                              <Pencil size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 text-white/85">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-flex items-center gap-3 transition hover:text-accent-cyan"
              >
                <Mail className="h-4 w-4 text-accent-cyan" aria-hidden />
                <span className="break-all text-sm md:text-base">{siteConfig.contact.email}</span>
              </a>
              <a
                href={siteConfig.contact.phoneHref}
                className="inline-flex items-center gap-3 transition hover:text-accent-cyan"
              >
                <Phone className="h-4 w-4 text-accent-cyan" aria-hidden />
                <span className="text-sm md:text-base">{siteConfig.contact.phone}</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <GlassCard className="p-6 sm:p-8">
              <ContactMessageForm
                form={form}
                onFieldChange={handleFieldChange}
                onSubmit={handleSubmit}
                sending={sending}
                animated
              />
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <SocialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          fetchSocials();
          setIsModalOpen(false);
        }}
        initialData={editSocial}
      />
    </section>
  );
};

export default Contact;
