import React, { useState } from "react";
import Modal from "../common/Modal";
import { Pencil, Trash2 } from "lucide-react";

export default function ManageSectionModal({ isOpen, onClose }) {
  const [sectionTitle, setSectionTitle] = useState("");

  const [sections, setSections] = useState([
    { id: 1, title: "A" },
    { id: 2, title: "B" },
    { id: 3, title: "C" },
    { id: 4, title: "D" },
  ]);

  const handleAdd = () => {
    if (!sectionTitle.trim()) return;

    setSections([
      ...sections,
      {
        id: Date.now(),
        title: sectionTitle,
      },
    ]);

    setSectionTitle("");
  };

  const handleDelete = (id) => {
    setSections(sections.filter((item) => item.id !== id));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Sections"
      width="max-w-3xl"
    >
      {/* Create Section */}

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
          placeholder="Enter Stream Title"
          className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-xl p-3"
        />

        <button
          onClick={handleAdd}
          className="px-5 bg-blue-600 rounded-xl cursor-pointer text-white"
        >
          Create Section
        </button>
      </div>

      {/* Table */}

      <div className="rounded-xl border border-gray-800 overflow-hidden">
        {/* Header fixed */}
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-left p-4 text-gray-300 w-20">Sno.</th>

              <th className="text-left p-4 text-gray-300">Section</th>

              <th className="text-center p-4 text-gray-300 w-32">Action</th>
            </tr>
          </thead>
        </table>

        {/* Scroll body */}
        <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
          <table className="w-full">
            <tbody>
              {sections.map((item, index) => (
                <tr key={item.id} className="border-t border-gray-800">
                  <td className="p-4 text-white w-20">{index + 1}</td>

                  <td className="p-4 text-white">{item.title}</td>

                  <td className="p-4 w-32">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 cursor-pointer">
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
