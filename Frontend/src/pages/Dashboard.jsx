import React from "react";
import { useApp } from "../context/AppContext";
import StatsCard from "../components/common/StatsCard";
import { Users, BookOpen, FileText, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { students, teachers, classes, exams } = useApp();

  const stats = [
    {
      label: "Total Students",
      value: students.length,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Teachers",
      value: teachers.length,
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Classes",
      value: classes.length,
      icon: BookOpen,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Upcoming Exams",
      value: exams.filter((e) => e.status === "scheduled").length,
      icon: FileText,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Welcome to School ERP System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Students */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Students</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-3 font-semibold">Name</th>
                <th className="text-left p-3 font-semibold">Roll No</th>
                <th className="text-left p-3 font-semibold">Class</th>
                <th className="text-left p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 5).map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-600 dark:bg-gray-700"
                >
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">{student.rollNo}</td>
                  <td className="p-3">{student.class}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        student.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          "Add Student",
          "Mark Attendance",
          "Schedule Exam",
          "Issue Certificate",
        ].map((action, i) => (
          <button
            key={i}
            className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary transition-colors text-center font-medium text-black dark:text-white"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
