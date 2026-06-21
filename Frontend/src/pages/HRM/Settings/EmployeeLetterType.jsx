import React, { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function EmployeeLetterType() {
  const [open, setOpen] = useState(false);
  const [letterName, setLetterName] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  const [letters, setLetters] = useState([
    { id: 1, name: "Letter of Recommendation" },
    { id: 2, name: "Relieving Letter" },
    { id: 3, name: "Joining Letter" },
  ]);

  const columns = [
    "Emp Id",
    "Emp Name",
    "Emp Code",
    "Emp Phone Number",
    "Emp Email Id",
    "Emp DOB",
    "Bank Name",
    "Account Number",
    "IFSC Code",
    "State",
    "City",
    "District",
    "Pincode",
    "Address",
    "Job Description",
    "Joining Date",
    "Salary",
    "Salary Term",
    "TDS",
  ];

  const saveData = () => {
    if (editId) {
      setLetters(
        letters.map((item) =>
          item.id === editId ? { ...item, name: letterName } : item,
        ),
      );

      setEditId(null);
    } else {
      setLetters([
        ...letters,
        {
          id: Date.now(),
          name: letterName,
        },
      ]);
    }

    setLetterName("");
    setContent("");
  };

  const editData = (item) => {
    setLetterName(item.name);

    setEditId(item.id);
  };

  const cancelEdit = () => {
    setEditId(null);

    setLetterName("");
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">Employee Letter Type</h2>

      <hr className="border-gray-800" />

      {/* FORM */}

      <div className="space-y-6">
        <div className="flex flex-col">
          <label className="text-gray-300">
            Letter Type Name
            <span className="text-red-500"> *</span>
          </label>

          <input
            value={letterName}
            onChange={(e) => setLetterName(e.target.value)}
            placeholder="Letter Type Name"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-80"
          />
        </div>

        <div>
          <label className="text-gray-300">
            Letter Type Content
            <span className="text-red-500"> *</span>
          </label>

          <button
            onClick={() => setOpen(true)}
            className="ml-4 bg-cyan-500 px-3 hover:bg-cyan-600 py-2 rounded-lg text-white cursor-pointer"
          >
            <Plus size={17} />
          </button>

          <div className="mt-3 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={{
                toolbar: [
                  [{ font: [] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ color: [] }, { background: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ align: [] }],
                  ["link", "image", "video"],
                  ["clean"],
                ],
              }}
              className="custom-editor"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={saveData}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white cursor-pointer"
        >
          {editId ? "Update" : "Save"}
        </button>

        {editId && (
          <button
            onClick={cancelEdit}
            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg text-white cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      {/* TABLE */}

      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3 text-gray-300">Sno.</th>

            <th className="p-3 text-gray-300">Letter Type Name</th>

            <th className="p-3 text-gray-300">Options</th>
          </tr>
        </thead>

        <tbody>
          {letters.map((item, index) => (
            <tr key={item.id} className="border-t border-gray-800 text-center">
              <td className="p-3 text-gray-300">{index + 1}</td>

              <td className="p-3 text-gray-300">{item.name}</td>

              <td className="p-3 flex justify-center gap-2">
                <button
                  onClick={() => editData(item)}
                  className="bg-cyan-500 p-2 hover:bg-cyan-600 cursor-pointer rounded-lg text-white"
                >
                  <Edit size={16} />
                </button>

                <button className="bg-red-500 hover:bg-red-600 p-2 cursor-pointer rounded-lg text-white">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}

      {open && (
        <ColumnModal
          close={() => setOpen(false)}
          columns={columns}
          setContent={setContent}
        />
      )}
    </div>
  );
}

function ColumnModal({ close, columns, setContent }) {
  const [search, setSearch] = useState("");

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[400px] p-5">
        <div className="flex justify-between mb-5">
          <h2 className="text-white text-xl">Select Column Name</h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        <select
          onChange={(e) => {
            setContent((old) => old + " {" + e.target.value + "} ");
            close();
          }}
          className="bg-gray-800 border border-gray-700 mt-3 cursor-pointer rounded-lg px-4 py-3 text-white w-full"
        >
          <option>Select Column Name</option>

          {columns
            .filter((c) => c.toLowerCase().includes(search.toLowerCase()))
            .map((item) => (
              <option key={item}>{item}</option>
            ))}
        </select>
      </div>
    </div>
  );
}
