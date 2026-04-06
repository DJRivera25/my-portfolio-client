"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Upload, Star } from "lucide-react";
import api from "../lib/api/client";
import ProjectModal from "./ProjectModal";
import ResumeModal from "./ResumeModal";
import ResumeSection from "./projects/ResumeSection";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { projectsSectionContent } from "../config/content";
import type { Project, ResumeDoc } from "../types/portfolio";

const yellow = "#FFD600";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const { isLoggedIn: isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [featuringId, setFeaturingId] = useState<string | null>(null);

  const fetchResume = async () => {
    try {
      const res = await api.get<ResumeDoc[]>("/api/resumes");
      const first = res.data[0];
      setResumeUrl(first?.url || (first as { fileUrl?: string })?.fileUrl || "");
    } catch {
      setResumeUrl("");
    }
  };

  const fetchProjects = async () => {
    setFetchError(false);
    try {
      const res = await api.get<Project[]>("/api/projects");
      setProjects(res.data);
    } catch (e) {
      console.error("Failed to fetch projects:", e);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchResume();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const ok = window.confirm("Are you sure you want to delete this project?");
      if (!ok) return;

      await api.delete("/api/projects", { data: { id } });
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
      await api.patch(`/api/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error("Failed to set featured project:", error);
    } finally {
      setFeaturingId(null);
    }
  };

  const featured = projects.find((p) => p.featured);
  const regularProjects = featured ? projects.filter((p) => p !== featured) : projects;

  return (
    <motion.section
      id="projects"
      className="py-section-sm md:py-section bg-cover bg-center text-white relative px-4 sm:px-8 lg:px-20 mx-auto"
      style={{
        backgroundImage:
          "linear-gradient(rgba(10, 15, 41, 0.97), rgba(10, 15, 41, 0.97)), radial-gradient(ellipse at 20% 0%, rgba(255, 214, 0, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(255, 214, 0, 0.06) 0%, transparent 45%)",
        backgroundColor: "#0a0f29",
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      <div className="absolute left-0 right-0 top-0 h-1 pointer-events-none z-10" style={{ filter: "blur(4px)" }}>
        <div className="w-full h-full bg-gradient-to-r from-yellow-400/60 via-yellow-200/40 to-yellow-400/60" />
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" className="h-full w-full" aria-hidden>
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

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <motion.div
          className={`flex flex-col sm:flex-row ${isAdmin ? "justify-between" : "justify-center"} items-center gap-4 mb-12 text-center sm:text-left`}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <div className="relative max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold uppercase text-white tracking-tight">
              {projectsSectionContent.heading}
            </h2>
            <p className="mt-3 text-white/70 text-sm md:text-base">{projectsSectionContent.subhead}</p>
            <motion.div
              className="sm:absolute left-1/2 sm:-translate-x-1/2 sm:left-0 sm:translate-x-0 bottom-[-14px] w-32 h-2 rounded-full mx-auto sm:mx-0 mt-4 sm:mt-0"
              style={{ background: `linear-gradient(90deg, #FFD600 60%, #fff 100%)`, filter: "blur(2px)" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
            />
          </div>
          {isAdmin && (
            <div className="flex flex-wrap gap-3 justify-center">
              <motion.button
                type="button"
                className="flex gap-2 items-center bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg shadow transition font-bold relative overflow-hidden"
                whileHover={{ scale: 1.06, boxShadow: `0 0 16px 2px ${yellow}` }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setEditingProject(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4" /> Add project
              </motion.button>
              <motion.button
                type="button"
                className="flex gap-2 items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition font-bold"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsResumeModalOpen(true)}
              >
                <Upload className="w-4 h-4" /> Upload resume
              </motion.button>
            </div>
          )}
        </motion.div>

        {fetchError && (
          <p className="text-center text-red-300/90 mb-8" role="alert">
            {projectsSectionContent.error}
          </p>
        )}

        {loading ? (
          <>
            <motion.div
              className="relative bg-brand-navy border-2 border-yellow-400/30 rounded-2xl overflow-hidden mb-12 shadow-xl flex flex-col md:flex-row items-center animate-pulse"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative w-full md:w-1/2 h-[260px] md:h-[340px] overflow-hidden flex items-center justify-center bg-brand-navy-mid">
                <div className="w-4/5 h-4/5 bg-gradient-to-r from-brand-navy-light via-brand-surface to-brand-navy-light rounded-xl shimmer" />
              </div>
              <div className="flex-1 p-8 flex flex-col gap-4 justify-center w-full">
                <div className="h-8 w-2/3 bg-gradient-to-r from-accent/30 via-white/10 to-accent/30 rounded mb-2 shimmer" />
                <div className="h-5 w-full bg-gradient-to-r from-white/10 via-accent/10 to-white/10 rounded mb-2 shimmer" />
                <div className="h-5 w-1/2 bg-gradient-to-r from-white/10 via-accent/10 to-white/10 rounded mb-2 shimmer" />
                <div className="h-10 w-32 bg-yellow-400/30 rounded-lg mt-2 shimmer" />
              </div>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="mb-6 break-inside-avoid relative bg-brand-navy border border-white/10 rounded-xl overflow-hidden shadow-lg animate-pulse"
                >
                  <div className="relative overflow-hidden flex items-center justify-center">
                    <div className="w-full h-[220px] bg-gradient-to-r from-brand-navy-light via-brand-surface to-brand-navy-light shimmer" />
                  </div>
                  <div className="p-5 space-y-2 text-left">
                    <div className="h-6 w-1/2 bg-yellow-400/20 rounded shimmer" />
                    <div className="h-4 w-full bg-white/10 rounded shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : projects.length === 0 ? (
          <p className="text-center text-white/70 py-16 border border-dashed border-white/15 rounded-2xl bg-black/20">
            {projectsSectionContent.empty}
          </p>
        ) : (
          <>
            {featured && (
              <motion.article
                className="relative bg-brand-navy border-2 border-yellow-400 rounded-2xl overflow-hidden mb-12 shadow-xl group flex flex-col md:flex-row items-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, boxShadow: `0 12px 48px 0 ${yellow}55`, borderColor: yellow }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <div className="relative w-full md:w-1/2 h-[260px] md:h-[340px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {featured.featured && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-200 text-black font-bold px-4 py-1 rounded-full shadow-lg text-xs">
                      Featured
                    </div>
                  )}
                </div>
                <div className="flex-1 p-8 flex flex-col gap-4 justify-center text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">{featured.title}</h3>
                  <p className="text-white/90 text-lg mb-2">{featured.description}</p>
                  <a
                    href={featured.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 w-fit"
                  >
                    View project
                  </a>
                </div>
              </motion.article>
            )}

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
                  className="relative mb-6 bg-brand-navy border border-white/10 rounded-xl overflow-hidden group shadow-lg flex flex-col"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, boxShadow: `0 8px 32px 0 ${yellow}33`, borderColor: yellow }}
                  transition={{ duration: 0.7, type: "spring", delay: idx * 0.06 }}
                >
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-40 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                        aria-label={`View project: ${project.title}`}
                      >
                        View project
                      </a>
                    </div>
                  </div>
                  <div className="p-5 space-y-2 text-left">
                    <h5 className="text-lg font-semibold text-yellow-400">{project.title}</h5>
                    <p className="text-sm text-white/80 max-h-[5.5rem] overflow-hidden">{project.description}</p>
                  </div>
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-2 z-20">
                      <motion.button
                        type="button"
                        className={`p-1 rounded-full border ${project.featured ? "bg-yellow-400 text-black border-yellow-400" : "bg-black/60 text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black"} flex items-center justify-center`}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleSetFeatured(project._id)}
                        disabled={featuringId === project._id}
                        title={project.featured ? "Featured" : "Set as featured"}
                        aria-label={project.featured ? "Featured project" : "Set as featured"}
                      >
                        {featuringId === project._id ? (
                          <span className="inline-block h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Star fill={project.featured ? "#FFD600" : "none"} className="w-4 h-4" />
                        )}
                      </motion.button>
                      <motion.button
                        type="button"
                        className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleDelete(project._id)}
                        aria-label="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                        whileTap={{ scale: 0.92 }}
                        onClick={() => {
                          setEditingProject(project);
                          setIsModalOpen(true);
                        }}
                        aria-label="Edit project"
                      >
                        <Pencil className="w-4 h-4" />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        <ResumeSection resumeUrl={resumeUrl || null} />
      </div>

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
