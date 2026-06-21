import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

export default function DeductionType() {
  const [deductions, setDeductions] = useState([
    {
      id: 1,
      deductionType: "PF",
      valueType: "Percent",
      value: 10,
      maxValue: "",
    },
    {
      id: 2,
      deductionType: "ESI",
      valueType: "Fixed",
      value: 10,
      maxValue: 10,
    },
    {
      id: 3,
      deductionType: "Other",
      valueType: "Fixed",
      value: 0,
      maxValue: "",
    },
  ]);

  const [formData, setFormData] = useState({
    deductionType: "",
    valueType: "",
    value: "",
    maxValue: "",
  });

  const [editId, setEditId] = useState(null);

  const handleChangeType = (e) => {
    const type = e.target.value;

    setFormData({
      ...formData,
      valueType: type,
      maxValue: type === "Percent" ? formData.maxValue : "",
    });
  };

  const handleSave = () => {
    if (editId) {
      setDeductions(
        deductions.map((item) =>
          item.id === editId ? { ...item, ...formData } : item,
        ),
      );

      setEditId(null);
    } else {
      setDeductions([
        ...deductions,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
    }

    setFormData({
      deductionType: "",
      valueType: "Fixed",
      value: "",
      maxValue: "",
    });
  };

  const handleEdit = (item) => {
    setEditId(item.id);

    setFormData({
      deductionType: item.deductionType,
      valueType: item.valueType,
      value: item.value,
      maxValue: item.maxValue,
    });
  };

  const handleDelete = (id) => {
    setDeductions(deductions.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">Deduction Type</h2>

      <hr className="border-gray-800" />

      {/* FORM */}

      <div className="grid grid-cols-4 gap-5">
        <div>
          <label className="text-gray-300">
            Deduction Type <span className="text-red-500"> *</span>
          </label>

          <input
            value={formData.deductionType}
            onChange={(e) =>
              setFormData({ ...formData, deductionType: e.target.value })
            }
            placeholder="Deduction Type"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
          />
        </div>

        <div>
          <label className="text-gray-300">
            Value Type <span className="text-red-500"> *</span>
          </label>

          <select
            value={formData.valueType}
            onChange={handleChangeType}
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full cursor-pointer"
          >
            <option>Select Value Type</option>
            <option>Fixed</option>
            <option>Percent</option>
          </select>
        </div>

        <div>
          <label className="text-gray-300">
            Value <span className="text-red-500"> *</span>
          </label>

          <input
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
            placeholder="Value"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
          />
        </div>

        <div>
          <label className="text-gray-300">
            Maximum Value <span className="text-red-500"> *</span>
          </label>

          <input
            disabled={formData.valueType !== "Percent"}
            value={formData.maxValue}
            onChange={(e) =>
              setFormData({ ...formData, maxValue: e.target.value })
            }
            placeholder="Maximum Value"
            className={`mt-2 border rounded-lg px-4 py-3 text-white w-full ${formData.valueType !== "Percent" ? "bg-gray-700 cursor-not-allowed border-gray-700" : "bg-gray-800 border-gray-700"}`}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg w-35 text-white cursor-pointer"
        >
          {editId ? "Update" : "Save"}
        </button>
      </div>

      {/* TABLE */}

      <table className="w-full">
        <thead>
          <tr className="border border-gray-800">
            {[
              "Sno.",
              "Deduction Type",
              "Value Type",
              "Value",
              "Maximum Value",
              "Options",
            ].map((h) => (
              <th className="p-3 text-gray-300">{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {deductions.map((item, index) => (
            <tr key={item.id} className="border border-gray-800 text-center">
              <td className="p-3 text-gray-300">{index + 1}</td>

              <td className="p-3 text-gray-300">{item.deductionType}</td>

              <td className="p-3 text-gray-300">{item.valueType}</td>

              <td className="p-3 text-gray-300">{item.value}</td>

              <td className="p-3 text-gray-300">{item.maxValue}</td>

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
