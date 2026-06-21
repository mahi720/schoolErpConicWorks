import React, { useState } from "react";
import { X } from "lucide-react";

export default function EventModal({ open, close, save }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 w-[650px] rounded-xl border border-gray-700">
        <div className="flex justify-between p-5 border-b border-gray-800">
          <h2 className="text-2xl text-white">Create Event/Holiday</h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        <div className="p-6 space-y-5">
          {[
            ["title", "Title", "text"],
            ["description", "Description", "text"],
            ["startDate", "Start Date", "date"],
            ["endDate", "End Date", "date"],
            ["startTime", "Start Time", "time"],
            ["endTime", "End Time", "time"],
          ].map((item) => (
            <div key={item[0]} className="grid grid-cols-3 items-center gap-5">
              <label className="text-gray-300">
                {item[1]} <span className="text-red-500">*</span>
              </label>

              <input
                type={item[2]}
                value={form[item[0]]}
                onChange={(e) =>
                  setForm({ ...form, [item[0]]: e.target.value })
                }
                className="col-span-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={close}
            className="bg-gray-700 px-5 py-2 rounded-lg text-white cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => save(form)}
            className="bg-indigo-600 px-5 py-2 rounded-lg text-white cursor-pointer"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
