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

const yellow = "#FFD600";
const lightBg = "#f7fafc";

const groupByCategory = (tools: Tool[]) => {
  const grouped: Record<string, Tool[]> = {};
  tools.forEach((tool) => {
    if (!grouped[tool.category]) {
      grouped[tool.category] = [];
    }
    grouped[tool.category].push(tool);
  });
  return grouped;
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 80 } },
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
    const ok = window.confirm("Delete this tool?");
    if (!ok) return;
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
    <motion.section
      id="tools"
      className="py-section-sm md:py-section bg-cover bg-center text-brand-navy relative mx-auto px-4 sm:px-8 lg:px-20"
      style={{ background: lightBg }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      <div className="absolute left-0 right-0 top-0 h-1 pointer-events-none z-10" style={{ filter: "blur(4px)" }}>
        <div className="w-full h-full bg-gradient-to-r from-yellow-400/60 via-yellow-200/40 to-yellow-400/60" />
      </div>
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <motion.div
          className={`flex flex-col sm:flex-row ${isAdmin ? "justify-between" : "justify-center"} items-center gap-4 mb-12 text-center sm:text-left`}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">{toolsSectionContent.heading}</h2>
            <p className="mt-2 text-brand-navy/70 text-sm md:text-base">{toolsSectionContent.subhead}</p>
            <motion.div
              className="absolute left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 bottom-[-10px] w-24 h-2 rounded-full mx-auto sm:mx-0 mt-4 sm:mt-0"
              style={{ background: yellow, filter: "blur(2px)" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
            />
          </div>
          {isAdmin && (
            <motion.button
              type="button"
              onClick={() => openModal()}
              className="flex gap-2 items-center bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg shadow transition font-bold"
              whileHover={{ scale: 1.06, boxShadow: `0 0 16px 2px ${yellow}` }}
              whileTap={{ scale: 0.96 }}
            >
              <Plus className="w-4 h-4" /> Add tool
            </motion.button>
          )}
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[...Array(3)].map((_, catIdx) => (
              <div key={catIdx}>
                <div className="h-7 w-2/3 mx-auto bg-yellow-400/30 rounded mb-6 shimmer" />
                <div className="flex flex-wrap justify-center gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-20 h-20 rounded-full bg-white/60 border-2 border-yellow-400/20 shimmer flex items-center justify-center mb-2"
                    >
                      <div className="w-14 h-14 rounded-full bg-yellow-400/20 shimmer" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : tools.length === 0 ? (
          <p className="text-center text-brand-navy/70 py-16 border border-dashed border-brand-navy/20 rounded-2xl bg-white/60">
            {toolsSectionContent.empty}
          </p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 gap-12 text-center"
          >
            {sortedCategoryEntries.map(([category, items]) => (
              <div key={category}>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl font-semibold mb-6 text-yellow-600"
                >
                  {formatToolCategoryLabel(category)}
                </motion.h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {items.map((tool) => (
                    <motion.div
                      key={tool._id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.06, boxShadow: `0 0 24px 0 ${yellow}40` }}
                      className="relative flex flex-col items-center gap-2 w-[5.5rem]"
                    >
                      <div className="relative w-20 h-20 rounded-full shadow-lg flex items-center justify-center bg-white border-2 border-yellow-400/25 hover:border-yellow-400 transition-all duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tool.icon}
                          alt=""
                          className="w-14 h-14 rounded-full object-contain"
                        />
                        {isAdmin && (
                          <div className="absolute -top-1 -right-1 flex gap-0.5 z-30">
                            <motion.button
                              type="button"
                              onClick={() => handleDelete(tool._id)}
                              className="p-0.5 rounded-full text-red-500 hover:text-red-700 border border-white shadow bg-white/95"
                              disabled={deletingId === tool._id}
                              whileTap={{ scale: 0.92 }}
                              aria-label="Delete tool"
                            >
                              {deletingId === tool._id ? (
                                <span className="inline-block h-3 w-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 size={12} />
                              )}
                            </motion.button>
                            <motion.button
                              type="button"
                              onClick={() => openModal(tool)}
                              className="p-0.5 rounded-full text-blue-600 hover:text-blue-800 border border-white shadow bg-white/95"
                              whileTap={{ scale: 0.92 }}
                              aria-label="Edit tool"
                            >
                              <Pencil size={12} />
                            </motion.button>
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] sm:text-xs font-medium text-brand-navy/85 text-center leading-snug px-0.5 max-h-[2.5rem] overflow-hidden min-h-[2.5rem] flex items-start justify-center">
                        {tool.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
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
    </motion.section>
  );
};

export default Tools;
