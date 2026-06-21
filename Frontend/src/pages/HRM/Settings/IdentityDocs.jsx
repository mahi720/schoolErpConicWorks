import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

export default function IdentityDocs() {
  const [docs, setDocs] = useState([
    { id: 1, name: "Aadhar Card" },
    { id: 2, name: "License" },
    { id: 3, name: "PAN Card" },
    { id: 4, name: "Bank Passbook" },
    { id: 5, name: "Test Doc" },
  ]);

  const [docName, setDocName] = useState("");
  const [editId, setEditId] = useState(null);

  const handleSave = () => {
    if (!docName) return;

    if (editId) {
      setDocs(
        docs.map((item) =>
          item.id === editId ? { ...item, name: docName } : item,
        ),
      );

      setEditId(null);
    } else {
      setDocs([
        ...docs,
        {
          id: Date.now(),
          name: docName,
        },
      ]);
    }

    setDocName("");
  };

  const handleEdit = (item) => {
    setDocName(item.name);
    setEditId(item.id);
  };

  const handleCancel = () => {
    setDocName("");
    setEditId(null);
  };

  const handleDelete = (id) => {
    setDocs(docs.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">
        Identity Document Type
      </h2>

      <hr className="border-gray-800" />

      {/* Form */}

      <div className="flex items-end gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-gray-300">
            Document Name <span className="text-red-500">*</span>
          </label>

          <input
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            placeholder="Document Name"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-80 outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white cursor-pointer"
        >
          {editId ? "Update" : "Save"}
        </button>

        {editId && (
          <button
            onClick={handleCancel}
            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg text-white cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Table */}

      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3 text-gray-300">S no.</th>

            <th className="p-3 text-gray-300">Document Name</th>

            <th className="p-3 text-gray-300">Options</th>
          </tr>
        </thead>

        <tbody>
          {docs.map((item, index) => (
            <tr
              key={item.id}
              className="border-t border-gray-800 text-center hover:bg-gray-800/50"
            >
              <td className="p-3 text-gray-300">{index + 1}</td>

              <td className="p-3 text-gray-300">{item.name}</td>

              <td className="p-3 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-cyan-500 hover:bg-cyan-600 p-2 rounded-lg text-white cursor-pointer"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
