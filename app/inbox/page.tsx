"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import api from "../../src/lib/api/client";
import { inboxContent } from "../../src/config/worklog";
import type { Message } from "../../src/types/portfolio";

function relative(iso?: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 0)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days < 30 ? `${days}d ago` : new Date(iso).toLocaleDateString();
}

function InboxView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Message[]>("/api/messages")
      .then((res) => setMessages(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError(inboxContent.error))
      .finally(() => setLoading(false));
  }, []);

  const unread = messages.filter((m) => !m.hasViewed).length;

  return (
    <main className="min-h-screen px-6 pb-20 pt-14 max-[560px]:px-4">
      <div className="mx-auto max-w-[820px]">
        <header className="mb-10 pt-10">
          <div className="mb-5 flex items-center gap-3.5">
            <span className="h-px w-11 bg-atelier-gold" />
            <span className="font-codet text-xs tracking-[0.2em] text-atelier-muted">
              {inboxContent.eyebrow}
            </span>
          </div>
          <h1 className="m-0 font-serifd text-[clamp(34px,4.4vw,54px)] font-normal leading-[1.06] text-atelier-paper">
            {inboxContent.heading}
            <span className="italic text-atelier-gold">{inboxContent.headingAccent}</span>.
          </h1>
          <p className="m-0 mt-4 max-w-[520px] text-[15px] leading-[1.6] text-[#9D988E]">
            {inboxContent.subhead}
            {unread > 0 && (
              <span className="ml-1.5 text-atelier-gold">
                {unread} unread.
              </span>
            )}
          </p>
        </header>

        {error && (
          <p
            className="mb-6 rounded-lg border px-4 py-3 text-[13px]"
            style={{ borderColor: "rgba(224,122,95,0.4)", color: "#E07A5F" }}
            role="alert"
          >
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex flex-col gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="at-card h-24 shimmer" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="at-card px-6 py-12 text-center">
            <p className="m-0 text-[15px] text-atelier-paper">{inboxContent.empty}</p>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-atelier-faint">
              {inboxContent.emptyBody}
            </p>
          </div>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {messages.map((msg, i) => (
              <li key={msg._id || i} className="at-card p-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[15px] font-medium text-atelier-paper">
                    {msg.name || "Unknown"}
                  </span>
                  {!msg.hasViewed && (
                    <span className="rounded-full bg-atelier-gold/[0.16] px-2 py-0.5 font-codet text-[10px] tracking-[0.06em] text-atelier-gold">
                      {inboxContent.unreadLabel.toUpperCase()}
                    </span>
                  )}
                  <span className="font-codet text-[11px] text-atelier-faint">
                    {relative(msg.createdAt)}
                  </span>
                </div>

                <p className="m-0 mt-2.5 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-[#9D988E]">
                  {msg.content}
                </p>

                {msg.email && (
                  <a
                    href={`mailto:${msg.email}`}
                    className="mt-3 inline-block font-codet text-[11px] text-atelier-faint transition-colors hover:text-atelier-gold"
                  >
                    {msg.email}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default function InboxPage() {
  return (
    <ProtectedRoute>
      <InboxView />
    </ProtectedRoute>
  );
}
