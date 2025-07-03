import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

interface Project {
  _id?: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setLink(initialData.link);
      setPreview(initialData.image);
    } else {
      setTitle("");
      setDescription("");
      setLink("");
      setImageFile(null);
      setPreview(null);
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("link", link);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      if (initialData?._id) {
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/projects/${initialData._id}`, formData, config);
      } else {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/projects`, formData, config);
      }

      onSaved();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-[#0a0f29] w-full max-w-lg rounded-2xl shadow-xl p-6 relative border border-white/10">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-yellow-400 transition">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-yellow-400 mb-6">{initialData ? "Edit Project" : "Add Project"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-3 rounded-md bg-black/40 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            className="w-full p-3 rounded-md bg-black/40 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Link (e.g. GitHub or live demo)"
            className="w-full p-3 rounded-md bg-black/40 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded shadow"
            >
              {imageFile || preview ? "Change Image" : "Upload Image"}
            </button>
            {preview && <img src={preview} alt="Preview" className="w-16 h-16 rounded object-cover" />}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-md shadow transition"
          >
            {initialData ? "Update Project" : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
