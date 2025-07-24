"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Pencil } from "lucide-react";
import ToolModal from "./ToolModal";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const darkBlue = "#0a0f29";
const yellow = "#FFD600";
const lightBg = "#f7fafc";

interface Tool {
  _id?: string;
  name: string;
  icon: string;
  category: string;
}

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const fetchTools = async () => {
    try {
      const res = await axios.get("/api/tools");
      setTools(res.data);
    } catch (err) {
      console.error("Error fetching tools:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAdmin(!!token);
    fetchTools();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Delete this tool?");
    if (!confirm) return;
    setDeletingId(id);
    try {
      await axios.delete("/api/tools", {
        data: { id },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
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
  return (
    <motion.section
      id="tools"
      className="py-20 bg-cover bg-center text-[#0a0f29] relative mx-auto sm:px-20"
      style={{ background: lightBg }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {/* Glowing border accent */}
      <div className="absolute left-0 right-0 top-0 h-1 pointer-events-none z-10" style={{ filter: "blur(4px)" }}>
        <div className="w-full h-full bg-gradient-to-r from-yellow-400/60 via-yellow-200/40 to-yellow-400/60" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className={`flex flex-col sm:flex-row ${isAdmin ? "justify-between" : "justify-center"} items-center gap-4 mb-12`}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <div className="relative">
            <h2 className="text-4xl font-bold text-[#0a0f29] text-center">TOOLS & TECHNOLOGIES</h2>
            {/* Animated glowing divider */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-24 h-2 rounded-full"
              style={{ background: yellow, filter: "blur(2px)" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
            />
          </div>
          {isAdmin && (
            <motion.button
              onClick={() => openModal()}
              className="flex gap-2 items-center bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded shadow transition font-bold relative overflow-hidden"
              whileHover={{ scale: 1.06, boxShadow: `0 0 16px 2px ${yellow}` }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="relative z-10 flex items-center">
                <Plus className="w-4 h-4" /> Add Tool
              </span>
              <motion.span
                className="absolute inset-0 rounded"
                initial={{ opacity: 0 }}
                whileTap={{ opacity: 0.2, scale: 1.2, background: yellow }}
                transition={{ duration: 0.3 }}
              />
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
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 gap-12 text-center"
          >
            {Object.entries(groupedTools).map(([category, items]) => (
              <div key={category}>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl font-semibold mb-6 text-yellow-500 capitalize"
                >
                  {category}
                </motion.h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {items.map((tool, i) => (
                    <motion.div
                      key={tool._id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.13, boxShadow: `0 0 32px 0 ${yellow}55` }}
                      className="relative w-20 h-20 rounded-full shadow-lg flex items-center justify-center bg-white group border-2 border-yellow-400/20 hover:border-yellow-400 transition-all duration-300"
                      tabIndex={0}
                      onMouseEnter={() => setHoveredTool(tool._id!)}
                      onMouseLeave={() => setHoveredTool(null)}
                    >
                      <img
                        src={tool.icon}
                        alt={tool.name}
                        className="w-14 h-14 rounded-full object-contain group-hover:scale-110 transition-transform"
                        title={tool.name}
                      />
                      {/* Animated tooltip/label */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: hoveredTool === tool._id ? 1 : 0, y: hoveredTool === tool._id ? -30 : 10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-1/2 -translate-x-1/2 top-0 mt-2 px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded shadow-lg pointer-events-none z-40"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {tool.name}
                      </motion.div>
                      {isAdmin && (
                        <div className="absolute -top-2 -right-2 flex gap-1 z-30">
                          <motion.button
                            onClick={() => handleDelete(tool._id!)}
                            className="p-1 rounded-full text-red-400 hover:text-red-600 border border-white shadow relative overflow-hidden"
                            disabled={deletingId === tool._id}
                            whileTap={{ scale: 0.92 }}
                          >
                            {deletingId === tool._id ? (
                              <svg
                                className="animate-spin h-4 w-4 text-red-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                              </svg>
                            ) : (
                              <Trash2 size={14} />
                            )}
                            <motion.span
                              className="absolute inset-0 rounded-full"
                              initial={{ opacity: 0 }}
                              whileTap={{ opacity: 0.2, scale: 1.2, background: "#dc2626" }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.button>
                          <motion.button
                            onClick={() => openModal(tool)}
                            className="p-1 rounded-full text-blue-400 hover:text-blue-600 border border-white shadow relative overflow-hidden"
                            whileTap={{ scale: 0.92 }}
                          >
                            <Pencil size={14} />
                            <motion.span
                              className="absolute inset-0 rounded-full"
                              initial={{ opacity: 0 }}
                              whileTap={{ opacity: 0.2, scale: 1.2, background: "#2563eb" }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Tool Modal */}
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
