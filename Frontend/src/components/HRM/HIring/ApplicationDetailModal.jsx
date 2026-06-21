import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ApplicationDetailModal({ open, close, editData }) {
  const [form, setForm] = useState({
    name: "",
    board: "",
    post: "",
    subject: "",
    batch: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        board: editData.board || "",
        post: editData.post || "",
        subject: editData.subject || "",
        batch: editData.batch || "",
      });
    }
  }, [editData]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    console.log(form);

    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[90%] max-w-6xl">
        {/* header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white font-semibold">
            Application Detail
          </h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        {/* body */}

        <div className="p-8 grid grid-cols-2 gap-8 min-h-[380px]">
          {/* left form */}

          <div className="space-y-5">
            <div className="grid grid-cols-[120px_1fr] items-center">
              <label className="text-gray-400">Name</label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="name"
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center">
              <label className="text-gray-400">Board</label>

              <input
                name="board"
                value={form.board}
                onChange={handleChange}
                placeholder="board"
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center">
              <label className="text-gray-400">Post</label>

              <input
                name="post"
                value={form.post}
                onChange={handleChange}
                placeholder="post"
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center">
              <label className="text-gray-400">Subject</label>

              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="subject"
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center">
              <label className="text-gray-400">Batch</label>

              <select
                name="batch"
                value={form.batch}
                onChange={handleChange}
                className="bg-gray-800 border cursor-pointer border-gray-700 rounded-lg px-4 py-3 text-white"
              >
                <option value="">Select Batch</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            </div>

            <button
              onClick={handleUpdate}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white cursor-pointer"
            >
              Update
            </button>
          </div>

          {/* right table */}

          <div>
            <table className="w-full border border-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  {["#", "Grade", "Year", "Document"].map((h) => (
                    <th key={h} className="p-3 text-gray-300 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr className="border-t border-gray-800">
                  <td className="p-3 text-gray-300">#</td>

                  <td className="p-3 text-gray-300">School/Institution</td>

                  <td className="p-3 text-gray-300">Board</td>

                  <td className="p-3 text-gray-300">Document</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* footer */}

        <div className="border-t border-gray-800 p-5 flex justify-end">
          <button
            onClick={close}
            className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-lg text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
