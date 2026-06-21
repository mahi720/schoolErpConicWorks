import React, { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function ExamType() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [examTypes, setExamTypes] = useState([
    {
      id: 1,
      type: "Unit Test",
      description: "Monthly unit test exam",
    },
    {
      id: 2,
      type: "Half Yearly",
      description: "Mid term examination",
    },
  ]);

  const handleEdit = (item) => {
    setEditData(item);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setExamTypes(examTypes.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Exam Type</h1>

          <p className="text-gray-400 mt-1">Manage all exam types</p>
        </div>

        <button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl text-white flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          Create Exam Type
        </button>
      </div>

      {/* Table Card */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              {["SN.", "Exam Type", "Description", "Action"].map((h) => (
                <th key={h} className="p-4 text-left text-gray-300">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {examTypes.map((item, index) => (
              <tr
                key={item.id}
                className="border-t border-gray-800 hover:bg-gray-800/40"
              >
                <td className="p-4 text-gray-300">{index + 1}</td>

                <td className="p-4 text-white">{item.type}</td>

                <td className="p-4 text-gray-400">{item.description}</td>

                <td className="p-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg cursor-pointer"
                    >
                      <Edit size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExamTypeModal
        open={open}
        close={() => setOpen(false)}
        editData={editData}
      />
    </div>
  );
}

function ExamTypeModal({ open, close, editData }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-[90%] max-w-xl overflow-hidden">
        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white font-semibold">
            {editData ? "Edit Exam Type" : "Create Exam Type"}
          </h2>

          <X
            onClick={close}
            className="text-gray-400 cursor-pointer hover:text-white"
          />
        </div>

        {/* Body */}

        <div className="p-5 space-y-5">
          <div>
            <label className="text-gray-400">Exam Type</label>

            <input
              defaultValue={editData?.type || ""}
              placeholder="Enter Exam Type"
              className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full outline-none"
            />
          </div>

          <div>
            <label className="text-gray-400">Description</label>

            <textarea
              defaultValue={editData?.description || ""}
              placeholder="Enter Description"
              rows="4"
              className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full resize-none outline-none"
            />
          </div>
        </div>

        {/* Footer */}

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={close}
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-white cursor-pointer"
          >
            Cancel
          </button>

          <button className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg text-white cursor-pointer">
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
