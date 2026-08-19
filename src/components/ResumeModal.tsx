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
            className="at-btn-ghost"
          >
            {previewName ? "Change file" : "Upload PDF"}
          </button>
          {previewName && (
            <p className="truncate text-sm text-atelier-muted max-w-xs" title={previewName}>
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
          className="at-btn w-full"
        >
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
