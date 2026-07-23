import React, { useState } from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DailyAttendanceReport() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("2026-06-03");

  const data = [
    {
      className: "Class 1",
      section: "A",
      stream: "Arts",
      enrolled: 2,
      present: 0,
      absent: 0,
      holiday: 0,
    },
    {
      className: "Class 2",
      section: "B",
      stream: "Science",
      enrolled: 2,
      present: 0,
      absent: 3,
      holiday: 1,
    },
    {
      className: "Class 1",
      section: "C",
      stream: "Commerce",
      enrolled: 2,
      present: 5,
      absent: 0,
      holiday: 0,
    },
  ];

  // date format
  const formatDate = (date) => {
    const d = new Date(date);

    return d
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replaceAll("/", "-");
  };

  // day name
  const getDay = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Daily Attendance Report
          </h1>

          <p
            onClick={() => navigate("/academic/attendance")}
            className="text-indigo-400 mt-2 cursor-pointer"
          >
            Back to Attendance
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="
            bg-gray-800
            border border-gray-700
            rounded-xl
            p-3
            text-white"
          />

          <button
            className="
          px-5 py-3
          rounded-xl
          bg-green-500
          text-white flex gap-2 cursor-pointer hover:bg-green-600"
          >
            {/* <FileSpreadsheet size={18} className="p-3" /> */}
            Excel
          </button>

          <button
            className="
          px-5 py-3
          rounded-xl
          bg-red-500
          text-white flex gap-2 cursor-pointer hover:bg-red-600"
          >
            {/* <FileText size={18} /> */}
            PDF
          </button>
        </div>
      </div>

      {/* report table */}

      <div
        className="
      bg-gray-900
      border border-gray-800
      rounded-xl
      p-6
      "
      >
        <table
          className="
      w-full
      border-collapse
      text-center
      text-white
      "
        >
          <tbody>
            {/* first row */}

            <tr>
              <th className="border border-gray-700 p-3">Date</th>

              <th colSpan="3" className="border border-gray-700 p-3">
                {formatDate(selectedDate)}
              </th>

              <th className="border border-gray-700 p-3">Day</th>

              <th className="border border-gray-700 p-3">
                {getDay(selectedDate)}
              </th>
            </tr>

            {/* heading */}

            <tr className="bg-gray-800">
              {[
                "Class",
                "Section",
                "stream",
                "Enrolled",
                "Present",
                "Absent",
                "Holiday",
              ].map((h) => (
                <th key={h} className="border border-gray-700 p-3">
                  {h}
                </th>
              ))}
            </tr>

            {/* data */}

            {data.map((item) => (
              <tr>
                <td className="border border-gray-700 p-3">{item.className}</td>

                <td className="border border-gray-700 p-3">{item.section}</td>

                <td className="border border-gray-700 p-3">{item.stream}</td>

                <td className="border border-gray-700 p-3">{item.enrolled}</td>

                <td className="border border-gray-700 p-3">{item.present}</td>

                <td className="border border-gray-700 p-3">{item.absent}</td>

                <td className="border border-gray-700 p-3">{item.holiday}</td>
              </tr>
            ))}

            {/* total */}

            <tr className="font-bold">
              <td colSpan="3" className="border border-gray-700 p-3">
                Total
              </td>

              <td className="border border-gray-700 p-3">6</td>

              <td className="border border-gray-700 p-3">5</td>

              <td className="border border-gray-700 p-3">3</td>

              <td className="border border-gray-700 p-3">1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
