import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ShiftModal({ open, close, editData }) {
  const [form, setForm] = useState({
    department: "",
    shiftName: "",
    shiftCode: "",
    loginTime: "",
    loginBuffer: "",
    logoutTime: "",
    logoutBuffer: "",
  });

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        department: "",
        shiftName: "",
        shiftCode: "",
        loginTime: "",
        loginBuffer: "",
        logoutTime: "",
        logoutBuffer: "",
      });
    }
  }, [editData, open]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-[90%] max-w-5xl">
        {/* header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">
            {editData ? "Edit Shift" : "Add New Shift"}
          </h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        {/* body */}

        <div className="p-6 grid grid-cols-3 gap-6">
          {!editData && (
            <div>
              <label className="text-gray-400 text-sm">
                Department <span className="text-red-500">*</span>
              </label>

              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full cursor-pointer"
              >
                <option value="">Select Department</option>
                <option>HR</option>
                <option>Teacher</option>
                <option>Account</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm">
              Shift Name <span className="text-red-500">*</span>
            </label>

            <input
              name="shiftName"
              value={form.shiftName}
              onChange={handleChange}
              placeholder="Shift Name"
              className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">
              Shift Code <span className="text-red-500">*</span>
            </label>

            <input
              name="shiftCode"
              value={form.shiftCode}
              onChange={handleChange}
              placeholder="Shift Code"
              className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">
              Login Time <span className="text-red-500">*</span>
            </label>

            <input
              type="time"
              name="loginTime"
              value={form.loginTime}
              onChange={handleChange}
              className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full cursor-pointer"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">
              Login Buffer Time (minutes){" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              name="loginBuffer"
              value={form.loginBuffer}
              onChange={handleChange}
              placeholder="Login Buffer Time"
              className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">
              Logout Time <span className="text-red-500">*</span>
            </label>

            <input
              type="time"
              name="logoutTime"
              value={form.logoutTime}
              onChange={handleChange}
              className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full cursor-pointer"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">
              Logout Buffer Time (minutes){" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              name="logoutBuffer"
              value={form.logoutBuffer}
              onChange={handleChange}
              placeholder="Logout Buffer Time"
              className="mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white w-full"
            />
          </div>
        </div>

        {/* footer */}

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-lg text-white cursor-pointer">
            {editData ? "Update" : "Add"}
          </button>

          <button
            onClick={close}
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
