"use client";

import React, { createContext, useContext } from "react";
import type { CaseStudy } from "../../types/portfolio";

export type PortfolioContextValue = {
  /** Mapped case studies (DB-backed, or design fallbacks). */
  cases: CaseStudy[];
  /** Smooth-scroll to a section by element id. */
  scrollToId: (id: string) => void;
  /** Open the case-study drawer at the given index. */
  openCase: (index: number) => void;
  /** Command-palette visibility. */
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  /** Admin (logged-in) project management — present only for authenticated admins. */
  isAdmin?: boolean;
  onAddProject?: () => void;
  onEditProject?: (index: number) => void;
  onDeleteProject?: (index: number) => void;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export const PortfolioProvider: React.FC<{
  value: PortfolioContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within a PortfolioProvider");
  return ctx;
}
