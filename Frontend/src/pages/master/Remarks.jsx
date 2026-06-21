import React, { useState } from "react";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";

export default function Remarks() {
  const [showModal, setShowModal] = useState(false);

  const [remarkText, setRemarkText] = useState("");

  const [remarks, setRemarks] = useState([
    {
      id: 1,
      text: "Student performance is excellent",
    },
    {
      id: 2,
      text: "Needs improvement in Mathematics",
    },
  ]);

  const handleSubmit = () => {
    if (!remarkText.trim()) return;

    setRemarks([
      ...remarks,
      {
        id: Date.now(),
        text: remarkText,
      },
    ]);

    setRemarkText("");

    setShowModal(false);
  };

  const handleDelete = (id) => {
    setRemarks(remarks.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Remarks</h1>

          <p className="text-gray-400 mt-1">Manage remarks</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl cursor-pointer"
        >
          <Plus size={18} />
          Add New Remark
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {/* Header */}

        <div className="p-5 flex justify-between items-center flex-wrap border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Remarks</h2>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-4 text-gray-400" />

            <input
              placeholder="Search"
              className="w-[300px] bg-gray-800 border border-gray-700 pl-10 p-3 rounded-xl text-white"
            />
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-800">
              <tr>
                <th className="w-24 p-4 text-left text-gray-300">SN</th>

                <th className="p-4 text-left text-gray-300">Remarks</th>

                <th className="w-40 p-4 text-center text-gray-300">Action</th>
              </tr>
            </thead>

            <tbody>
              {remarks.map((item, index) => (
                <tr key={item.id} className="border-t border-gray-800">
                  <td className="w-24 p-4 text-white">{index + 1}</td>

                  <td className="p-4 text-white">{item.text}</td>

                  <td className="w-40 p-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 rounded-lg bg-blue-500/20 cursor-pointer text-blue-400">
                        <Pencil size={16} />
                      </button>

                      <button className="p-2 rounded-lg bg-red-500/20 cursor-pointer text-red-400">
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

      {/* Modal */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 w-full max-w-lg rounded-xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-white text-xl font-bold">Add Remark</h2>

              <button onClick={() => setShowModal(false)}>
                <X className="text-white cursor-pointer" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-300">Remarks</label>

                <textarea
                  rows={5}
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="Enter remark..."
                  className="w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-700 rounded-xl text-white cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 rounded-xl text-white cursor-pointer"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
