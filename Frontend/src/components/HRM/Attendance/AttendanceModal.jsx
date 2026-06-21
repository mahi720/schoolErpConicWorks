import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AttendanceModal({ open, close, save, data, edit }) {
  const [form, setForm] = useState({
    inTime: "",
    outTime: "",
    late: "No",
    early: "No",
  });

  useEffect(() => {
    if (data) {
      setForm({
        inTime: data.inTime || "",
        outTime: data.outTime || "",
        late: data.late || "",
        early: data.early || "",
      });
    }
  }, [data]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[450px]">
        <div className="flex justify-between p-5 border-b border-gray-800">
          <h2 className="text-white text-xl">
            {edit ? "Edit Attendance" : "Mark Present"}
          </h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        <div className="p-5 space-y-5">
          <label className="text-gray-300 text-sm font-normal">
            In Time <span className="text-red-500"> *</span>
          </label>
          <input
            type="time"
            value={form.inTime}
            onChange={(e) => setForm({ ...form, inTime: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
          />

          <label className="text-gray-300 text-sm">
            Out Time <span className="text-red-500"> *</span>
          </label>
          <input
            type="time"
            value={form.outTime}
            onChange={(e) => setForm({ ...form, outTime: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
          />

          {edit && (
            <>
              <label className="text-gray-300 text-sm">
                Late <span className="text-red-500"> *</span>
              </label>
              <select
                value={form.late}
                onChange={(e) => setForm({ ...form, late: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
              >
                <option>Select Late</option>
                <option>No</option>
                <option>Yes</option>
              </select>

              <label className="text-gray-300 text-sm">
                Early <span className="text-red-500"> *</span>
              </label>
              <select
                value={form.early}
                onChange={(e) => setForm({ ...form, early: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
              >
                <option>Select Early</option>
                <option>No</option>
                <option>Yes</option>
              </select>
            </>
          )}
        </div>

        <div className="p-5 flex justify-end gap-3 border-t border-gray-800">
          <button
            onClick={() => save(form)}
            className="bg-indigo-600 px-5 py-2 rounded-lg hover:bg-indigo-700 text-white cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
