"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import api from "../lib/api/client";
import { toast } from "react-toastify";
import ModalFrame from "./ui/ModalFrame";
import type { Project } from "../types/portfolio";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: Project | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSaved, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [year, setYear] = useState<string>("");
  const [role, setRole] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mobileImageFile, setMobileImageFile] = useState<File | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileFileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setLink(initialData.link);
      setYear(initialData.year ? String(initialData.year) : "");
      setRole(initialData.role ?? "");
      setTags(initialData.tags ?? []);
      setPreview(initialData.image);
      setMobilePreview(initialData.mobileImage ?? null);
      setImageFile(null);
      setMobileImageFile(null);
      setTagDraft("");
    } else {
      setTitle("");
      setDescription("");
      setLink("");
      setYear("");
      setRole("");
      setTags([]);
      setTagDraft("");
      setImageFile(null);
      setPreview(null);
      setMobileImageFile(null);
      setMobilePreview(null);
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleMobileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMobileImageFile(file);
      setMobilePreview(URL.createObjectURL(file));
    }
  };

  const commitTagDraft = () => {
    const value = tagDraft.trim();
    if (!value) return;
    if (tags.includes(value)) {
      setTagDraft("");
      return;
    }
    if (tags.length >= 12) {
      toast.info("Up to 12 tags per project.");
      return;
    }
    setTags([...tags, value]);
    setTagDraft("");
  };

  const handleTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitTagDraft();
    } else if (e.key === "Backspace" && !tagDraft && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("link", link);
      formData.append("tags", JSON.stringify(tags));
      if (year) formData.append("year", year);
      else if (initialData) formData.append("year", "");
      formData.append("role", role);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (mobileImageFile) {
        formData.append("mobileImage", mobileImageFile);
      }
      if (initialData?._id) {
        await api.put(`/api/projects/${initialData._id}`, formData);
        toast.success("Project updated successfully!");
      } else {
        await api.post("/api/projects", formData);
        toast.success("Project added successfully!");
      }
      onSaved();
    } catch (error) {
      toast.error("Error saving project. Please try again.");
      console.error("Error saving project:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-hairline-strong bg-brand-navy/40 px-4 py-3 text-sm text-white placeholder:text-white/40 transition focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan";

  return (
    <ModalFrame
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Project"
      title={initialData ? "Edit project" : "Add project"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          rows={4}
          className={`${inputClass} resize-none`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Link (e.g. https://example.com)"
          className={inputClass}
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Year (optional)"
            className={inputClass}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min={2000}
            max={2100}
          />
          <input
            type="text"
            placeholder="Role (optional)"
            className={inputClass}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center gap-1.5 rounded-lg border border-hairline-strong bg-brand-navy/40 px-3 py-2 focus-within:border-accent-cyan focus-within:ring-1 focus-within:ring-accent-cyan">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-accent-cyan/30 bg-accent-cyan-soft px-2.5 py-0.5 text-xs font-medium text-accent-cyan"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-accent-cyan/70 transition hover:text-accent-cyan"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder={tags.length === 0 ? "Tech stack (Enter or , to add)" : "Add tag…"}
              className="flex-1 min-w-[120px] bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={handleTagKey}
              onBlur={commitTagDraft}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ImageInput
            label="Desktop screenshot"
            preview={preview}
            inputRef={fileInputRef}
            onChange={handleFileChange}
            ratio="aspect-[16/10]"
          />
          <ImageInput
            label="Mobile screenshot (optional)"
            preview={mobilePreview}
            inputRef={mobileFileInputRef}
            onChange={handleMobileFileChange}
            ratio="aspect-[9/16]"
          />
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
            "Update project"
          ) : (
            "Create project"
          )}
        </button>
      </form>
    </ModalFrame>
  );
};

type ImageInputProps = {
  label: string;
  preview: string | null;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ratio: string;
};

const ImageInput: React.FC<ImageInputProps> = ({ label, preview, inputRef, onChange, ratio }) => (
  <div className="rounded-lg border border-hairline-strong bg-surface-glass p-3">
    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/60">{label}</p>
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-md border border-dashed border-hairline-strong bg-brand-navy/40 text-xs text-white/55 transition hover:border-accent-cyan hover:text-accent-cyan ${ratio}`}
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt={`${label} preview`} className="h-full w-full object-cover" />
      ) : (
        <span>Click to upload</span>
      )}
    </button>
    <input type="file" ref={inputRef} onChange={onChange} accept="image/*" className="hidden" />
  </div>
);

export default ProjectModal;
