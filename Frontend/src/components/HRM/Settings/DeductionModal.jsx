import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function DeductionModal({ open, close, editData }) {
  const [data, setData] = useState({
    deductionType: "",
    valueType: "Fixed",
    value: "",
    maxValue: "",
  });

  useEffect(() => {
    if (editData) {
      setData(editData);
    }
  }, [editData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[600px] p-6 space-y-5">
        <div className="flex justify-between">
          <h2 className="text-white text-xl">Edit Deduction</h2>

          <X onClick={close} className="text-white cursor-pointer" />
        </div>

        <input
          value={data.deductionType}
          onChange={(e) => setData({ ...data, deductionType: e.target.value })}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
        />

        <select
          value={data.valueType}
          onChange={(e) =>
            setData({ ...data, valueType: e.target.value, maxValue: "" })
          }
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
        >
          <option>Fixed</option>

          <option>Percent</option>
        </select>

        <input
          value={data.value}
          onChange={(e) => setData({ ...data, value: e.target.value })}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
        />

        {data.valueType === "Percent" && (
          <input
            value={data.maxValue}
            onChange={(e) => setData({ ...data, maxValue: e.target.value })}
            placeholder="Maximum Value"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
          />
        )}

        <button className="bg-indigo-600 px-5 py-2 rounded-lg text-white">
          Update
        </button>
      </div>
    </div>
  );
}
