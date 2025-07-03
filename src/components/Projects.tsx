import React, { useEffect, useState } from "react";
import { FileText, Plus, Trash2, Pencil, Upload } from "lucide-react";
import axios from "axios";
import ProjectModal from "./ProjectModal";
import ResumeModal from "./ResumeModal";

interface Project {
  _id?: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");

  console.log(resumeUrl);
  const fetchResume = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/resume`);
      setResumeUrl(res.data.url);
    } catch {
      setResumeUrl("");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/projects`);
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAdmin(true);
    fetchProjects();
    fetchResume();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this project?");
      if (!confirm) return;

      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleModalSaved = () => {
    fetchProjects();
    handleModalClose();
  };

  return (
    <section
      id="projects"
      className="py-16 bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('https://img.freepik.com/premium-vector/vector-technology-design-dark-blue-color-background_43778-490.jpg')",
      }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row ${
            isAdmin ? "justify-between" : "justify-center"
          } items-center gap-4 mb-12`}
        >
          <h2 className="text-4xl md:text-5xl font-bold uppercase text-center sm:text-left">Projects</h2>

          <div className="flex gap-4">
            {isAdmin && (
              <>
                <button
                  className="flex gap-2 items-center bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded shadow transition"
                  onClick={() => {
                    setEditingProject(null);
                    setIsModalOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>

                <button
                  className="flex gap-2 items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition"
                  onClick={() => setIsResumeModalOpen(true)}
                >
                  <Upload className="w-4 h-4" />
                  Upload Resume
                </button>
              </>
            )}
          </div>
        </div>

        {/* Project List */}
        {loading ? (
          <p className="text-center text-white/70">Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                className="relative bg-[#0a0f29] border border-white/10 rounded-xl overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-yellow-400"
              >
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <div className="overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-[220px] sm:h-[200px] object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-5 space-y-2 text-left">
                    <h5 className="text-lg font-semibold text-yellow-400">{project.title}</h5>
                    <p className="text-sm text-white/80">{project.description}</p>
                  </div>
                </a>

                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                      onClick={() => handleDelete(project._id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                      onClick={() => {
                        setEditingProject(project);
                        setIsModalOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Resume Viewer */}
        <div className="mt-12 flex justify-center">
          {resumeUrl ? (
            <div className="mt-12 max-w-4xl mx-auto w-full">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4 text-center">View My Resume</h3>
              <div className="border border-white/10 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={`${resumeUrl}.pdf`}
                  title="My Resume"
                  className="w-full h-[80vh] rounded-md"
                  frameBorder="0"
                />
              </div>
            </div>
          ) : (
            <p className="text-white/60 italic text-center mt-12">No resume available</p>
          )}
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSaved={handleModalSaved}
          initialData={editingProject}
        />
      )}

      {isResumeModalOpen && (
        <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} onSaved={fetchResume} />
      )}
    </section>
  );
};

export default Projects;
