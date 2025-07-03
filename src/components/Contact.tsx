import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Pencil } from "lucide-react";
import SocialModal from "./SocialModal";
import { useAuth } from "../context/AuthContext"; // ✅ Import AuthContext

interface Social {
  _id?: string;
  platform: string;
  icon: string;
  url: string;
}

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

  const { isLoggedIn } = useAuth(); // ✅ Use context for admin state

  const fetchSocials = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/socials`);
      setSocials(res.data);
    } catch (err) {
      console.error("Error fetching socials:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/messages`, form);
      alert("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Something went wrong. Try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this social link?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/socials/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // 🔐 Secure backend with token
      });
      setSocials((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
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
    <section
      id="contact"
      className="bg-cover bg-center bg-no-repeat py-20 px-4 text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL2pvYjEzNjItYmctMDdfMS5qcGc.jpg')",
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="w-24 h-1 bg-white mb-10"></div>
        <h2 className="text-4xl font-bold mb-10">Let's work together</h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Side */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Get in touch with Me</h3>
            <p className="mb-6 leading-relaxed">
              If you have a project in mind, a question to ask, or just want to connect, I’d love to hear from you.
            </p>

            <h4 className="text-xl font-medium mb-3">Follow Me:</h4>

            {isLoggedIn && (
              <button
                onClick={() => openModal()}
                className="mb-4 inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded shadow"
              >
                <Plus size={16} />
                Add Social
              </button>
            )}

            <div className="flex flex-wrap gap-3 mt-3">
              {socials.map((social) => (
                <div key={social._id} className="relative group">
                  <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform}>
                    <img
                      src={social.icon}
                      alt={social.platform}
                      className="w-12 h-12 rounded-full object-contain hover:scale-110 transition-transform"
                    />
                  </a>
                  {isLoggedIn && (
                    <div className="absolute -top-2 -right-2 flex gap-1">
                      <button onClick={() => handleDelete(social._id!)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                      <button onClick={() => openModal(social)} className="text-blue-400 hover:text-blue-600">
                        <Pencil size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Email & Phone */}
            <div className="mt-6 space-y-3 text-white">
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

          {/* Right Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl mx-auto space-y-4 backdrop-blur-sm bg-white/10 p-6 rounded-lg border border-white/20"
          >
            <input
              type="text"
              placeholder="Enter Your Name"
              className="w-full border-b-2 bg-transparent text-white placeholder-white"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Your Email Address"
              className="w-full border-b-2 bg-transparent text-white placeholder-white"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full border-b-2 bg-transparent text-white placeholder-white"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <textarea
              placeholder="Write me a message"
              rows={6}
              className="w-full border-b-2 bg-transparent text-white placeholder-white"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            ></textarea>
            <button
              type="submit"
              className="border border-white px-6 py-2 text-white hover:bg-white hover:text-black transition"
            >
              Submit
            </button>
          </form>
        </div>
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
    </section>
  );
};

export default Contact;
