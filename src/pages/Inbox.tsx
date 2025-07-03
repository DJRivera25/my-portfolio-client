import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // ✅ import context

interface Message {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  hasViewed: boolean;
  createdAt: string;
}

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const { fetchUnseenCount } = useAuth(); // ✅ grab function from context

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const markAsSeen = async (id: string) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/api/messages/${id}/viewed`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchUnseenCount(); // ✅ update navbar count after viewing
    } catch (err) {
      console.error("Error marking message as seen:", err);
    }
  };

  const deleteMessage = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this message?");
    if (!confirm) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchMessages();
      fetchUnseenCount(); // ✅ update badge after deletion
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const handleClickMessage = async (msg: Message) => {
    if (!msg.hasViewed) await markAsSeen(msg._id);
    setSelected({ ...msg, hasViewed: true });
    fetchMessages(); // ✅ re-fetch list to visually update
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen container mx-auto px-6 py-10">
      <div className="max-w-5xl mx-auto text-white">
        <h2 className="text-2xl font-bold mb-6">Inbox</h2>
        {messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => handleClickMessage(msg)}
                className="cursor-pointer border rounded p-3 hover:border-yellow-400 flex justify-between items-center group"
              >
                <div>
                  <h4 className="font-semibold">{msg.name}</h4>
                  <p className="text-sm text-white/60">{msg.email}</p>
                  {msg.subject && <p className="text-sm italic text-yellow-300">{msg.subject}</p>}
                </div>

                <div className="flex items-center gap-2">
                  {!msg.hasViewed && (
                    <span title="Unread" className="text-red-500 text-lg font-bold animate-pulse">
                      !
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMessage(msg._id);
                    }}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
            <div className="bg-[#1c1c1c] text-white p-6 rounded-lg max-w-md w-full relative">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2 right-3 text-white text-xl hover:text-red-400"
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-2">{selected.subject || "No Subject"}</h3>
              <p className="mb-2 text-yellow-300 text-sm">
                {selected.name} — {selected.email}
              </p>
              <p className="text-white/90 whitespace-pre-wrap">{selected.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
