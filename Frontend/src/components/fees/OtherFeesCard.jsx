import React, { useState } from "react";
import { Plus, CircleX } from "lucide-react";

export default function OtherFeesCard() {
  const [fields, setFields] = useState([1]);

  const addField = () => {
    setFields([...fields, Date.now()]);
  };

  const removeField = (id) => {
    setFields(fields.filter((item) => item !== id));
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-800 pb-4">
        Other Fees
        <p className="text-red-500 mt-2 text-sm">
          * Optional Fees does not support Due charges & Installment Facility.
        </p>
      </h2>

      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field} className="flex items-center gap-6">
            <select className="w-[35%] bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer">
              <option>Select Fees Type</option>

              <option>Tuition Fee</option>

              <option>Transport Fee</option>

              <option>Exam Fee</option>
              <option>Gym Fee</option>
              <option>Library Fee</option>
            </select>

            <input
              placeholder="Enter Fees Amount"
              className="w-[25%] bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />

            <button
              onClick={() => removeField(field)}
              className="bg-red-500/20 p-3 rounded-xl cursor-pointer text-red-400"
            >
              <CircleX size={20} />
            </button>
          </div>
        ))}

        <button
          onClick={addField}
          className="flex items-center gap-2 px-5 py-3 cursor-pointer rounded-xl bg-slate-700 hover:bg-slate-600 text-white"
        >
          <Plus size={16} />
          Add New Data
        </button>
      </div>
    </div>
  );
}
