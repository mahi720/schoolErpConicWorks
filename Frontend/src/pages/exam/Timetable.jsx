import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Plus } from "lucide-react";

export default function Timetable() {
  const { exams } = useApp();
  const [selectedExam, setSelectedExam] = useState(exams[0]?.id);

  const timetableData = [
    {
      day: "Monday",
      date: "2024-11-01",
      time: "10:00 AM - 1:00 PM",
      subject: "Mathematics",
      class: "10-A",
    },
    {
      day: "Tuesday",
      date: "2024-11-02",
      time: "10:00 AM - 1:00 PM",
      subject: "English",
      class: "10-A",
    },
    {
      day: "Wednesday",
      date: "2024-11-03",
      time: "2:00 PM - 5:00 PM",
      subject: "Science",
      class: "10-A",
    },
    {
      day: "Thursday",
      date: "2024-11-04",
      time: "10:00 AM - 1:00 PM",
      subject: "Social Studies",
      class: "10-A",
    },
    {
      day: "Friday",
      date: "2024-11-05",
      time: "2:00 PM - 5:00 PM",
      subject: "Computer Science",
      class: "10-A",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Exam Timetable
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            View and manage exam schedules
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} />
          Create Timetable
        </button>
      </div>

      {/* Exam Selector */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <label className="block text-sm font-semibold mb-2">Select Exam</label>
        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.name}
            </option>
          ))}
        </select>
      </div>

      {/* Timetable */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="text-left p-4 font-semibold">Day</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-left p-4 font-semibold">Time</th>
                <th className="text-left p-4 font-semibold">Subject</th>
                <th className="text-left p-4 font-semibold">Class</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timetableData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-600 dark:bg-gray-700"
                >
                  <td className="p-4">{row.day}</td>
                  <td className="p-4">{row.date}</td>
                  <td className="p-4">{row.time}</td>
                  <td className="p-4 font-semibold">{row.subject}</td>
                  <td className="p-4">{row.class}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-xs">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-xs">
                        Delete
                      </button>
                    </div>
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
