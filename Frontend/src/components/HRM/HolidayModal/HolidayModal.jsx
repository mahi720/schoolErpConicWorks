import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function HolidayModal({ open, close, save, editData }) {
  const [form, setForm] = useState({
    date: "",
    endDate: "",
    title: "",
    type: "",
    dept: "",
  });

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        date: "",
        endDate: "",
        title: "",
        type: "",
        dept: "",
      });
    }
  }, [editData, open]);

  if (!open) return null;

  const inputClass =
    "bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-full cursor-pointer";

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 w-[650px] rounded-xl border border-gray-700">
        <div className="p-5 flex justify-between border-b border-gray-800">
          <h2 className="text-2xl text-white">
            {editData ? "Edit Holiday" : "Add Holiday"}
          </h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        <div className="p-6 space-y-5">
          <label className="text-gray-300">
            Start Date <span className="text-red-500"> *</span>
          </label>

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputClass}
          />

          <label className="text-gray-300">
            End Date <span className="text-red-500"> *</span>
          </label>

          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className={inputClass}
          />

          <label className="text-gray-300">
            Title <span className="text-red-500"> *</span>
          </label>

          <input
            placeholder="Holiday Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
          />

          <label className="text-gray-300">
            Type <span className="text-red-500"> *</span>
          </label>

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={inputClass}
          >
            <option>Select Type</option>
            <option>Department</option>
            <option>Employee</option>
          </select>
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={close}
            className="bg-gray-700 px-5 py-2 rounded-lg text-white hover:bg-gray-800 cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => save(form)}
            className="bg-indigo-600 px-5 py-2 rounded-lg text-white cursor-pointer hover:bg-indigo-700"
          >
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
