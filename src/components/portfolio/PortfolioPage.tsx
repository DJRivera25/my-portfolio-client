"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../lib/api/client";
import type { Project, Social } from "../../types/portfolio";
import {
  defaultSocials,
  fallbackCaseStudies,
  sortProjectsForDisplay,
  stackGroups,
  toCaseStudy,
} from "../../config/atelier";
import { useAuth } from "../../context/AuthContext";
import { useCursorGlow } from "../../hooks/useCursorGlow";
import ProjectModal from "../ProjectModal";
import { PortfolioProvider } from "./PortfolioContext";
import SiteNav from "./SiteNav";
import Hero from "./Hero";
import MarqueeBand from "./MarqueeBand";
import SelectedWork from "./SelectedWork";
import AboutSection from "./AboutSection";
import StackSection from "./StackSection";
import HowIShip from "./HowIShip";
import ResumeSection from "./ResumeSection";
import ContactSection from "./ContactSection";
import SiteFooter from "./SiteFooter";
import MobileBottomNav from "./MobileBottomNav";
import CaseStudyDrawer from "./CaseStudyDrawer";
import CommandPalette from "./CommandPalette";

type SocialLink = { platform: string; url: string; icon?: string };

const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function mergeSocials(data: Social[]): SocialLink[] {
  const merged: SocialLink[] = defaultSocials.map((d) => {
    const hit = data.find((s) => s.platform.toLowerCase() === d.platform.toLowerCase());
    return hit ? { platform: d.platform, url: hit.url, icon: hit.icon } : { ...d };
  });
  const extras = data
    .filter((s) => !defaultSocials.some((d) => d.platform.toLowerCase() === s.platform.toLowerCase()))
    .map((s) => ({ platform: s.platform, url: s.url, icon: s.icon }));
  return [...merged, ...extras];
}

const PortfolioPage: React.FC = () => {
  const glowRef = useCursorGlow<HTMLDivElement>();
  const { isLoggedIn: isAdmin } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>(defaultSocials);
  // Stack section is a curated set of the four stacks I build with.
  const groups = stackGroups;

  const [caseIdx, setCaseIdx] = useState<number | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Admin project modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  // Display order is curated, not API order — admin edit/delete index into this same
  // array as `cases`, so both must come from the ordered list to stay aligned.
  const orderedProjects = useMemo(() => sortProjectsForDisplay(projects), [projects]);

  const cases = useMemo(
    () => (orderedProjects.length ? orderedProjects.map(toCaseStudy) : fallbackCaseStudies),
    [orderedProjects]
  );

  const reloadProjects = useCallback(() => {
    api
      .get<Project[]>("/api/projects")
      .then((res) => {
        if (Array.isArray(res.data)) setProjects(res.data);
      })
      .catch(() => {});
  }, []);

  // ---- data ----
  useEffect(() => {
    let alive = true;

    api
      .get<Project[]>("/api/projects")
      .then((res) => {
        if (alive && Array.isArray(res.data)) setProjects(res.data);
      })
      .catch(() => {});

    api
      .get<Social[]>("/api/socials")
      .then((res) => {
        if (alive && res.data?.length) setSocials(mergeSocials(res.data));
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  // ---- admin project handlers ----
  const onAddProject = useCallback(() => {
    setEditing(null);
    setModalOpen(true);
  }, []);
  const onEditProject = useCallback(
    (index: number) => {
      setEditing(orderedProjects[index] ?? null);
      setModalOpen(true);
    },
    [orderedProjects]
  );
  const onDeleteProject = useCallback(
    async (index: number) => {
      const target = orderedProjects[index];
      if (!target) return;
      if (!window.confirm(`Delete "${target.title}"? This cannot be undone.`)) return;
      try {
        await api.delete("/api/projects", { data: { id: target._id } });
        reloadProjects();
      } catch (err) {
        console.error("Failed to delete project:", err);
      }
    },
    [orderedProjects, reloadProjects]
  );

  // ---- shared handlers ----
  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 20, behavior: "smooth" });
    }
    setPaletteOpen(false);
  }, []);

  const openCase = useCallback((index: number) => {
    setCaseIdx(index);
    setPaletteOpen(false);
  }, []);

  // ---- keyboard: ⌘K palette, Esc, case-drawer arrows ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setCaseIdx(null);
        return;
      }
      if (caseIdx !== null && !paletteOpen) {
        if (e.key === "ArrowRight") setCaseIdx((i) => (i === null ? i : (i + 1) % cases.length));
        if (e.key === "ArrowLeft") setCaseIdx((i) => (i === null ? i : (i - 1 + cases.length) % cases.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [caseIdx, paletteOpen, cases.length]);

  // ---- overlay flag + scroll lock ----
  useEffect(() => {
    const overlay = caseIdx !== null || paletteOpen;
    if (overlay) document.body.setAttribute("data-atelier-overlay", "");
    else document.body.removeAttribute("data-atelier-overlay");
    document.body.style.overflow = caseIdx !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-atelier-overlay");
    };
  }, [caseIdx, paletteOpen]);

  const ctx = useMemo(
    () => ({
      cases,
      scrollToId,
      openCase,
      paletteOpen,
      setPaletteOpen,
      isAdmin,
      onAddProject,
      onEditProject,
      onDeleteProject,
    }),
    [cases, scrollToId, openCase, paletteOpen, isAdmin, onAddProject, onEditProject, onDeleteProject]
  );

  return (
    <PortfolioProvider value={ctx}>
      <div
        id="portfolio-root"
        className="relative min-h-screen overflow-hidden bg-atelier-ink font-grotesk text-atelier-paper antialiased"
      >
        {/* cursor glow */}
        <div
          ref={glowRef}
          className="atelier-glow-layer pointer-events-none fixed left-0 top-0 z-[1] h-[620px] w-[620px] -ml-[310px] -mt-[310px] rounded-full transition-opacity duration-300 [will-change:transform]"
          style={{
            background:
              "radial-gradient(circle, rgba(224,165,61,0.16) 0%, rgba(224,165,61,0.06) 30%, transparent 65%)",
          }}
        />
        {/* grain */}
        <div
          className="pointer-events-none fixed inset-0 z-[2] opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: GRAIN_URL }}
        />
        {/* faint grid */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <SiteNav />
        <Hero />
        <MarqueeBand />
        <SelectedWork />
        <AboutSection />
        <StackSection groups={groups} />
        <HowIShip />
        <ResumeSection />
        <ContactSection socials={socials} />
        <SiteFooter />
        <MobileBottomNav />

        {caseIdx !== null && (
          <CaseStudyDrawer
            cases={cases}
            index={caseIdx}
            onClose={() => setCaseIdx(null)}
            onPrev={() => setCaseIdx((i) => (i === null ? i : (i - 1 + cases.length) % cases.length))}
            onNext={() => setCaseIdx((i) => (i === null ? i : (i + 1) % cases.length))}
          />
        )}
        {paletteOpen && <CommandPalette />}

        {isAdmin && modalOpen && (
          <ProjectModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setEditing(null);
            }}
            onSaved={() => {
              reloadProjects();
              setModalOpen(false);
              setEditing(null);
            }}
            initialData={editing}
          />
        )}
      </div>
    </PortfolioProvider>
  );
};

export default PortfolioPage;
