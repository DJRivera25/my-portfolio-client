"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Pencil } from "lucide-react";
import SocialModal from "./SocialModal";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const yellow = "#FFD600";
const lightBg = "#f7fafc";
const darkBlue = "#0a0f29";

interface Social {
  _id?: string;
  platform: string;
  icon: string;
  url: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Contact: React.FC = () => {
  const [socials, setSocials] = useState<Social[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSocial, setEditSocial] = useState<Social | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [loadingSocials, setLoadingSocials] = useState(true);

  const { isLoggedIn, fetchUnseenCount } = useAuth();

  const fetchSocials = async () => {
    try {
      const res = await axios.get("/api/socials");
      setSocials(res.data);
    } catch (err) {
      console.error("Error fetching socials:", err);
    } finally {
      setLoadingSocials(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post("/api/messages", form);
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
      if (isLoggedIn) {
        await fetchUnseenCount();
      }
    } catch (err: any) {
      if (err.response && err.response.status === 429) {
        toast.error(err.response.data.message || "You are sending messages too quickly. Please wait and try again.");
      } else {
        toast.error("Something went wrong. Try again.");
      }
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this social link?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`/api/socials/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSocials((prev) => prev.filter((s) => s._id !== id));
      toast.success("Social link deleted successfully!");
    } catch (err) {
      toast.error("Delete failed. Please try again.");
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const openModal = (social?: Social) => {
    setEditSocial(social || null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  return (
    <motion.section
      id="contact"
      className="py-20 bg-cover bg-center text-white relative min-h-[70vh] flex items-center justify-center"
      style={{ background: darkBlue }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {/* Glowing border accent */}
      <div className="absolute left-0 right-0 top-0 h-1 pointer-events-none z-10" style={{ filter: "blur(4px)" }}>
        <div className="w-full h-full bg-gradient-to-r from-yellow-400/60 via-yellow-200/40 to-yellow-400/60" />
      </div>
      <div className="container mx-auto max-w-6xl px-4 relative z-10 flex flex-col md:flex-row gap-20 justify-center items-stretch">
        {/* Left Side - Socials & Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
          className="flex-1 flex flex-col justify-between min-w-[320px] max-w-md relative"
        >
          <div>
            <h3 className="text-3xl font-bold mb-4 text-white tracking-wide drop-shadow-lg">Get in touch with Me</h3>
            <p className="mb-6 leading-relaxed text-white/80 text-lg max-w-md drop-shadow">
              If you have a project in mind, a question to ask, or just want to connect, I’d love to hear from you.
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 rounded-full mb-6" />
            <h4 className="text-xl font-semibold mb-3 text-yellow-400 tracking-wider">Follow Me:</h4>
            {isLoggedIn && (
              <motion.button
                onClick={() => openModal()}
                className="mb-4 inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded shadow font-bold relative overflow-hidden"
                whileHover={{ scale: 1.06, boxShadow: `0 0 16px 2px ${yellow}` }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="relative z-10 flex items-center">
                  <Plus size={16} /> Add Social
                </span>
                <motion.span
                  className="absolute inset-0 rounded"
                  initial={{ opacity: 0 }}
                  whileTap={{ opacity: 0.2, scale: 1.2, background: yellow }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            )}
            <motion.div
              className="flex flex-wrap gap-4 mt-3"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.12 } },
              }}
            >
              {loadingSocials && socials.length === 0
                ? [...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-14 h-14 rounded-full bg-white/30 border-2 border-yellow-400/20 shimmer flex items-center justify-center mb-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-yellow-400/20 shimmer" />
                    </div>
                  ))
                : socials.map((social) => (
                    <motion.div
                      key={social._id}
                      className="relative group"
                      variants={itemVariants}
                      whileHover={{ scale: 1.13, boxShadow: `0 0 32px 0 ${yellow}55` }}
                      tabIndex={0}
                      onMouseEnter={() => setHoveredSocial(social._id!)}
                      onMouseLeave={() => setHoveredSocial(null)}
                    >
                      <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform}>
                        <img
                          src={social.icon}
                          alt={social.platform}
                          className="w-14 h-14 rounded-full object-contain group-hover:scale-110 transition-transform border-2 border-yellow-400 shadow-lg bg-black/30"
                        />
                      </a>
                      {/* Animated tooltip/label */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: hoveredSocial === social._id ? 1 : 0,
                          y: hoveredSocial === social._id ? -30 : 10,
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-1/2 -translate-x-1/2 top-0 mt-2 px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded shadow-lg pointer-events-none z-40"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {social.platform}
                      </motion.div>
                      {isLoggedIn && (
                        <div className="absolute -top-2 -right-2 flex gap-1">
                          <motion.button
                            onClick={() => handleDelete(social._id!)}
                            className="text-red-400 hover:text-red-600 p-1 rounded-full border border-white shadow relative overflow-hidden"
                            disabled={deletingId === social._id}
                            whileTap={{ scale: 0.92 }}
                          >
                            {deletingId === social._id ? (
                              <svg
                                className="animate-spin h-4 w-4 text-red-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                              </svg>
                            ) : (
                              <Trash2 size={14} />
                            )}
                            <motion.span
                              className="absolute inset-0 rounded-full"
                              initial={{ opacity: 0 }}
                              whileTap={{ opacity: 0.2, scale: 1.2, background: "#dc2626" }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.button>
                          <motion.button
                            onClick={() => openModal(social)}
                            className="text-blue-400 hover:text-blue-600 p-1 rounded-full border border-white shadow relative overflow-hidden"
                            whileTap={{ scale: 0.92 }}
                          >
                            <Pencil size={14} />
                            <motion.span
                              className="absolute inset-0 rounded-full"
                              initial={{ opacity: 0 }}
                              whileTap={{ opacity: 0.2, scale: 1.2, background: "#2563eb" }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
            </motion.div>
            {/* Divider */}
            <div className="my-8 h-1 w-full bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent rounded-full" />
            {/* Email & Phone */}
            <div className="mt-6 space-y-4 text-white/90 text-lg">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h16v16H4z" stroke="none" />
                  <path d="M4 4l8 8 8-8" />
                </svg>
                <span className="break-all">djrrivera25@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 16.92V20a2 2 0 0 1-2.18 2A19.75 19.75 0 0 1 2 4.18 2 2 0 0 1 4 2h3.09a2 2 0 0 1 2 1.72 12.1 12.1 0 0 0 .57 2.57 2 2 0 0 1-.45 2.11L8 10a16 16 0 0 0 6 6l1.6-1.21a2 2 0 0 1 2.11-.45 12.1 12.1 0 0 0 2.57.57A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>+63 933 851 8806</span>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Right Form - Layered, no card */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-xl mx-auto space-y-6 flex-1 min-w-[320px] relative flex flex-col justify-center"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400/10 blur-2xl rounded-full z-0" />
          <motion.input
            type="text"
            placeholder="Enter Your Name"
            className="w-full border-b-2 bg-transparent text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
            value={form.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
            required
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          />
          <motion.input
            type="email"
            placeholder="Your Email Address"
            className="w-full border-b-2 bg-transparent text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
            value={form.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
            required
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
          <motion.input
            type="text"
            placeholder="Subject"
            className="w-full border-b-2 bg-transparent text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
            value={form.subject}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, subject: e.target.value })}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          <motion.textarea
            placeholder="Write me a message"
            rows={6}
            className="w-full border-b-2 bg-transparent text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
            value={form.message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, message: e.target.value })}
            required
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          ></motion.textarea>
          <motion.button
            type="submit"
            className="border border-yellow-400 px-8 py-3 text-white bg-yellow-400 hover:bg-yellow-300 hover:text-black font-bold rounded-full transition flex items-center justify-center relative overflow-hidden shadow-lg mt-4"
            disabled={sending}
            whileHover={{ scale: 1.04, boxShadow: `0 0 16px 2px ${yellow}` }}
            whileTap={{ scale: 0.97 }}
          >
            {sending ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Submit"
            )}
            <motion.span
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0 }}
              whileTap={{ opacity: 0.2, scale: 1.2, background: yellow }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.form>
      </div>
      {/* Modal */}
      <SocialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          fetchSocials();
          setIsModalOpen(false);
        }}
        initialData={editSocial}
      />
    </motion.section>
  );
};

export default Contact;
