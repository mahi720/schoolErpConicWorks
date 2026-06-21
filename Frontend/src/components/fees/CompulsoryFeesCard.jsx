import React, { useState } from "react";
import { Plus, CircleX } from "lucide-react";

export default function CompulsoryFeesCard() {
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
        Compulsory Fees
      </h2>

      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field} className="flex items-center gap-6">
            <select className="w-[35%] bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer">
              <option>Select Fees Type</option>

              <option>Tuition Fee</option>

              <option>Transport Fee</option>

              <option>Exam Fee</option>
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

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="text-white block mb-2">
              Due Date
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
          </div>

          <div>
            <label className="text-white block mb-2">
              Due Charges
              <span className="text-red-500"> *</span>
              <span className="text-blue-500 text-sm">
                {" "}
                ( In Percentage % )
              </span>
            </label>

            <input
              value="0"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
          </div>

          <div>
            <label className="text-white block mb-2">
              Due Charges
              <span className="text-red-500"> *</span>
              <span className="text-blue-500 text-sm"> ( Amount )</span>
            </label>

            <input
              placeholder="Due Charges"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
