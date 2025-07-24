"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";

interface Social {
  _id?: string;
  platform: string;
  icon: string;
  url: string;
}

interface SocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: Social | null;
}

const SocialModal: React.FC<SocialModalProps> = ({ isOpen, onClose, onSaved, initialData }) => {
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setPlatform(initialData.platform);
      setUrl(initialData.url);
      setPreview(initialData.icon);
    } else {
      setPlatform("");
      setUrl("");
      setIconFile(null);
      setPreview(null);
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
      formData.append("platform", platform);
      formData.append("url", url);
      if (iconFile) {
        formData.append("icon", iconFile);
      }
      if (initialData?._id) {
        formData.append("id", initialData._id);
        await axios.put("/api/socials", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Social link updated successfully!");
      } else {
        await axios.post("/api/socials", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Social link added successfully!");
      }
      onSaved();
    } catch (error) {
      toast.error("Error saving social link. Please try again.");
      console.error("Error saving social:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-[#0a0f29] w-full max-w-lg rounded-2xl shadow-xl p-6 relative border border-white/10">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-yellow-400 transition">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-yellow-400 mb-6">
          {initialData ? "Edit Social Link" : "Add Social Link"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Platform (e.g. Facebook)"
            className="w-full p-3 rounded-md bg-black/40 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            required
          />

          <input
            type="url"
            placeholder="URL (https://...)"
            className="w-full p-3 rounded-md bg-black/40 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded shadow"
            >
              {iconFile || preview ? "Change Icon" : "Upload Icon"}
            </button>
            {preview && <img src={preview} alt="Preview" className="w-12 h-12 rounded-full object-contain" />}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-md shadow transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Saving...
              </span>
            ) : initialData ? (
              "Update Social"
            ) : (
              "Create Social"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SocialModal;
