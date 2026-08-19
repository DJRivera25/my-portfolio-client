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
          className="at-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="at-field"
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
            className="at-btn-ghost"
          >
            {iconFile || preview ? "Change icon" : "Upload icon"}
          </button>
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="h-12 w-12 rounded-lg border border-white/[0.12] object-cover bg-white/5" />
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="at-btn w-full"
        >
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
