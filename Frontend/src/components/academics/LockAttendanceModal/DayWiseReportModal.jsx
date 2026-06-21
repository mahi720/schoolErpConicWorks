import React from "react";
import { X } from "lucide-react";

export default function DayWiseReportModal({ open, close }) {
  if (!open) return null;

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-900 rounded-2xl w-[600px] max-h-[100vh] overflow-hidden">
        <div className="p-5 flex justify-between border-b border-gray-800">
          <h2 className="text-xl text-white">Rohan Sinha - Apr 2024</h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        <div className="overflow-y-auto custom-scrollbar max-h-[65vh]">
          <table className="w-full">
            <thead className="bg-gray-800 sticky top-0">
              <tr>
                <th className="p-3 text-gray-300">Date</th>

                <th className="p-3 text-gray-300">Status</th>
              </tr>
            </thead>

            <tbody>
              {days.map((d) => (
                <tr className="border-t border-gray-800 text-center">
                  <td className="p-3 text-white">{d}/04/2024</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${d % 7 === 0 ? "bg-red-500 text-white" : "bg-gray-700 text-gray-300"}`}
                    >
                      {d % 7 === 0 ? "Sunday" : "Not Marked"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
