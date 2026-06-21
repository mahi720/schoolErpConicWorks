import React, { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

import GenerateWeeklyPlanModal from "../../components/academics/WeeklyPlanModal/GenerateWeeklyPlanModal";

export default function WeeklyPlan() {
  const [open, setOpen] = useState(false);

  const plans = [
    {
      start: "01-06-2026",
      end: "07-06-2026",
      periods: 5,
      class: "Class 10 [A]",
      topic: "Computer",
      created: "Admin",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl text-white font-bold">Weekly Plan</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 px-5 py-3 rounded-xl text-white flex gap-2 cursor-pointer hover:bg-indigo-700"
        >
          <Plus size={18} className="mt-1" />
          Generate Weekly Plan
        </button>
      </div>

      {/* Filters */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex justify-between items-center">
        <div className="flex gap-4">
          <input type="date" className="input" />

          <input type="date" className="input" />

          <button className="bg-yellow-600 px-5 rounded-xl text-white flex items-center cursor-pointer hover:bg-yellow-700 gap-2">
            <Search size={17} />
            Search
          </button>
        </div>

        <div className="flex gap-3">
          <button className="bg-green-500 px-5 py-3 rounded-xl text-white flex gap-2 cursor-pointer hover:bg-green-600">
            <FileSpreadsheet size={18} />
            Excel
          </button>

          <button className="bg-red-500 px-5 py-3 rounded-xl text-white flex gap-2 cursor-pointer hover:bg-red-600">
            <FileText size={18} />
            PDF
          </button>
        </div>
      </div>

      {/* table */}

      <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SN.",
                "Start Date",
                "End Date",
                "Periods",
                "Class",
                "Topic",
                "Created By",
                "Action",
              ].map((h) => (
                <th className="p-4 text-gray-300 text-left">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {plans.map((p, i) => (
              <tr className="border-t border-gray-800">
                <td className="p-4 text-white">{i + 1}.</td>

                <td className="p-4 text-gray-300">{p.start}</td>

                <td className="p-4 text-gray-300">{p.end}</td>

                <td className="p-4 text-gray-300">{p.periods}</td>

                <td className="p-4 text-gray-300">{p.class}</td>

                <td className="p-4 text-gray-300">{p.topic}</td>

                <td className="p-4 text-gray-300">{p.created}</td>

                <td className="p-4 flex gap-2">
                  <button className="bg-indigo-600 p-2 rounded-lg text-white cursor-pointer hover:bg-indigo-700">
                    <Edit size={16} />
                  </button>

                  <button className="bg-red-500 p-2 rounded-lg text-white cursor-pointer hover:bg-red-700">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GenerateWeeklyPlanModal open={open} close={() => setOpen(false)} />
    </div>
  );
}
