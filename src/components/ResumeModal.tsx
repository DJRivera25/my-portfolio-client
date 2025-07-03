import React, { useRef, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

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

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", resumeFile);

      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/resume`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      onSaved();
    } catch (err) {
      console.error("Failed to upload resume:", err);
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

        <h2 className="text-2xl font-bold text-yellow-400 mb-6">Upload Resume</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded shadow"
            >
              {previewName ? "Change File" : "Upload PDF"}
            </button>
            {previewName && (
              <p className="text-white/80 text-sm truncate max-w-xs" title={previewName}>
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
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-md shadow transition"
          >
            {loading ? "Uploading..." : "Save Resume"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeModal;
