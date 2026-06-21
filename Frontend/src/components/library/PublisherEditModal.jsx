import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function PublisherModal({ open, close, data, update }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (data) {
      setName(data.name);
    }
  }, [data]);

  if (!open) return null;

  const handleUpdate = () => {
    update({
      ...data,
      name: name,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[450px]">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">Edit Publisher</h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        <div className="p-6">
          <label className="text-gray-300">Publisher Name</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
          />
        </div>

        <div className="border-t border-gray-800 p-5 flex justify-end gap-3">
          <button
            onClick={close}
            className="bg-gray-800 px-5 py-3 rounded-lg text-white"
          >
            Close
          </button>

          <button
            onClick={handleUpdate}
            className="bg-indigo-600 px-5 py-3 rounded-lg text-white"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
