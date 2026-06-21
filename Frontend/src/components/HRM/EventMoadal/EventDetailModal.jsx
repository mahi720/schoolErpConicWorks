import React from "react";
import { X } from "lucide-react";

export default function EventDetailModal({ open, close, data }) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 w-[600px] rounded-xl border border-gray-700">
        <div className="flex justify-between p-5 border-b border-gray-800">
          <h2 className="text-2xl text-white">Event/Holiday Detail</h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        <div className="p-6 space-y-5">
          <h2 className="text-xl text-white">{data.title}</h2>

          <p className="text-gray-400">{data.description}</p>

          <div className="space-y-4 ml-8">
            <div className="bg-yellow-500/20 text-yellow-400 inline-block px-4 py-2 rounded-lg">
              {data.startDate} {data.startTime}
            </div>

            <br />

            <div className="bg-red-500/20 text-red-400 inline-block px-4 py-2 rounded-lg">
              {data.endDate} {data.endTime}
            </div>
          </div>

          <p className="text-gray-300">
            Created By -
            <span className="ml-2 bg-green-500 text-white px-3 py-1 rounded">
              Admin
            </span>
          </p>
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={close}
            className="bg-gray-700 px-5 py-2 rounded-lg text-white"
          >
            Cancel
          </button>

          <button className="bg-indigo-600 px-5 py-2 rounded-lg text-white">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
