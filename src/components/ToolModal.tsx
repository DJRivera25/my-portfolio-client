"use client";

import React, { useEffect, useRef, useState } from "react";
import api from "../lib/api/client";
import { toast } from "react-toastify";
import { TOOL_CATEGORY_OPTIONS } from "../config/toolCategories";
import ModalFrame from "./ui/ModalFrame";

interface Tool {
  _id?: string;
  name: string;
  category: string;
  icon: string;
}

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: Tool | null;
}

const ToolModal: React.FC<ToolModalProps> = ({ isOpen, onClose, onSaved, initialData }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setPreview(initialData.icon);
    } else {
      setName("");
      setCategory("");
      setPreview(null);
      setIconFile(null);
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      if (iconFile) {
        formData.append("icon", iconFile);
      }
      if (initialData?._id) {
        formData.append("id", initialData._id);
        await api.put("/api/tools", formData);
        toast.success("Tool updated successfully!");
      } else {
        await api.post("/api/tools", formData);
        toast.success("Tool added successfully!");
      }
      onSaved();
    } catch (error) {
      toast.error("Error saving tool. Please try again.");
      console.error("Error saving tool:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalFrame
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Tool"
      title={initialData ? "Edit tool" : "Add tool"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Tool name"
          className="w-full rounded-lg border border-hairline-strong bg-brand-navy/40 px-4 py-3 text-sm text-white placeholder:text-white/40 transition focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full rounded-lg border border-hairline-strong bg-brand-navy/40 px-4 py-3 text-sm text-white transition focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan"
        >
          <option value="" style={{ background: "#0a0f29", color: "white" }}>Select category</option>
          {TOOL_CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: "#0a0f29", color: "white" }}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-hairline-strong bg-surface-glass px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-accent-cyan hover:text-accent-cyan"
          >
            {iconFile || preview ? "Change icon" : "Upload icon"}
          </button>
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="h-12 w-12 rounded-lg border border-hairline-strong object-cover bg-white/5" />
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold uppercase tracking-wide text-brand-navy shadow-brand-glow transition hover:bg-accent-hover disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-navy border-t-transparent" />
              Saving…
            </>
          ) : initialData ? (
            "Update tool"
          ) : (
            "Create tool"
          )}
        </button>
      </form>
    </ModalFrame>
  );
};

export default ToolModal;
