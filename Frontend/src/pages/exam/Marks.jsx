import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function Marks() {
  const { exams } = useApp();
  const [selectedExam, setSelectedExam] = useState(exams[0]?.id);
  const [selectedSubject, setSelectedSubject] = useState("MATH");

  const marksData = [
    { studentId: 1, name: "Rajesh Kumar", rollNo: 101, marks: 85 },
    { studentId: 2, name: "Priya Singh", rollNo: 102, marks: 92 },
    { studentId: 3, name: "Amit Patel", rollNo: 103, marks: 78 },
    { studentId: 4, name: "Ananya Sharma", rollNo: 104, marks: 88 },
    { studentId: 5, name: "Vikram Das", rollNo: 105, marks: 75 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Exam Marks
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Manage and track student marks
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Select Exam
          </label>
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
        <div>
          <label className="block text-sm font-semibold mb-2">
            Select Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="MATH">Mathematics</option>
            <option value="ENG">English</option>
            <option value="SCI">Science</option>
            <option value="SS">Social Studies</option>
          </select>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="text-left p-4 font-semibold">Student Name</th>
                <th className="text-left p-4 font-semibold">Roll No</th>
                <th className="text-left p-4 font-semibold">
                  Marks (Out of 100)
                </th>
                <th className="text-left p-4 font-semibold">Grade</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {marksData.map((row, idx) => {
                const percentage = row.marks;
                const grade =
                  percentage >= 90
                    ? "A+"
                    : percentage >= 80
                      ? "A"
                      : percentage >= 70
                        ? "B"
                        : "C";
                return (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-600 dark:bg-gray-700"
                  >
                    <td className="p-4">{row.name}</td>
                    <td className="p-4">{row.rollNo}</td>
                    <td className="p-4">
                      <input
                        type="number"
                        defaultValue={row.marks}
                        max="100"
                        className="w-20 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          grade === "A+" || grade === "A"
                            ? "bg-green-100 text-green-700"
                            : grade === "B"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {grade}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:text-blue-800 text-xs">
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Average Marks
          </p>
          <p className="text-2xl font-bold text-black dark:text-white mt-2">
            84.5
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Highest Marks
          </p>
          <p className="text-2xl font-bold text-black dark:text-white mt-2">
            92
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Lowest Marks
          </p>
          <p className="text-2xl font-bold text-black dark:text-white mt-2">
            75
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Pass Percentage
          </p>
          <p className="text-2xl font-bold text-green-600 mt-2">100%</p>
        </div>
      </div>
    </div>
  );
}
