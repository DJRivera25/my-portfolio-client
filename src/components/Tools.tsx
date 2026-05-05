"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import ToolModal from "./ToolModal";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import api from "../lib/api/client";
import { useAuth } from "../context/AuthContext";
import type { Tool } from "../types/portfolio";
import { toolsSectionContent } from "../config/content";
import { formatToolCategoryLabel, sortToolCategoryEntries } from "../config/toolCategories";
import AuroraBackdrop from "./ui/AuroraBackdrop";
import GlassCard from "./ui/GlassCard";
import SectionHeader from "./ui/SectionHeader";

const groupByCategory = (tools: Tool[]) => {
  const grouped: Record<string, Tool[]> = {};
  tools.forEach((tool) => {
    if (!grouped[tool.category]) grouped[tool.category] = [];
    grouped[tool.category].push(tool);
  });
  return grouped;
};

const Tools: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn: isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTools = async () => {
    try {
      const res = await api.get<Tool[]>("/api/tools");
      setTools(res.data);
    } catch (err) {
      console.error("Error fetching tools:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this tool?")) return;
    setDeletingId(id);
    try {
      await api.delete("/api/tools", { data: { id } });
      setTools((prev) => prev.filter((tool) => tool._id !== id));
      toast.success("Tool deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete tool. Please try again.");
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const openModal = (tool?: Tool) => {
    setEditTool(tool || null);
    setIsModalOpen(true);
  };

  const groupedTools = groupByCategory(tools);
  const sortedCategoryEntries = sortToolCategoryEntries(Object.entries(groupedTools));

  return (
    <section
      id="tools"
      className="relative overflow-hidden bg-brand-navy py-section-sm md:py-section text-white"
    >
      <AuroraBackdrop tint="cyan-violet" />
      <div className="container relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow={toolsSectionContent.eyebrow}
            heading={toolsSectionContent.heading}
            subhead={toolsSectionContent.subhead}
          />
          {isAdmin && (
            <button
              type="button"
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-brand-navy shadow-brand-glow transition hover:bg-accent-hover"
            >
              <Plus className="h-4 w-4" /> Add tool
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, catIdx) => (
              <GlassCard key={catIdx} className="p-6">
                <div className="h-5 w-1/2 rounded bg-accent/20 shimmer mb-6" />
                <div className="flex flex-wrap gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 w-16 rounded-xl bg-white/10 shimmer" />
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        ) : tools.length === 0 ? (
          <p className="mt-12 rounded-2xl border border-dashed border-white/15 bg-surface-glass py-16 text-center text-white/70">
            {toolsSectionContent.empty}
          </p>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {sortedCategoryEntries.map(([category, items]) => (
              <motion.div
                key={category}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <GlassCard className="h-full p-6" hoverLift>
                  <h3 className="text-eyebrow uppercase text-accent-cyan mb-5">
                    {formatToolCategoryLabel(category)}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {items.map((tool) => (
                      <div
                        key={tool._id}
                        className="group relative flex flex-col items-center gap-1.5 w-[4.5rem]"
                        title={tool.name}
                      >
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-hairline-strong bg-white/5 transition hover:border-accent-cyan hover:bg-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={tool.icon} alt="" className="h-9 w-9 object-contain" />
                          {isAdmin && (
                            <div className="absolute -top-1.5 -right-1.5 z-20 flex gap-0.5">
                              <button
                                type="button"
                                onClick={() => handleDelete(tool._id)}
                                className="rounded-full border border-white/30 bg-red-500/80 p-0.5 text-white shadow backdrop-blur-glass hover:bg-red-500"
                                disabled={deletingId === tool._id}
                                aria-label="Delete tool"
                              >
                                {deletingId === tool._id ? (
                                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                  <Trash2 size={11} />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => openModal(tool)}
                                className="rounded-full border border-white/30 bg-blue-500/80 p-0.5 text-white shadow backdrop-blur-glass hover:bg-blue-500"
                                aria-label="Edit tool"
                              >
                                <Pencil size={11} />
                              </button>
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-center text-white/65 leading-tight max-h-[2.5rem] overflow-hidden">
                          {tool.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <ToolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          fetchTools();
          setIsModalOpen(false);
        }}
        initialData={editTool}
      />
    </section>
  );
};

export default Tools;
