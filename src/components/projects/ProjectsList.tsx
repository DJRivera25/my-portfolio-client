"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Project } from "../../types/portfolio";
import ProjectCard from "./ProjectCard";

type ProjectsListProps = {
  projects: Project[];
  isAdmin?: boolean;
  featuringId?: string | null;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onSetFeatured?: (id: string) => void;
};

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  isAdmin = false,
  featuringId = null,
  onEdit,
  onDelete,
  onSetFeatured,
}) => {
  const ordered = orderFeaturedFirst(projects);

  return (
    <motion.div
      className="mt-12 flex flex-col gap-8 md:gap-10"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
    >
      {ordered.map((project, idx) => (
        <ProjectCard
          key={project._id}
          project={project}
          flip={!project.featured && idx % 2 === 1}
          isAdmin={isAdmin}
          isFeaturing={featuringId === project._id}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetFeatured={onSetFeatured}
        />
      ))}
    </motion.div>
  );
};

function orderFeaturedFirst(projects: Project[]): Project[] {
  const featured = projects.find((p) => p.featured);
  if (!featured) return projects;
  return [featured, ...projects.filter((p) => p !== featured)];
}

export default ProjectsList;
