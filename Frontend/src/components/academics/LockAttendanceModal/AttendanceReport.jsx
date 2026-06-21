import React, { useState } from "react";
import { CalendarDays } from "lucide-react";
import DayWiseReportModal from "./DayWiseReportModal";
import { useNavigate } from "react-router-dom";

export default function AttendanceReport() {
  const [selectedClass, setSelectedClass] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const students = [
    {
      name: "Anup Sinha",
      roll: 33,
      stream: "NA",
      section: "A",
      avg: "90%",
      present: 10,
      total: 21,
    },
    {
      name: "Anup Sinha",
      roll: 90,
      stream: "NA",
      section: "A",
      avg: "90%",
      present: 20,
      total: 22,
    },
    {
      name: "Anup Sinha",
      roll: 701,
      stream: "NA",
      section: "A",
      avg: "90%",
      present: 20,
      total: 22,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl text-white font-bold">Attendance Reports</h1>
          <p
            onClick={() => navigate("/academic/attendance")}
            className="text-indigo-400 mt-2 cursor-pointer"
          >
            Back to Attendance
          </p>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 flex gap-3">
          <select className="input cursor-pointer">
            <option>Select Acad. Year</option>
            <option>2026-27</option>
            <option>2025-26</option>
            <option>2024-25</option>
          </select>

          <select className="input cursor-pointer">
            <option>Select Board</option>
            <option>CBSE</option>
            <option>CGBSE</option>
          </select>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="input cursor-pointer"
          >
            <option value="">Select Class</option>

            <option value="Class 1">Class 1</option>

            <option value="Class 2">Class 2</option>
          </select>

          <select className="input cursor-pointer">
            <option>Select Months</option>
            <option>Apr-2024</option>
            <option>March-2024</option>
          </select>
        </div>
      </div>

      {/* filters */}

      {selectedClass && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex justify-between items-center">
          {/* left filters */}

          <div className="flex gap-3">
            <select className="input cursor-pointer">
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <select className="input cursor-pointer">
              <option>Select Stream</option>
              <option>Science</option>
              <option>Commerce</option>
            </select>

            <select className="input cursor-pointer">
              <option>Select Section</option>
              <option>A</option>
              <option>B</option>
            </select>
          </div>

          {/* right buttons */}

          <div className="flex gap-3">
            <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl cursor-pointer text-white">
              Excel
            </button>

            <button className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl cursor-pointer text-white">
              PDF
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-900 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SN.",
                "Roll",
                "Name",
                "Stream",
                "Section",
                "Total",
                "Present",
                "Avg",
                "Report",
              ].map((h) => (
                <th className="p-4 text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr className="border-t border-gray-800 text-center">
                <td className="p-4 text-gray-300">{i + 1}.</td>

                <td className="p-4 text-gray-300">{s.roll}</td>

                <td className="p-4 text-gray-300">{s.name}</td>

                <td className="p-4 text-gray-300">{s.stream}</td>

                <td className="p-4 text-gray-300">{s.section}</td>

                <td className="p-4 text-gray-300">{s.present}</td>

                <td className="p-4 text-gray-300">{s.total}</td>

                <td className="text-green-400">{s.avg}</td>

                <td>
                  <button
                    onClick={() => setOpen(true)}
                    className="bg-indigo-600 p-2 rounded-lg text-white cursor-pointer hover:bg-indigo-700"
                  >
                    <CalendarDays />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DayWiseReportModal open={open} close={() => setOpen(false)} />
    </div>
  );
}
