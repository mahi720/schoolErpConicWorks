import React, { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";

export default function HiringModal({ open, close, editData, save }) {
  const [form, setForm] = useState({
    title: "",
    year: "",
    startDate: "",
    lastDate: "",
    pdf: null,
  });

  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        year: editData.year || "",
        startDate: editData.startDate || "",
        lastDate: editData.lastDate || "",
        pdf: null,
      });
    } else {
      setForm({
        title: "",
        year: "",
        startDate: "",
        lastDate: "",
        pdf: null,
      });
    }
  }, [editData, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleFile = (e) => {
    setForm({
      ...form,
      pdf: e.target.files[0],
    });
  };

  const handleSubmit = () => {
    save(form);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[700px]">
        {/* Header */}

        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl text-white">
            {isEdit ? "Edit Advertisement" : "Create Advertisement"}
          </h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        {/* Body */}

        <div className="p-5 grid grid-cols-2 gap-5">
          <div>
            <label className="text-gray-300">
              Ad Title <span className="text-red-500">*</span>
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ad Title"
              className="mt-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-full outline-none"
            />
          </div>

          <div>
            <label className="text-gray-300">
              Ad Year <span className="text-red-500">*</span>
            </label>

            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="2025-26"
              className="mt-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-full outline-none"
            />
          </div>

          <div>
            <label className="text-gray-300">
              Start Date <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="mt-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-full"
            />
          </div>

          <div>
            <label className="text-gray-300">
              Last Date <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              name="lastDate"
              value={form.lastDate}
              onChange={handleChange}
              className="mt-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-full"
            />
          </div>

          <div className="col-span-2">
            <label className="text-gray-300">
              Upload PDF <span className="text-red-500">*</span>
            </label>

            <label className="mt-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-full cursor-pointer flex items-center gap-3">
              <Upload size={18} />

              {form.pdf ? form.pdf.name : "Choose PDF File"}

              <input
                type="file"
                accept="application/pdf"
                onChange={handleFile}
                hidden
              />
            </label>
          </div>
        </div>

        {/* Footer */}

        <div className="border-t border-gray-800 p-4 flex justify-end gap-3">
          <button
            onClick={close}
            className="bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-lg text-white cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white cursor-pointer"
          >
            {isEdit ? "Update Advertisement" : "Create Advertisement"}
          </button>
        </div>
      </div>
    </div>
  );
}
