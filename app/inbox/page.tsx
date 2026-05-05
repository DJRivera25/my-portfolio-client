"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import api from "../../src/lib/api/client";
import type { Message } from "../../src/types/portfolio";

const yellow = "#FFD600";

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Message[]>("/api/messages")
      .then((res) => setMessages(res.data))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      <motion.section
        className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-brand-navy via-brand-navy-mid to-brand-navy-light px-4 pt-24 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl font-bold text-yellow-400 mb-8 mt-4 drop-shadow-lg"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, type: "spring" }}
        >
          Inbox
        </motion.h1>
        <div className="w-full max-w-2xl flex flex-col gap-6">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-6 flex gap-4 items-center shadow-lg shimmer">
                <div className="w-12 h-12 rounded-full bg-yellow-400/20 shimmer" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-1/2 bg-yellow-400/20 rounded shimmer" />
                  <div className="h-4 w-3/4 bg-white/20 rounded shimmer" />
                </div>
              </div>
            ))
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-white/80">No messages yet.</div>
          ) : (
            messages.map((msg, i) => (
              <motion.article
                key={msg._id || i}
                className="bg-white/10 rounded-xl p-6 flex gap-4 items-start shadow-lg hover:shadow-2xl transition-shadow duration-200 group border border-white/5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.5, type: "spring" }}
                whileHover={{ scale: 1.01, boxShadow: `0 0 32px 0 ${yellow}33` }}
              >
                <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-xl shadow-lg shrink-0">
                  {msg.name ? msg.name[0].toUpperCase() : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-yellow-300 text-lg mb-1">{msg.name || "Unknown"}</div>
                  <p className="text-white/90 text-base mb-2 whitespace-pre-wrap break-words">{msg.content}</p>
                  <div className="text-xs text-white/50">{msg.email}</div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </motion.section>
    </ProtectedRoute>
  );
}
