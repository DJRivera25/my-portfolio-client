"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Pencil, Star, Trash2 } from "lucide-react";
import type { Project } from "../../types/portfolio";
import BrowserFrame from "./BrowserFrame";
import PhoneFrame from "./PhoneFrame";

type ProjectCardProps = {
  project: Project;
  flip?: boolean;
  isAdmin?: boolean;
  isFeaturing?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onSetFeatured?: (id: string) => void;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  flip = false,
  isAdmin = false,
  isFeaturing = false,
  onEdit,
  onDelete,
  onSetFeatured,
}) => {
  const reduceMotion = useReducedMotion();
  const isFeatured = !!project.featured;
  const meta = buildMeta(project);

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.5, type: "spring" }}
      className="group relative"
    >
      <motion.div
        whileHover={
          reduceMotion
            ? undefined
            : {
                y: -4,
                boxShadow: "0 20px 48px rgba(0,0,0,0.45), 0 0 28px rgba(0,224,255,0.20)",
                borderColor: "rgba(0,224,255,0.35)",
              }
        }
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`relative rounded-2xl border border-hairline bg-surface-glass p-5 backdrop-blur-glass shadow-glass-lift sm:p-6 md:p-7 ${
          isFeatured ? "md:p-8" : ""
        }`}
      >
        <div
          className={`grid items-center gap-6 md:gap-10 ${
            isFeatured ? "md:grid-cols-[1.25fr_1fr]" : "md:grid-cols-[1.4fr_1fr]"
          } ${flip ? "md:[&>*:first-child]:order-2" : ""}`}
        >
          <div className="relative min-w-0">
            <BrowserFrame
              url={project.link}
              image={project.image}
              alt={`${project.title} desktop screenshot`}
              autoScrollOnHover
            />
            {project.mobileImage && (
              <PhoneFrame
                image={project.mobileImage}
                alt={`${project.title} mobile screenshot`}
                side={flip ? "left" : "right"}
              />
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-3">
            {isFeatured && (
              <span className="inline-block w-fit rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-navy shadow-brand-glow">
                Featured
              </span>
            )}
            {meta && (
              <p className="text-[11px] uppercase tracking-[0.12em] text-white/55">{meta}</p>
            )}
            <h3
              className={`font-bold text-white ${
                isFeatured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
              }`}
            >
              {project.title}
            </h3>
            <p
              className={`text-sm leading-relaxed text-white/70 ${
                isFeatured ? "" : "md:line-clamp-3"
              }`}
            >
              {project.description}
            </p>
            {project.tags && project.tags.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-accent-cyan/30 bg-accent-cyan-soft px-2.5 py-0.5 text-[10px] font-medium text-accent-cyan"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-brand-navy shadow-brand-glow transition hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`View project: ${project.title}`}
            >
              View project →
            </a>
          </div>
        </div>

        {isAdmin && (
          <div className="absolute right-3 top-3 z-20 flex gap-2">
            <button
              type="button"
              className={`rounded-full border p-1.5 transition ${
                isFeatured
                  ? "border-accent bg-accent text-brand-navy"
                  : "border-hairline-strong bg-surface-glass-strong text-accent backdrop-blur-glass hover:border-accent hover:bg-accent hover:text-brand-navy"
              }`}
              onClick={() => onSetFeatured?.(project._id)}
              disabled={isFeaturing}
              aria-label={isFeatured ? "Featured project" : "Set as featured"}
              title={isFeatured ? "Featured" : "Set as featured"}
            >
              {isFeaturing ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Star fill={isFeatured ? "currentColor" : "none"} className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              className="rounded-full border border-hairline-strong bg-blue-500/20 p-1.5 text-blue-300 backdrop-blur-glass transition hover:bg-blue-500 hover:text-white"
              onClick={() => onEdit?.(project)}
              aria-label="Edit project"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-full border border-hairline-strong bg-red-500/20 p-1.5 text-red-300 backdrop-blur-glass transition hover:bg-red-500 hover:text-white"
              onClick={() => onDelete?.(project._id)}
              aria-label="Delete project"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.article>
  );
};

function buildMeta(project: Project): string {
  return [project.year, project.role].filter(Boolean).join(" · ");
}

export default ProjectCard;
