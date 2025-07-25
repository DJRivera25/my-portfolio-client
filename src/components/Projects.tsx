"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Upload, Star } from "lucide-react";
import axios from "axios";
import ProjectModal from "./ProjectModal";
import ResumeModal from "./ResumeModal";
import { motion } from "framer-motion";

const darkBlue = "#0a0f29";
const yellow = "#FFD600";

interface Project {
  _id?: string;
  title: string;
  description: string;
  image: string;
  link: string;
  tags?: string[];
  featured?: boolean;
  isNew?: boolean;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [featuringId, setFeaturingId] = useState<string | null>(null);

  const fetchResume = async () => {
    try {
      const res = await axios.get("/api/resumes");
      setResumeUrl(res.data[0]?.url || res.data[0]?.fileUrl || "");
    } catch {
      setResumeUrl("");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/api/projects");
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

      await axios.delete("/api/projects", {
        data: { id },
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

  const handleSetFeatured = async (id: string) => {
    setFeaturingId(id);
    try {
      await axios.patch(`/api/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error("Failed to set featured project:", error);
    } finally {
      setFeaturingId(null);
    }
  };

  // Split featured and regular projects
  const featured = projects.find((p) => p.featured);
  const regularProjects = featured ? projects.filter((p) => p !== featured) : projects;

  return (
    <motion.section
      id="projects"
      className="py-20 bg-cover bg-center text-white relative sm:px-20 mx-auto"
      style={{
        backgroundImage:
          "linear-gradient(rgba(10, 15, 41, 0.96), rgba(10, 15, 41, 0.96)), url('https://img.freepik.com/premium-vector/vector-technology-design-dark-blue-color-background_43778-490.jpg')",
        backgroundColor: darkBlue,
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {/* Glowing border accent */}
      <div className="absolute left-0 right-0 top-0 h-1 pointer-events-none z-10" style={{ filter: "blur(4px)" }}>
        <div className="w-full h-full bg-gradient-to-r from-yellow-400/60 via-yellow-200/40 to-yellow-400/60" />
      </div>
      {/* Animated pattern/particles background (optional, can be replaced with a real particles lib) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" className="h-full w-full">
          <defs>
            <radialGradient id="g1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD600" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0a0f29" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="30%" cy="20%" r="120" fill="url(#g1)" />
          <circle cx="80%" cy="70%" r="90" fill="url(#g1)" />
          <circle cx="60%" cy="40%" r="60" fill="url(#g1)" />
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className={`flex flex-col sm:flex-row ${isAdmin ? "justify-between" : "justify-center"} items-center gap-4 mb-12`}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold uppercase text-center sm:text-left text-white">Projects</h2>
            {/* Animated glowing divider */}
            <motion.div
              className="sm:absolute left-1/2 sm:-translate-x-1/2 bottom-[-14px] w-32 h-2 rounded-full"
              style={{ background: `linear-gradient(90deg, #FFD600 60%, #fff 100%)`, filter: "blur(2px)" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
            />
          </div>
          <div className="flex gap-4">
            {isAdmin && (
              <>
                <motion.button
                  className="flex gap-2 items-center bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded shadow transition font-bold relative overflow-hidden"
                  whileHover={{ scale: 1.06, boxShadow: `0 0 16px 2px ${yellow}` }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setEditingProject(null);
                    setIsModalOpen(true);
                  }}
                >
                  <span className="relative z-10 flex items-center">
                    <Plus className="w-4 h-4" /> Add Project
                  </span>
                  <motion.span
                    className="absolute inset-0 rounded"
                    initial={{ opacity: 0 }}
                    whileTap={{ opacity: 0.2, scale: 1.2, background: yellow }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
                <motion.button
                  className="flex gap-2 items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition font-bold relative overflow-hidden"
                  whileHover={{ scale: 1.06, boxShadow: `0 0 16px 2px #60a5fa` }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsResumeModalOpen(true)}
                >
                  <span className="relative z-10 flex items-center">
                    <Upload className="w-4 h-4" /> Upload Resume
                  </span>
                  <motion.span
                    className="absolute inset-0 rounded"
                    initial={{ opacity: 0 }}
                    whileTap={{ opacity: 0.2, scale: 1.2, background: "#60a5fa" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {/* Featured Project */}
        {loading ? (
          <>
            {/* Featured Project Skeleton */}
            <motion.div
              className="relative bg-[#0a0f29] border-2 border-yellow-400/30 rounded-2xl overflow-hidden mb-12 shadow-xl flex flex-col md:flex-row items-center animate-pulse"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <div className="relative w-full md:w-1/2 h-[260px] md:h-[340px] overflow-hidden flex items-center justify-center bg-[#1a1f3a]">
                <div className="w-4/5 h-4/5 bg-gradient-to-r from-[#23284a] via-[#2d3257] to-[#23284a] rounded-xl shimmer" />
              </div>
              <div className="flex-1 p-8 flex flex-col gap-4 justify-center">
                <div className="h-8 w-2/3 bg-gradient-to-r from-[#FFD600]/30 via-[#fff]/10 to-[#FFD600]/30 rounded mb-2 shimmer" />
                <div className="h-5 w-full bg-gradient-to-r from-[#fff]/10 via-[#FFD600]/10 to-[#fff]/10 rounded mb-2 shimmer" />
                <div className="h-5 w-1/2 bg-gradient-to-r from-[#fff]/10 via-[#FFD600]/10 to-[#fff]/10 rounded mb-2 shimmer" />
                <div className="flex gap-2 mb-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 w-16 bg-yellow-400/20 rounded-full shimmer" />
                  ))}
                </div>
                <div className="h-10 w-32 bg-yellow-400/30 rounded-lg shimmer mt-2" />
              </div>
            </motion.div>
            {/* Regular Projects Skeleton Grid */}
            <motion.div
              className="columns-1 md:columns-2 gap-8 [column-fill:_balance]"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13 } } }}
            >
              {[...Array(4)].map((_, idx) => (
                <motion.div
                  key={idx}
                  className="mb-8 break-inside-avoid relative bg-[#0a0f29] border border-white/10 rounded-xl overflow-hidden shadow-lg animate-pulse"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, type: "spring", delay: idx * 0.08 }}
                >
                  <div className="relative overflow-hidden flex items-center justify-center">
                    <div className="w-full h-[220px] bg-gradient-to-r from-[#23284a] via-[#2d3257] to-[#23284a] shimmer" />
                  </div>
                  <div className="p-5 space-y-2 text-left">
                    <div className="h-6 w-1/2 bg-yellow-400/20 rounded shimmer" />
                    <div className="h-4 w-full bg-white/10 rounded shimmer" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          featured && (
            <motion.div
              className="relative bg-[#0a0f29] border-2 border-yellow-400 rounded-2xl overflow-hidden mb-12 shadow-xl group flex flex-col md:flex-row items-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -12, boxShadow: `0 12px 48px 0 ${yellow}55`, borderColor: yellow }}
              transition={{ duration: 0.8, type: "spring" }}
              tabIndex={0}
            >
              <div className="relative w-full md:w-1/2 h-[260px] md:h-[340px] overflow-hidden">
                <motion.img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  initial={{ scale: 0.97, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
                  whileHover={{ scale: 1.08, rotate: 1 }}
                  style={{ willChange: "transform" }}
                />
                {featured.isNew && (
                  <motion.div
                    className="absolute top-4 left-4 bg-yellow-400 text-black font-bold px-4 py-1 rounded-full shadow-lg text-xs animate-pulse"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                  >
                    NEW
                  </motion.div>
                )}
                {featured.featured && (
                  <motion.div
                    className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-200 text-black font-bold px-4 py-1 rounded-full shadow-lg text-xs animate-pulse"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                  >
                    FEATURED
                  </motion.div>
                )}
              </div>
              <div className="flex-1 p-8 flex flex-col gap-4 justify-center">
                <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">{featured.title}</h3>
                <p className="text-white/90 text-lg mb-2">{featured.description}</p>
                {featured.tags && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {featured.tags.map((tag, i) => (
                      <motion.span
                        key={i}
                        className="bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-400/40"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.4, type: "spring" }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                )}
                <motion.a
                  href={featured.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                  whileHover={{ scale: 1.06, boxShadow: `0 0 16px 2px ${yellow}` }}
                  whileTap={{ scale: 0.97 }}
                  tabIndex={0}
                  aria-label={`View project: ${featured.title}`}
                >
                  View Project
                </motion.a>
              </div>
            </motion.div>
          )
        )}

        {/* Masonry/Asymmetric Grid for Regular Projects */}
        {loading ? (
          <p className="text-center text-white/70">Loading projects...</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.13 } },
            }}
          >
            {regularProjects.map((project, idx) => (
              <motion.div
                key={project._id}
                className="mb-6 bg-[#0a0f29] border border-white/10 rounded-xl overflow-hidden group shadow-lg flex flex-col"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, boxShadow: `0 8px 32px 0 ${yellow}33`, borderColor: yellow }}
                transition={{ duration: 0.7, type: "spring", delay: idx * 0.08 }}
                tabIndex={0}
              >
                <div className="relative overflow-hidden">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-40 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + idx * 0.08, duration: 0.7, type: "spring" }}
                    whileHover={{ scale: 1.07, rotate: 1 }}
                    style={{ willChange: "transform" }}
                  />
                  {/* Overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"
                    initial={{ opacity: 1 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {project.tags && (
                      <div className="flex flex-wrap gap-2 mb-2 justify-center">
                        {project.tags.map((tag, i) => (
                          <motion.span
                            key={i}
                            className="bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-400/40"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.08, duration: 0.4, type: "spring" }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    )}
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                      whileHover={{ scale: 1.06, boxShadow: `0 0 16px 2px ${yellow}` }}
                      whileTap={{ scale: 0.97 }}
                      tabIndex={0}
                      aria-label={`View project: ${project.title}`}
                    >
                      View Project
                    </motion.a>
                  </motion.div>
                </div>
                <div className="p-5 space-y-2 text-left">
                  <h5 className="text-lg font-semibold text-yellow-400">{project.title}</h5>
                  <p className="text-sm text-white/80">{project.description}</p>
                </div>
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <motion.button
                      className={`p-1 rounded-full border ${project.featured ? "bg-yellow-400 text-black border-yellow-400" : "bg-black/60 text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black"} relative overflow-hidden flex items-center justify-center`}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleSetFeatured(project._id!)}
                      disabled={featuringId === project._id}
                      title={project.featured ? "Featured Project" : "Set as Featured"}
                      aria-label={project.featured ? "Featured Project" : "Set as Featured"}
                    >
                      {featuringId === project._id ? (
                        <svg
                          className="animate-spin h-4 w-4 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                      ) : (
                        <Star fill={project.featured ? "#FFD600" : "none"} className="w-4 h-4" />
                      )}
                    </motion.button>
                    <motion.button
                      className="bg-red-600 hover:bg-red-700 text-white p-1 rounded relative overflow-hidden"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleDelete(project._id!)}
                    >
                      <span className="relative z-10">
                        <Trash2 className="w-4 h-4" />
                      </span>
                      <motion.span
                        className="absolute inset-0 rounded"
                        initial={{ opacity: 0 }}
                        whileTap={{ opacity: 0.2, scale: 1.2, background: "#dc2626" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                    <motion.button
                      className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded relative overflow-hidden"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        setEditingProject(project);
                        setIsModalOpen(true);
                      }}
                    >
                      <span className="relative z-10">
                        <Pencil className="w-4 h-4" />
                      </span>
                      <motion.span
                        className="absolute inset-0 rounded"
                        initial={{ opacity: 0 }}
                        whileTap={{ opacity: 0.2, scale: 1.2, background: "#2563eb" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Resume Viewer */}
        <motion.div
          className="mt-12 flex justify-center"
          id="resume"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          {resumeUrl ? (
            <div className="mt-12 max-w-4xl mx-auto w-full">
              <motion.h3
                className="text-xl font-semibold text-yellow-400 mb-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
              >
                View My Resume
              </motion.h3>
              <motion.div
                className="border border-white/10 rounded-lg overflow-hidden shadow-lg"
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
              >
                <iframe
                  src={resumeUrl}
                  title="My Resume"
                  className="w-full h-72 sm:h-[60vh] md:h-[80vh] rounded-md"
                  frameBorder="0"
                />
              </motion.div>
              <div className="text-center mt-4">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg shadow transition-all duration-200"
                >
                  Download/View Resume
                </a>
                <p className="text-white/60 text-xs mt-2">
                  If the resume is not viewable above, tap the button to open or download it.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-white/60 italic text-center mt-12">No resume available</p>
          )}
        </motion.div>
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
    </motion.section>
  );
};

export default Projects;
