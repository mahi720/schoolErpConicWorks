import React, { useState } from "react";
import { RefreshCcw, FileText, Download, Edit, Search } from "lucide-react";
import ReviewSubmissionModal from "../../components/ExamManager/ReviewSubmissionModal";

export default function Assignment() {
  const [reviewOpen, setReviewOpen] = useState(false);
  const assignments = [
    {
      id: 1,
      assignment: "Descriptive Essay on “A Memorable Day in My Life”",
      class: "3",
      section: "A",
      subject: "English - Theory",
      student: "Giovana Castro",
      file: "File Upload",
      status: "Accepted",
      point: 400,
      feedback: "Very Very Good Assignment",
      year: "2024-2025",
    },
    {
      id: 2,
      assignment: "Science Project Report",
      class: "10",
      section: "B",
      subject: "Science",
      student: "Kauan Sousa",
      file: "File Upload",
      status: "Accepted",
      point: 500,
      feedback: "Good Assignment 👏",
      year: "2024-2025",
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Heading */}

      <h1 className="text-3xl font-bold text-white">
        Manage Assignment Submission
      </h1>

      {/* Card */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6 w-full">
        <h2 className="text-xl text-white font-semibold">
          List Assignment Submission
        </h2>

        {/* Filter */}

        <div className="flex justify-between items-end gap-5">
          <div className="flex gap-4">
            <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-56 cursor-pointer">
              <option>Select Class</option>
              <option>Class 1</option>
              <option>Class 10</option>
            </select>

            <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-56 cursor-pointer">
              <option>Select Section</option>
              <option>A</option>
              <option>B</option>
            </select>

            <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-56 cursor-pointer">
              <option>Select Subject</option>
              <option>English</option>
              <option>Science</option>
            </select>
          </div>

          {/* <div className="flex">
            <button className="bg-gray-800 border border-gray-700 px-8 py-3 text-blue-400 hover:bg-gray-700">
              <RefreshCcw />
            </button>

            <button className="bg-gray-800 border border-gray-700 px-8 py-3 text-green-400 hover:bg-gray-700">
              <FileText />
            </button>

            <button className="bg-gray-800 border border-gray-700 px-8 py-3 text-yellow-400 hover:bg-gray-700">
              <Download />
            </button>
          </div> */}

          <div className="flex justify-end">
            <div className="relative w-72">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                placeholder="Search..."
                className="bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white w-full outline-none"
              />
            </div>
          </div>
        </div>

        {/* Search */}

        {/* Table */}

        <div className="overflow-auto custom-scrollbar w-full">
          <table className="w-full min-w-[1200px] border border-gray-800">
            <thead className="bg-gray-800">
              <tr>
                {[
                  "No.",
                  "Assignment Name",
                  "Class - Section",
                  "Subject",
                  "Student Name",
                  "Files",
                  "Status",
                  "Points",
                  "Feedback",
                  "Session Year",
                  "Action",
                ].map((head) => (
                  <th key={head} className="p-4 text-left text-gray-300">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {assignments.map((item) => (
                <tr key={item.id} className="border-t border-gray-800">
                  <td className="p-4 text-gray-300">{item.id}</td>

                  <td className="p-4 text-white w-64">{item.assignment}</td>

                  <td className="p-4 text-gray-300">
                    {item.class} - {item.section}
                  </td>

                  <td className="p-4 text-gray-300">{item.subject}</td>

                  <td className="p-4 text-white font-medium">{item.student}</td>

                  <td className="p-4 text-blue-400">{item.file}</td>

                  <td className="p-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                      {item.status}
                    </span>
                  </td>

                  <td className="p-4 text-gray-300">{item.point}</td>

                  <td className="p-4 text-gray-300">{item.feedback}</td>

                  <td className="p-4 text-gray-300">{item.year}</td>

                  <td className="p-4">
                    <button
                      onClick={() => setReviewOpen(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-xl text-white cursor-pointer"
                    >
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ReviewSubmissionModal
        open={reviewOpen}
        close={() => setReviewOpen(false)}
      />
    </div>
  );
}
