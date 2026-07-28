import React, { useState } from "react";
import { Plus, Edit, Trash2, X, ChartNoAxesColumn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermExam() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const exams = [
    {
      id: 1,
      year: "2025-26",
      title: "TERM 2 (BAL VATIKA to CLASS 2)",
      start: "06-03-2026",
      end: "13-03-2026",
      publishResult: "Yes",
      board: "CBSE",
      type: "Term 2",
      status: "Scheduled",
    },
    {
      id: 2,
      year: "2025-26",
      title: "PRE ANNUAL - IX",
      start: "02-02-2026",
      end: "13-02-2026",
      publishResult: "No",
      board: "CBSE",
      type: "Pre-Board",
      status: "Scheduled",
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Term Exams</h1>

        <div className="flex gap-4">
          <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white cursor-pointer">
            <option>Select Academic Year</option>
            <option>2025-26</option>
            <option>2024-25</option>
          </select>

          <button
            onClick={() => {
              setEditData(null);
              setOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl text-white flex gap-2 items-center cursor-pointer"
          >
            <Plus size={18} />
            Create Exam
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-auto custom-scrollbar">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SN.",
                "Academic Year",
                "Exam Title",
                "Schedule",
                "Publish Result",
                "Board",
                "Type",
                "Status",
                "Action",
              ].map((h) => (
                <th className="p-4 text-left text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {exams.map((item, index) => (
              <tr className="border-t border-gray-800 hover:bg-gray-800/50">
                <td className="p-4 text-gray-300">{index + 1}.</td>

                <td className="p-4 text-gray-300">{item.year}</td>

                <td className="p-4 text-white">{item.title}</td>

                <td className="p-4">
                  <div className="flex gap-3">
                    <span className="bg-green-500 text-white px-4 whitespace-nowrap text-sm font-semibold py-1 rounded-lg">
                      Start : {item.start}
                    </span>

                    <span className="bg-red-500 text-white whitespace-nowrap px-4 text-sm font-semibold py-1 rounded-lg">
                      End : {item.end}
                    </span>
                  </div>
                </td>

                <td className="p-4 text-gray-300">{item.publishResult}</td>
                <td className="p-4 text-gray-300">{item.board}</td>

                <td className="p-4 text-gray-300 whitespace-nowrap">
                  {item.type}
                </td>

                <td className="p-4">
                  <span className="bg-blue-500/20 text-blue-400 font-normal text-sm px-3 py-1 rounded-full">
                    {item.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditData(item);
                        setOpen(true);
                      }}
                      title="Edit Exam"
                      className="bg-indigo-600 p-2 rounded-lg text-white cursor-pointer hover:bg-indigo-700"
                    >
                      <Edit size={17} />
                    </button>

                    <button
                      title="Manage Exam"
                      onClick={() =>
                        navigate("/exam/offline-exam/term-exam/exam-info", {
                          state: item,
                        })
                      }
                      className="bg-blue-500/20 p-2 rounded-lg hover:bg-blue-600/40 text-white cursor-pointer"
                    >
                      <ChartNoAxesColumn size={17} />
                    </button>

                    <button
                      title="Inactive Exam"
                      className="bg-red-500 p-2 rounded-lg hover:bg-red-600 text-white cursor-pointer"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExamModal open={open} close={() => setOpen(false)} editData={editData} />
    </div>
  );
}

function ExamModal({ open, close, editData }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-[90%] max-w-2xl">
        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">
            {editData ? "Edit Exam" : "Create Exam"}
          </h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        {/* Body */}

        <div className="p-5 grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-gray-400">
              Academic Year <span className="text-red-500"> *</span>
            </label>
            <select className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white">
              <option>
                {editData?.academicYear || "Select Academic Year"}
              </option>

              <option>2024-2025</option>

              <option>2025-2026</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400">
              Board <span className="text-red-500"> *</span>
            </label>
            <select className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white">
              <option>{editData?.board || "Select Board"}</option>

              <option>CBSE</option>

              <option>CGBSE</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400">
              Exam Title <span className="text-red-500"> *</span>
            </label>
            <input
              defaultValue={editData?.title}
              placeholder="Exam Title"
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400">
              Start Date <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400">
              End Date <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400">
              Exam Type <span className="text-red-500"> *</span>
            </label>

            <select className="bg-gray-800 cursor-pointer border border-gray-700 rounded-xl p-3 text-white col-span-2">
              <option>{editData?.type || "Select Exam Type"}</option>

              <option>Term 1</option>

              <option>Term 2</option>

              <option>Pre Board</option>
            </select>
          </div>
        </div>

        {/* Footer */}

        <div className="border-t border-gray-800 p-5 flex justify-end gap-3">
          <button
            onClick={close}
            className="bg-red-500 px-5 py-2 rounded-lg text-white hover:bg-red-600 cursor-pointer"
          >
            Cancel
          </button>

          <button className="bg-green-500 px-5 py-2 rounded-lg hover:bg-green-600 text-white cursor-pointer">
            {editData ? "Update Exam" : "Create Exam"}
          </button>
        </div>
      </div>
    </div>
  );
}
