import React, { useState } from "react";
import Modal from "../common/Modal";
import { Pencil, Trash2 } from "lucide-react";

export default function ManageStreamModal({ isOpen, onClose }) {
  const [streamTitle, setStreamTitle] = useState("");

  const [streams, setStreams] = useState([
    { id: 1, title: "Science" },
    { id: 2, title: "Commerce" },
    { id: 3, title: "Arts" },
  ]);

  const handleAdd = () => {
    if (!streamTitle.trim()) return;

    setStreams([
      ...streams,
      {
        id: Date.now(),
        title: streamTitle,
      },
    ]);

    setStreamTitle("");
  };

  const handleDelete = (id) => {
    setStreams(streams.filter((item) => item.id !== id));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Streams"
      width="max-w-3xl"
    >
      {/* Create Stream */}

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={streamTitle}
          onChange={(e) => setStreamTitle(e.target.value)}
          placeholder="Enter Stream Title"
          className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-xl p-3"
        />

        <button
          onClick={handleAdd}
          className="px-5 bg-blue-600 rounded-xl cursor-pointer text-white"
        >
          Create Stream
        </button>
      </div>

      {/* Table */}

      {/* Table */}

      <div className="rounded-xl border border-gray-800 overflow-hidden">
        {/* Fixed Header */}
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-left p-4 text-gray-300 w-20">Sno.</th>

              <th className="text-left p-4 text-gray-300">Stream</th>

              <th className="text-center p-4 text-gray-300 w-32">Action</th>
            </tr>
          </thead>
        </table>

        {/* Scrollable Body */}
        <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
          <table className="w-full">
            <tbody>
              {streams.map((item, index) => (
                <tr key={item.id} className="border-t border-gray-800">
                  <td className="p-4 text-white w-20">{index + 1}</td>

                  <td className="p-4 text-white">{item.title}</td>

                  <td className="p-4 w-32">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 rounded-lg bg-blue-500/20 cursor-pointer text-blue-400">
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg bg-red-500/20 cursor-pointer text-red-400"
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
