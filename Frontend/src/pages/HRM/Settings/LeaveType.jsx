import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

export default function LeaveType() {
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    leaveType: "",
    days: "",
    uptoYear: "",
    afterYear: "",
    carry: "",
    value: "",
  });

  const [data, setData] = useState([
    {
      id: 1,
      leaveType: "CL",
      days: 8,
      uptoYear: 0,
      afterYear: 8,
      carry: "No",
      max: 8,
      value: 1,
    },
    {
      id: 2,
      leaveType: "EL",
      days: 10,
      uptoYear: 0,
      afterYear: 10,
      carry: "Yes",
      max: 10,
      value: 1,
    },
  ]);

  const handleSave = () => {
    if (editId) {
      setData(
        data.map((item) =>
          item.id === editId
            ? {
                ...item,
                leaveType: form.leaveType,
                days: form.days,
                uptoYear: form.uptoYear,
                afterYear: form.afterYear,
                carry: form.carry,
                value: form.value,
              }
            : item,
        ),
      );

      setEditId(null);
    } else {
      setData([
        ...data,
        {
          id: Date.now(),
          ...form,
          max: form.afterYear,
        },
      ]);
    }

    setForm({
      leaveType: "",
      days: "",
      uptoYear: "",
      afterYear: "",
      carry: "",
      value: "",
    });
  };

  const handleEdit = (item) => {
    setEditId(item.id);

    setForm({
      leaveType: item.leaveType,
      days: item.days,
      uptoYear: item.uptoYear,
      afterYear: item.afterYear,
      carry: item.carry,
      value: item.value,
    });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">Leave Type</h2>

      <hr className="border-gray-800" />

      {/* FORM */}

      <div className="grid grid-cols-4 gap-5">
        <div>
          <label className="text-gray-300">
            Leave Type <span className="text-red-500">*</span>
          </label>
          <input
            value={form.leaveType}
            onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
            placeholder="Leave Type"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
          />
        </div>

        <div>
          <label className="text-gray-300">
            Days/Year <span className="text-red-500">*</span>
          </label>
          <input
            value={form.days}
            onChange={(e) => setForm({ ...form, days: e.target.value })}
            placeholder="Days/Year"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
          />
        </div>

        <div>
          <label className="text-gray-300">
            Upto Year <span className="text-red-500">*</span>
          </label>
          <input
            value={form.uptoYear}
            onChange={(e) => setForm({ ...form, uptoYear: e.target.value })}
            placeholder="Upto Year"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
          />
        </div>

        <div>
          <label className="text-gray-300">
            Days/Year (After Year) <span className="text-red-500">*</span>
          </label>
          <input
            value={form.afterYear}
            onChange={(e) => setForm({ ...form, afterYear: e.target.value })}
            placeholder="Days/Year (After Year)"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
          />
        </div>

        <div>
          <label className="text-gray-300">
            Carry Forward <span className="text-red-500">*</span>
          </label>

          <select
            value={form.carry}
            onChange={(e) => setForm({ ...form, carry: e.target.value })}
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full cursor-pointer"
          >
            <option>Select</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        <div>
          <label className="text-gray-300">
            Value <span className="text-red-500"> *</span>
          </label>

          <input
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            placeholder="Value"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
          />
        </div>

        <div className="flex items-end gap-3">
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white cursor-pointer"
          >
            {editId ? "Update" : "Save"}
          </button>

          {editId && (
            <button
              onClick={() => setEditId(null)}
              className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg text-white cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}

      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            {[
              "Sno.",
              "Leave Type",
              "Days/Year",
              "Upto Year",
              "Days/Year (After Year)",
              "Carry Forward",
              "Maximum Value",
              "Value",
              "Options",
            ].map((h) => (
              <th className="p-3 text-gray-300">{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className="border-b border-gray-800 text-center">
              <td className="p-3 text-gray-300">{index + 1}</td>

              <td className="p-3 text-gray-300">{item.leaveType}</td>

              <td className="p-3 text-gray-300">{item.days}</td>

              <td className="p-3 text-gray-300">{item.uptoYear}</td>

              <td className="p-3 text-gray-300">{item.afterYear}</td>

              <td className="p-3 text-gray-300">{item.carry}</td>

              <td className="p-3 text-gray-300">{item.max}</td>

              <td className="p-3 text-gray-300">{item.value}</td>

              <td className="p-3 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-cyan-500 hover:bg-cyan-600 p-2 rounded-lg text-white cursor-pointer"
                >
                  <Edit size={16} />
                </button>

                <button className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white cursor-pointer">
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
