import React, { useState } from "react";
import { X } from "lucide-react";

export default function LostBookModalEmployee({ open, close }) {
  const [date, setDate] = useState("");
  const [totalFine, setTotalFine] = useState("599");

  if (!open) return null;

  const handleLost = () => {
    console.log({
      date,
      totalFine,
    });

    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[500px]">
        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white font-semibold">Lost Book</h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        {/* Body */}

        <div className="p-6 space-y-6">
          {/* Date + Fine */}

          <div className="flex gap-12">
            <div className="flex flex-col">
              <label className="text-gray-300">
                Date :<span className="text-red-500"> *</span>
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-48 cursor-pointer"
              />
            </div>

            {/* <div>
              <label className="text-gray-300">Fine :</label>

              <h2 className="mt-3 text-2xl text-gray-300">₹ 0</h2>
            </div> */}
          </div>

          {/* Book Price */}

          {/* <h2 className="text-xl font-semibold text-gray-300">
            Book Price : ₹ 599
          </h2> */}

          {/* Total Fine */}

          {/* <div className="flex flex-col">
            <label className="text-gray-300">
              Total Fine (in ₹) :<span className="text-red-500"> *</span>
            </label>

            <input
              value={totalFine}
              onChange={(e) => setTotalFine(e.target.value)}
              className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-48"
            />
          </div> */}
        </div>

        {/* Footer */}

        <div className="border-t border-gray-800 p-5 flex justify-end gap-3">
          <button
            onClick={handleLost}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-lg text-white cursor-pointer"
          >
            Mark Lost
          </button>

          <button
            onClick={close}
            className="bg-gray-800 hover:bg-gray-700 px-5 py-3 rounded-lg text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
