import React from "react";
import { useApp } from "../../context/AppContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, TrendingUp } from "lucide-react";

export default function Reports() {
  const { exams } = useApp();

  const reportData = [
    { subject: "Mathematics", average: 82, passed: 45, failed: 0 },
    { subject: "English", average: 78, passed: 42, failed: 3 },
    { subject: "Science", average: 80, passed: 43, failed: 2 },
    { subject: "Social Studies", average: 75, passed: 40, failed: 5 },
    { subject: "Computer Science", average: 85, passed: 45, failed: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Exam Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            View detailed exam analysis and reports
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Total Exams
          </p>
          <p className="text-3xl font-bold text-black dark:text-white mt-2">
            {exams.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <p className="text-gray-600 dark:text-gray-300 text-sm">Completed</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {exams.filter((e) => e.status === "completed").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            In Progress
          </p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {exams.filter((e) => e.status === "in-progress").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Average Score
          </p>
          <p className="text-3xl font-bold text-black dark:text-white mt-2">
            80%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <TrendingUp size={20} />
          Subject Performance
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="average" fill="#3b82f6" name="Average Score" />
            <Bar dataKey="passed" fill="#10b981" name="Passed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Subject-wise Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="text-left p-4 font-semibold">Subject</th>
                <th className="text-left p-4 font-semibold">Average Score</th>
                <th className="text-left p-4 font-semibold">Passed Students</th>
                <th className="text-left p-4 font-semibold">Failed Students</th>
                <th className="text-left p-4 font-semibold">Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, idx) => {
                const total = row.passed + row.failed;
                const passRate = ((row.passed / total) * 100).toFixed(1);
                return (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-600 dark:bg-gray-700"
                  >
                    <td className="p-4 font-semibold">{row.subject}</td>
                    <td className="p-4">{row.average}%</td>
                    <td className="p-4">{row.passed}</td>
                    <td className="p-4">{row.failed}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          passRate >= 90
                            ? "bg-green-100 text-green-700"
                            : passRate >= 70
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {passRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
