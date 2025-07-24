"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import axios from "axios";

const yellow = "#FFD600";
const darkBlue = "#0a0f29";

export default function InboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your API endpoint
    axios
      .get("/api/messages")
      .then((res) => setMessages(res.data))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      <motion.section
        className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#0a0f29] via-[#1a1f3a] to-[#23284a] px-4 pt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-4xl font-bold text-yellow-400 mb-8 mt-4 drop-shadow-lg"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, type: "spring" as const }}
        >
          Inbox
        </motion.h2>
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
            <div className="text-center py-12">No messages found.</div>
          ) : (
            messages.map((msg, i) => (
              <motion.div
                key={msg._id || i}
                className="bg-white/10 rounded-xl p-6 flex gap-4 items-center shadow-lg hover:scale-[1.02] hover:shadow-2xl transition-transform duration-200 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5, type: "spring" as const }}
                whileHover={{ scale: 1.03, boxShadow: `0 0 32px 0 ${yellow}55` }}
              >
                <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-xl shadow-lg">
                  {msg.name ? msg.name[0].toUpperCase() : "?"}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-yellow-300 text-lg mb-1">{msg.name || "Unknown"}</div>
                  <div className=" text-base mb-1">{msg.message}</div>
                  <div className="text-xs ">{msg.email}</div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.section>
    </ProtectedRoute>
  );
}
