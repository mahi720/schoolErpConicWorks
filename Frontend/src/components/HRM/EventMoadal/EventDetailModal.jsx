import React from "react";

import { Edit, Loader2, RotateCcw, Trash2, X } from "lucide-react";

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const parts = String(date).split("-");

  if (parts.length !== 3) {
    return date;
  }

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

const formatTime = (value) => {
  if (!value) {
    return "-";
  }

  const [hourString, minuteString] = value.split(":");

  const hour = Number(hourString);

  const minute = minuteString || "00";

  if (Number.isNaN(hour)) {
    return value;
  }

  const suffix = hour >= 12 ? "PM" : "AM";

  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${minute} ${suffix}`;
};

export default function EventDetailModal({
  open,
  close,
  data,
  onEdit,
  onDelete,
  onRestore,
  actionLoading = false,
}) {
  if (!open || !data) {
    return null;
  }

  const isActive = data.isActive !== false;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 px-4 py-6">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-[600px] shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-white">Event Detail</h2>

            <p className="text-sm text-gray-500 mt-1">
              Calendar event information
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            <X size={21} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-2xl text-white font-semibold">{data.title}</h2>

            <p className="text-gray-400 mt-2 leading-relaxed">
              {data.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-xs text-yellow-500 uppercase tracking-wide">
                Starts
              </p>

              <p className="text-yellow-300 mt-2 font-medium">
                {formatDate(data.startDate)}
              </p>

              <p className="text-gray-400 text-sm mt-1">
                {formatTime(data.startTime)}
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-xs text-red-500 uppercase tracking-wide">
                Ends
              </p>

              <p className="text-red-300 mt-2 font-medium">
                {formatDate(data.endDate)}
              </p>

              <p className="text-gray-400 text-sm mt-1">
                {formatTime(data.endTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <span className="text-gray-400">Status</span>

            <span
              className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                isActive
                  ? "bg-green-500/15 text-green-400"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={close}
            className="bg-gray-700 hover:bg-gray-800 px-5 py-2.5 rounded-lg text-white cursor-pointer"
          >
            Close
          </button>

          {isActive ? (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2.5 rounded-lg text-white cursor-pointer flex items-center gap-2"
              >
                <Edit size={17} />
                Edit
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-lg text-white cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Trash2 size={17} />
                )}
                Delete
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onRestore}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-lg text-white cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <RotateCcw size={17} />
              )}
              Restore
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
