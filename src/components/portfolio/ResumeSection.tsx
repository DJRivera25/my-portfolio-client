"use client";

import React, { useState } from "react";
import { resumeContent } from "../../config/atelier";

const displayUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

const ResumeSection: React.FC = () => {
  const r = resumeContent;
  const [busy, setBusy] = useState(false);
  const [format, setFormat] = useState<"letter" | "a4">("letter");

  // Build the PDF as one continuous, single-column document: capture each block
  // (header, summary, every job/skill/cert/project) and pack them onto pages,
  // breaking only BETWEEN blocks, with real margins on every page and the content
  // flowing to fill each page. No browser print chrome, no mid-line cuts.
  const handleDownload = async () => {
    if (busy) return;
    setBusy(true);
    let clone: HTMLElement | null = null;
    let metricsFix: HTMLStyleElement | null = null;
    try {
      const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);
      const src = document.getElementById("resume-print");
      if (!src) return;

      // html2canvas finds the text baseline by putting a 1x1 probe <img vertical-align:baseline>
      // next to a sample span and reading img.offsetTop - span.offsetTop. Tailwind Preflight's
      // `img { display: block }` drops that probe onto its own line, so the baseline measures as
      // ~line-height instead of the font ascent and every glyph paints ~8pt low — which slices the
      // last line off every block. Keep the probe inline for the duration of the capture.
      metricsFix = document.createElement("style");
      metricsFix.textContent =
        'img[width="1"][height="1"][style*="vertical-align: baseline"]{display:inline!important}';
      document.head.appendChild(metricsFix);

      clone = src.cloneNode(true) as HTMLElement;
      clone.classList.add("resume-pdf-mode");
      Object.assign(clone.style, { position: "fixed", left: "-10000px", top: "0", zIndex: "-1" });
      document.body.appendChild(clone);
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise((resolve) => setTimeout(resolve, 80));

      const pdf = new jsPDF({ unit: "pt", format, orientation: "portrait" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = format === "a4" ? 40 : 42; // ~0.55in
      const contentW = pageW - margin * 2;
      const goldH = 4;
      const gap = 9; // pt between blocks
      const topY = margin + goldH + 10;
      const bottomY = pageH - margin;

      const blocks = Array.from(clone.querySelectorAll<HTMLElement>(".pdf-block"));
      const items: { url: string; h: number; keep: boolean }[] = [];
      for (const block of blocks) {
        const canvas = await html2canvas(block, {
          scale: 2,
          backgroundColor: "#FCFBF7",
          useCORS: true,
          logging: false,
        });
        items.push({
          url: canvas.toDataURL("image/png"),
          h: (canvas.height / canvas.width) * contentW,
          keep: block.classList.contains("pdf-keep"),
        });
      }

      let y = 0;
      let started = false;
      const startPage = () => {
        if (started) pdf.addPage();
        started = true;
        pdf.setFillColor(252, 251, 247);
        pdf.rect(0, 0, pageW, pageH, "F");
        pdf.setFillColor(224, 165, 61);
        pdf.rect(0, 0, pageW, goldH, "F");
        y = topY;
      };
      startPage();

      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        // a little extra breathing room before a section heading
        if (it.keep && y > topY) y += 8;
        // move to a new page if this block won't fit (unless the page is empty)
        if (y + it.h > bottomY && y > topY) startPage();
        // keep a section heading with at least the start of its first block
        if (it.keep && i + 1 < items.length && y > topY) {
          const need = it.h + gap + Math.min(items[i + 1].h, 48);
          if (y + need > bottomY) startPage();
        }
        pdf.addImage(it.url, "PNG", margin, y, contentW, it.h);
        y += it.h + gap;
      }

      pdf.save(`Derem-Joshua-Rivera-Resume-${format.toUpperCase()}.pdf`);
    } catch (err) {
      console.error("Résumé PDF generation failed, falling back to print:", err);
      window.print();
    } finally {
      if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
      if (metricsFix && metricsFix.parentNode) metricsFix.parentNode.removeChild(metricsFix);
      setBusy(false);
    }
  };

  return (
    <section
      id="resume"
      className="relative z-10 border-t border-white/[0.07] px-12 py-24 max-[880px]:px-[22px] max-[880px]:py-16 max-[560px]:px-4 max-[560px]:py-[54px]"
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="resume-screen-header mb-[34px] flex flex-wrap items-end justify-between gap-6 max-[880px]:flex-col max-[880px]:items-start max-[880px]:gap-5">
          <div>
            <div className="mb-[22px] flex items-center gap-3.5">
              <span className="h-px w-11 bg-atelier-gold" />
              <span className="font-codet text-xs tracking-[0.2em] text-atelier-muted">{r.eyebrow}</span>
            </div>
            <h2 className="m-0 font-serifd text-[clamp(34px,4.4vw,58px)] font-normal leading-[1.06] text-atelier-paper">
              {r.headingTop}
              <span className="italic text-atelier-gold">{r.headingAccent}</span>.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-[7px] border border-white/12 bg-white/[0.04] p-0.5">
              {(["letter", "a4"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  aria-pressed={format === f}
                  className={`rounded-[5px] px-3 py-2 font-codet text-[11px] tracking-[0.08em] transition ${
                    format === f ? "bg-atelier-gold text-atelier-ink" : "text-atelier-muted hover:text-atelier-paper"
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleDownload}
              disabled={busy}
              className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-[7px] bg-atelier-gold px-[22px] py-[13px] font-grotesk text-[14px] font-semibold text-atelier-ink transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
            >
              {busy ? "Preparing…" : r.downloadLabel}
            </button>
          </div>
        </div>

        {/* paper document — the on-screen résumé; downloaded as a paginated PDF */}
        <div id="resume-print" className="relative mx-auto max-w-[816px]">
          {/* page 1 */}
          <div className="relative">
            <div
              className="resume-stack-sheet absolute inset-0 z-0 rounded bg-atelier-sheet-stack-2 max-[880px]:hidden"
              style={{ transform: "translate(16px,18px) rotate(1.1deg)" }}
            />
            <div
              className="resume-stack-sheet absolute inset-0 z-0 rounded bg-atelier-sheet-stack-1 max-[880px]:hidden"
              style={{ transform: "translate(8px,9px) rotate(-0.6deg)" }}
            />

            <div className="resume-sheet-frame relative z-[1] min-h-[1056px] overflow-hidden rounded bg-atelier-sheet text-[#1B1A16] shadow-atelier-sheet max-[880px]:min-h-0">
              <div className="h-1.5" style={{ background: "linear-gradient(90deg,#E0A53D,#C9952E 55%,#E0A53D)" }} />
              <div className="resume-pad px-[60px] py-14 max-[880px]:px-6 max-[880px]:py-[30px] max-[560px]:px-4">
                {/* name header */}
                <div className="pdf-block mb-6 flex flex-wrap items-start justify-between gap-7 border-b-2 border-atelier-sheet-ink pb-[26px]">
                  <div>
                    <h3 className="m-0 mb-2 font-serifd text-[clamp(30px,4.2vw,42px)] font-normal leading-none text-atelier-sheet-ink">
                      {r.identity.name}
                    </h3>
                    <div className="font-codet text-[11px] tracking-[0.16em] text-atelier-sheet-gold">
                      {r.identity.title}
                    </div>
                  </div>
                  <div className="resume-contact text-right font-codet text-[11.5px] leading-[1.95] text-[#5C584F] max-[880px]:text-left">
                    {r.identity.contact.map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                    <div className="text-atelier-sheet-gold">{r.identity.site}</div>
                  </div>
                </div>

                {/* summary */}
                <p className="pdf-block m-0 mb-8 text-[14.5px] leading-[1.7] text-atelier-sheet-body">{r.summary}</p>

                <div className="resume-grid grid grid-cols-[1.55fr_1fr] gap-[46px] max-[880px]:grid-cols-1 max-[880px]:gap-[30px]">
                  {/* left: experience + education */}
                  <div>
                    <div className="pdf-block pdf-keep mb-6 border-b border-black/[0.12] pb-3 font-codet text-[11px] tracking-[0.18em] text-atelier-sheet-gold">
                      EXPERIENCE
                    </div>
                    <div className="resume-exp-list relative pl-[22px]">
                      <div className="resume-tl-line absolute bottom-1.5 left-[3px] top-1.5 w-px bg-black/[0.12]" />
                      {r.experience.map((e) => (
                        <div key={`${e.role}-${e.company}`} className="pdf-block relative mb-[26px]">
                          <div
                            className="resume-tl-dot absolute -left-[22px] top-[5px] h-[7px] w-[7px] rounded-full bg-atelier-gold"
                            style={{ boxShadow: "0 0 0 3px #FCFBF7" }}
                          />
                          <div className="flex flex-wrap items-baseline justify-between gap-3.5">
                            <h4 className="m-0 font-grotesk text-[16px] font-semibold text-atelier-sheet-ink">{e.role}</h4>
                            <span className="whitespace-nowrap font-codet text-[10px] text-[#807A6E]">{e.dates}</span>
                          </div>
                          <div className="my-[5px] mb-3 font-codet text-[11px] text-atelier-sheet-gold">{e.company}</div>
                          <div className="flex flex-col gap-2">
                            {e.bullets.map((b) => (
                              <div key={b} className="flex gap-2.5">
                                <span className="shrink-0 text-[12px] leading-[1.55] text-atelier-gold-deep">▸</span>
                                <span className="text-[13px] leading-[1.55] text-[#4A463E]">{b}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pdf-block pdf-keep mb-[22px] mt-[30px] border-b border-black/[0.12] pb-3 font-codet text-[11px] tracking-[0.18em] text-atelier-sheet-gold">
                      EDUCATION
                    </div>
                    {r.education.map((ed) => (
                      <div key={ed.course} className="pdf-block mb-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-3.5">
                          <h4 className="m-0 font-grotesk text-[14.5px] font-semibold text-atelier-sheet-ink">
                            {ed.course}
                          </h4>
                          <span className="whitespace-nowrap font-codet text-[10px] text-[#807A6E]">{ed.dates}</span>
                        </div>
                        <div className="mt-1 text-[12.5px] text-atelier-sheet-muted">{ed.school}</div>
                      </div>
                    ))}
                  </div>

                  {/* right: skills + certs */}
                  <div>
                    <div className="pdf-block pdf-keep mb-[22px] border-b border-black/[0.12] pb-3 font-codet text-[11px] tracking-[0.18em] text-atelier-sheet-gold">
                      CORE COMPETENCIES
                    </div>
                    <div className="mb-8 flex flex-col gap-[18px]">
                      {r.skills.map((sk) => (
                        <div key={sk.label} className="pdf-block">
                          <div className="mb-[9px] text-[11.5px] font-medium text-[#807A6E]">{sk.label}</div>
                          <div className="flex flex-wrap gap-1.5">
                            {sk.tags.map((t) => (
                              <span
                                key={t}
                                className="rounded border border-black/[0.16] bg-white px-[9px] py-1 font-codet text-[10.5px] text-[#4A463E]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pdf-block pdf-keep mb-5 border-b border-black/[0.12] pb-3 font-codet text-[11px] tracking-[0.18em] text-atelier-sheet-gold">
                      CERTIFICATES &amp; ELIGIBILITY
                    </div>
                    <div className="flex flex-col gap-4">
                      {r.certs.map((c) => (
                        <div key={c.name} className="pdf-block flex gap-3">
                          <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full bg-atelier-gold" />
                          <div>
                            <div className="text-[13.5px] font-medium text-atelier-sheet-ink">{c.name}</div>
                            <div className="mt-0.5 text-[12px] text-atelier-sheet-muted">{c.org}</div>
                            <div className="mt-1 font-codet text-[10px] text-atelier-sheet-gold">{c.meta}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* page 2 — freelance & personal projects */}
          <div className="resume-sheet-frame resume-page-2 relative z-[1] mt-9 overflow-hidden rounded bg-atelier-sheet text-[#1B1A16] shadow-atelier-sheet max-[880px]:mt-6">
            <div className="h-1.5" style={{ background: "linear-gradient(90deg,#E0A53D,#C9952E 55%,#E0A53D)" }} />
            <div className="resume-pad px-[60px] py-14 max-[880px]:px-6 max-[880px]:py-[30px] max-[560px]:px-4">
              <div className="pdf-block pdf-keep mb-7 border-b border-black/[0.12] pb-3 font-codet text-[11px] tracking-[0.18em] text-atelier-sheet-gold">
                {r.freelanceHeading}
              </div>
              <div className="resume-freelance-grid grid grid-cols-2 gap-x-[46px] gap-y-7 max-[880px]:grid-cols-1 max-[880px]:gap-y-6">
                {r.freelance.map((f) => (
                  <div key={f.url} className="pdf-block">
                    <div className="flex items-baseline justify-between gap-3">
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-grotesk text-[15px] font-semibold text-atelier-sheet-ink underline-offset-2 hover:text-atelier-sheet-gold hover:underline"
                      >
                        {f.name}
                      </a>
                      <span className="font-codet text-[10px] text-atelier-gold-deep">↗</span>
                    </div>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-2 block break-all font-codet text-[10px] text-atelier-sheet-gold hover:underline"
                    >
                      {displayUrl(f.url)}
                    </a>
                    <p className="m-0 mb-2.5 text-[12.5px] leading-[1.55] text-[#4A463E]">{f.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {f.stack.map((t) => (
                        <span
                          key={t}
                          className="rounded border border-black/[0.16] bg-white px-[9px] py-1 font-codet text-[10.5px] text-[#4A463E]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;
