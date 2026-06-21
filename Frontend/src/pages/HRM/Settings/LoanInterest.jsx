import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

export default function LoanInterest() {
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    duration: "",
    interest: "",
    foreclose: "",
  });

  const [data, setData] = useState([
    {
      id: 1,
      duration: "12",
      interest: "10",
    },
    {
      id: 2,
      duration: "24",
      interest: "12",
    },
  ]);

  const handleSave = () => {
    if (editId) {
      setData(
        data.map((item) =>
          item.id === editId
            ? {
                ...item,
                duration: form.duration,
                interest: form.interest,
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
          duration: form.duration,
          interest: form.interest,
        },
      ]);
    }

    setForm({
      duration: "",
      interest: "",
      foreclose: "",
    });
  };

  const handleEdit = (item) => {
    setEditId(item.id);

    setForm({
      duration: item.duration,
      interest: item.interest,
      foreclose: "",
    });
  };

  const handleCancel = () => {
    setEditId(null);

    setForm({
      duration: "",
      interest: "",
      foreclose: "",
    });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">Loan Interest</h2>

      <hr className="border-gray-800" />

      {/* FORM */}

      {/* First Row */}
      <div className="grid grid-cols-3 gap-6 items-end">
        <div>
          <label className="text-gray-300 font-normal text-sm">
            Duration (in month)
            <span className="text-red-500">*</span>
          </label>

          <select
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full cursor-pointer"
          >
            <option value="">Select Duration</option>
            <option value="6">6 Month</option>
            <option value="12">12 Month</option>
            <option value="24">24 Month</option>
          </select>
        </div>

        <div>
          <label className="text-gray-300 text-sm font-normal">
            Loan Interest (annually)
            <span className="text-red-500"> *</span>
          </label>

          <input
            value={form.interest}
            onChange={(e) => setForm({ ...form, interest: e.target.value })}
            placeholder="Loan Interest"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
          />
        </div>

        <div className="flex justify-end gap-3">
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
      </div>

      {/* Second Row */}
      <div className="flex justify-end gap-8 items-end mt-6">
        <div className="w-70">
          <label className="text-gray-300 text-sm font-normal">
            Foreclose Interest
            <span className="text-red-500"> *</span>
          </label>

          <input
            value={form.foreclose}
            onChange={(e) => setForm({ ...form, foreclose: e.target.value })}
            placeholder="Foreclose Interest"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
          />
        </div>

        <button
          // onClick={handleForecloseSave}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white cursor-pointer"
        >
          Save
        </button>
      </div>

      {/* TABLE */}

      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3 text-gray-300">S no.</th>

            <th className="p-3 text-gray-300">Duration (in month)</th>

            <th className="p-3 text-gray-300">Loan Interest (annually)</th>

            <th className="p-3 text-gray-300">Options</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className="border-b border-gray-800 text-center">
              <td className="p-3 text-gray-300">{index + 1}</td>

              <td className="p-3 text-gray-300">{item.duration}</td>

              <td className="p-3 text-gray-300">{item.interest}</td>

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
