"use client";

import React, { useEffect, useState } from "react";
import { Plus, Upload } from "lucide-react";
import api from "../lib/api/client";
import ProjectModal from "./ProjectModal";
import ResumeModal from "./ResumeModal";
import ResumeSection from "./projects/ResumeSection";
import ProjectsList from "./projects/ProjectsList";
import { useAuth } from "../context/AuthContext";
import { projectsSectionContent } from "../config/content";
import type { Project, ResumeDoc } from "../types/portfolio";
import AuroraBackdrop from "./ui/AuroraBackdrop";
import GlassCard from "./ui/GlassCard";
import SectionHeader from "./ui/SectionHeader";

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

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
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

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-brand-navy py-section-sm md:py-section text-white"
    >
      <AuroraBackdrop tint="yellow-cyan" />
      <div className="container relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow={projectsSectionContent.eyebrow}
            heading={projectsSectionContent.heading}
            subhead={projectsSectionContent.subhead}
          />
          {isAdmin && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-brand-navy shadow-brand-glow transition hover:bg-accent-hover"
                onClick={() => {
                  setEditingProject(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" /> Add project
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-hairline-strong bg-surface-glass backdrop-blur-glass px-4 py-2 text-sm font-semibold text-white transition hover:border-accent-cyan hover:text-accent-cyan"
                onClick={() => setIsResumeModalOpen(true)}
              >
                <Upload className="h-4 w-4" /> Upload resume
              </button>
            </div>
          )}
        </div>

        {fetchError && (
          <p className="mt-8 text-center text-red-300/90" role="alert">
            {projectsSectionContent.error}
          </p>
        )}

        {loading ? (
          <div className="mt-12 flex flex-col gap-8">
            {[...Array(2)].map((_, idx) => (
              <GlassCard key={idx} className="overflow-hidden p-6">
                <div className="grid items-center gap-6 md:grid-cols-[1.4fr_1fr]">
                  <div className="aspect-[16/10] w-full rounded-xl bg-gradient-to-r from-brand-navy-light via-brand-surface to-brand-navy-light shimmer" />
                  <div className="space-y-2">
                    <div className="h-3 w-1/3 rounded bg-white/10 shimmer" />
                    <div className="h-5 w-2/3 rounded bg-accent/20 shimmer" />
                    <div className="h-3 w-full rounded bg-white/10 shimmer" />
                    <div className="h-3 w-5/6 rounded bg-white/10 shimmer" />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="mt-12 rounded-2xl border border-dashed border-white/15 bg-surface-glass py-16 text-center text-white/70">
            {projectsSectionContent.empty}
          </p>
        ) : (
          <ProjectsList
            projects={projects}
            isAdmin={isAdmin}
            featuringId={featuringId}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSetFeatured={handleSetFeatured}
          />
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
    </section>
  );
};

export default Projects;
