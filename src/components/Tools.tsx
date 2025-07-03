import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Pencil } from "lucide-react";
import ToolModal from "./ToolModal"; // ⬅️ Import your modal

interface Tool {
  _id?: string;
  name: string;
  icon: string;
  category: string;
}

const groupByCategory = (tools: Tool[]) => {
  const grouped: Record<string, Tool[]> = {};
  tools.forEach((tool) => {
    if (!grouped[tool.category]) {
      grouped[tool.category] = [];
    }
    grouped[tool.category].push(tool);
  });
  return grouped;
};

const Tools: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);

  const fetchTools = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tools`);
      setTools(res.data);
    } catch (err) {
      console.error("Error fetching tools:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAdmin(!!token);
    fetchTools();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Delete this tool?");
    if (!confirm) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/tools/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTools((prev) => prev.filter((tool) => tool._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const openModal = (tool?: Tool) => {
    setEditTool(tool || null);
    setIsModalOpen(true);
  };

  const groupedTools = groupByCategory(tools);

  return (
    <section id="tools" className="py-16 bg-white text-center">
      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col sm:flex-row ${
            isAdmin ? "justify-between" : "justify-center"
          } items-center gap-4 mb-12`}
        >
          <h2 className="text-4xl font-bold text-[#020b6f]">TOOLS & TECHNOLOGIES</h2>
          {isAdmin && (
            <button
              onClick={() => openModal()}
              className="flex gap-2 items-center bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded shadow transition"
            >
              <Plus className="w-4 h-4" />
              Add Tool
            </button>
          )}
        </div>

        {isLoading ? (
          <p className="text-gray-600">Loading tools...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {Object.entries(groupedTools).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-2xl font-semibold mb-6 text-[#020b6f] capitalize">{category}</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {items.map((tool) => (
                    <div
                      key={tool._id}
                      className="relative w-16 h-16 rounded-full overflow-hidden shadow-md flex items-center justify-center bg-white hover:scale-105 transition-transform duration-300 group"
                    >
                      <img src={tool.icon} alt={tool.name} className="w-10 h-10 object-contain" title={tool.name} />
                      {isAdmin && (
                        <div className="absolute -top-3 -right-3 flex gap-1">
                          <button onClick={() => handleDelete(tool._id!)} className="text-red-600 hover:text-red-800">
                            <Trash2 size={14} />
                          </button>
                          <button onClick={() => openModal(tool)} className="text-blue-600 hover:text-blue-800">
                            <Pencil size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tool Modal */}
      <ToolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          fetchTools();
          setIsModalOpen(false);
        }}
        initialData={editTool}
      />
    </section>
  );
};

export default Tools;
