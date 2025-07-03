import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

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

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      if (initialData?._id) {
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/tools/${initialData._id}`, formData, config);
      } else {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/tools`, formData, config);
      }

      onSaved();
    } catch (error) {
      console.error("Error saving tool:", error);
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

        <h2 className="text-2xl font-bold text-yellow-400 mb-6">{initialData ? "Edit Tool" : "Add Tool"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Tool Name"
            className="w-full p-3 rounded-md bg-black/40 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-md bg-black/40 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          >
            <option value="">Select Category</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="database">Database</option>
            <option value="devtools">Development Tools</option>
            <option value="deployment">Deployment & Cloud</option>
          </select>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded shadow"
            >
              {iconFile || preview ? "Change Icon" : "Upload Icon"}
            </button>
            {preview && (
              <img src={preview} alt="Preview" className="w-12 h-12 rounded-full border object-contain bg-white" />
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-md shadow transition"
          >
            {loading ? "Saving..." : initialData ? "Update Tool" : "Create Tool"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ToolModal;
