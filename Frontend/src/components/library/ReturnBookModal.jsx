import React, { useState } from "react";
import { X } from "lucide-react";

export default function ReturnBookModal({ open, close }) {
  const [returnDate, setReturnDate] = useState("");

  if (!open) return null;

  const handleReturn = () => {
    console.log({
      returnDate,
      fine: 0,
    });

    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[500px]">
        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white font-semibold">Return Book</h2>

          <X
            onClick={close}
            size={22}
            className="text-gray-400 cursor-pointer"
          />
        </div>

        {/* Body */}

        <div className="p-6 flex gap-8">
          <div className="flex flex-col font-normal text-sm">
            <label className="text-gray-300">
              Return Date
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-48 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-gray-300">Fine :</label>

            <h2 className="mt-3 text-2xl text-gray-300">₹ 0</h2>
          </div>
        </div>

        {/* Footer */}

        <div className="border-t border-gray-800 p-5 flex justify-end gap-3">
          <button
            onClick={handleReturn}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-lg text-white cursor-pointer"
          >
            Return
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
