"use client";

import React, { useRef, useState } from "react";
import api from "../lib/api/client";
import { toast } from "react-toastify";
import ModalFrame from "./ui/ModalFrame";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      setPreviewName(file.name);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      await api.post("/api/resume", formData);
      toast.success("Resume uploaded successfully!");
      onSaved();
    } catch (err) {
      toast.error("Failed to upload resume. Please try again.");
      console.error("Failed to upload resume:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose} eyebrow="Resume" title="Upload resume">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-hairline-strong bg-surface-glass px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-accent-cyan hover:text-accent-cyan"
          >
            {previewName ? "Change file" : "Upload PDF"}
          </button>
          {previewName && (
            <p className="truncate text-sm text-white/70 max-w-xs" title={previewName}>
              {previewName}
            </p>
          )}
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !resumeFile}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold uppercase tracking-wide text-brand-navy shadow-brand-glow transition hover:bg-accent-hover disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-navy border-t-transparent" />
              Uploading…
            </>
          ) : (
            "Upload resume"
          )}
        </button>
      </form>
    </ModalFrame>
  );
};

export default ResumeModal;
