import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

export default function EarningType() {
  const [earningData, setEarningData] = useState([
    { id: 1, earningType: "HRA", valueType: "Percent", value: 50 },
    { id: 2, earningType: "TA", valueType: "Percent", value: 5 },
    { id: 3, earningType: "DA", valueType: "Percent", value: 15 },
    { id: 4, earningType: "Other", valueType: "Fixed", value: 0 },
  ]);

  const [formData, setFormData] = useState({
    earningType: "",
    valueType: "Fixed",
    value: "",
  });

  const [editId, setEditId] = useState(null);

  const handleSave = () => {
    if (editId) {
      setEarningData(
        earningData.map((item) =>
          item.id === editId ? { ...item, ...formData } : item,
        ),
      );

      setEditId(null);
    } else {
      setEarningData([
        ...earningData,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
    }

    setFormData({
      earningType: "",
      valueType: "Fixed",
      value: "",
    });
  };

  const handleEdit = (item) => {
    setEditId(item.id);

    setFormData({
      earningType: item.earningType,
      valueType: item.valueType,
      value: item.value,
    });
  };

  const handleDelete = (id) => {
    setEarningData(earningData.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">Earning Type</h2>

      <hr className="border-gray-800" />

      {/* Form */}

      <div className="flex items-end gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-gray-300">
            Earning Type <span className="text-red-500">*</span>
          </label>

          <input
            value={formData.earningType}
            onChange={(e) =>
              setFormData({ ...formData, earningType: e.target.value })
            }
            placeholder="Earning Type"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-60"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-300">
            Value Type <span className="text-red-500">*</span>
          </label>

          <select
            value={formData.valueType}
            onChange={(e) =>
              setFormData({ ...formData, valueType: e.target.value })
            }
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-60 cursor-pointer"
          >
            <option>Select Value Type</option>
            <option>Fixed</option>
            <option>Percent</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-300">
            Value <span className="text-red-500">*</span>
          </label>

          <input
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
            placeholder="Value"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-60"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white cursor-pointer"
        >
          {editId ? "Update" : "Save"}
        </button>
      </div>

      {/* Table */}

      <table className="w-full">
        <thead>
          <tr className="border border-gray-800">
            <th className="p-3 text-gray-300">S no.</th>

            <th className="p-3 text-gray-300">Earning Type</th>

            <th className="p-3 text-gray-300">Value Type</th>

            <th className="p-3 text-gray-300">Value</th>

            <th className="p-3 text-gray-300">Options</th>
          </tr>
        </thead>

        <tbody>
          {earningData.map((item, index) => (
            <tr key={item.id} className="border border-gray-800 text-center">
              <td className="p-3 text-gray-300">{index + 1}</td>

              <td className="p-3 text-gray-300">{item.earningType}</td>

              <td className="p-3 text-gray-300">{item.valueType}</td>

              <td className="p-3 text-gray-300">{item.value}</td>

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
