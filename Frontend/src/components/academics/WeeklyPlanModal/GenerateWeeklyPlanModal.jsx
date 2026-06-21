import React, { useState } from "react";
import { X, Plus, Trash } from "lucide-react";

export default function GenerateWeeklyPlanModal({ open, close }) {
  const [lesson, setLesson] = useState({
    day: "",
    method: "",
    activity: "",
    assessment: "",
  });

  const [rows, setRows] = useState([]);
  if (!open) return null;

  const addRow = () => {
    if (!lesson.day && !lesson.method && !lesson.activity && !lesson.assessment)
      return;

    setRows([...rows, lesson]);

    setLesson({
      day: "",
      method: "",
      activity: "",
      assessment: "",
    });
  };

  const removeRow = (i) => {
    setRows(rows.filter((_, index) => index !== i));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 rounded-2xl w-[60%] max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* header */}

        <div className="p-5 border-b border-gray-800 flex justify-between">
          <h2 className="text-2xl text-white">Generate New Weekly Plan</h2>

          <X
            onClick={close}
            className="text-gray-400 cursor-pointer hover:text-gray-200"
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-gray-400 text-sm block h-4">
                  From <span className="text-red-500"> *</span>
                </label>
                <input type="date" className="input w-full h-12" />
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-sm block h-4">
                  Topic <span className="text-red-500"> *</span>
                </label>
                <textarea
                  rows="2"
                  placeholder="Enter Topic"
                  className="input w-full resize-none h-20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-sm block h-9">
                  Introduction Aids : (Smart Class Module/Online resource/Any
                  Other) <span className="text-red-500">*</span>
                </label>

                <textarea
                  placeholder="Introduction Aids : (Smart Class Module/Online...)"
                  className="input w-full resize-none h-20 overflow-hidden"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-sm block h-4">
                  To <span className="text-red-500"> *</span>
                </label>
                <input type="date" className="input w-full h-12" />
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-sm block h-4">
                  Sub Topic <span className="text-red-500"> *</span>
                </label>
                <textarea
                  rows="2"
                  className="input w-full resize-none h-20"
                  placeholder="Enter Sub Topic"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-sm block h-4">
                  Introduction Activity <span className="text-red-500"> *</span>
                </label>
                <textarea
                  rows="2"
                  className="input w-full resize-none h-20"
                  placeholder="Enter Introduction Activity"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-sm block h-4">
                  No Of Periods <span className="text-red-500"> *</span>
                </label>
                <input
                  type="number"
                  className="input w-full h-12"
                  placeholder="Enter No Of Periods"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-sm block h-4">
                  Learning Objective <span className="text-red-500"> *</span>
                </label>
                <textarea
                  rows="2"
                  className="input w-full resize-none h-20"
                  placeholder="Enter Learning Objective"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-400 text-sm block h-4">
                  Class <span className="text-red-500"> *</span>
                </label>
                <select className="input w-full h-12 cursor-pointer">
                  <option>Select Class</option>
                  <option>Grade 9</option>
                  <option>Grade 10</option>
                  <option>Grade 11</option>
                  <option>Grade 12</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-sm block h-4 cursor-pointer">
                  Section <span className="text-red-500"> *</span>
                </label>
                <select className="input w-full h-12 cursor-pointer">
                  <option className="text-gray-400 font-normal text-sm">
                    Select Section
                  </option>
                  <option>A</option>
                  <option>B</option>
                </select>
              </div>
            </div>
          </div>

          {/* lesson */}

          <h3 className="text-white text-lg">Lesson Development</h3>

          <table className="w-full">
            <thead>
              <tr>
                {[
                  "Day",
                  "Teaching Methodology",
                  "Students Activities",
                  "Assessment",
                  "Action",
                ].map((h) => (
                  <th className="text-gray-400 p-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Input Row */}
              <tr>
                <td className="p-3">
                  <input
                    value={lesson.day}
                    onChange={(e) =>
                      setLesson({ ...lesson, day: e.target.value })
                    }
                    placeholder="Day"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </td>

                <td className="p-3">
                  <input
                    value={lesson.method}
                    onChange={(e) =>
                      setLesson({ ...lesson, method: e.target.value })
                    }
                    placeholder="Teaching Methodology"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </td>

                <td className="p-3">
                  <input
                    value={lesson.activity}
                    onChange={(e) =>
                      setLesson({ ...lesson, activity: e.target.value })
                    }
                    placeholder="Students Activities"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </td>

                <td className="p-3">
                  <input
                    value={lesson.assessment}
                    onChange={(e) =>
                      setLesson({ ...lesson, assessment: e.target.value })
                    }
                    placeholder="Assessment"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </td>

                <td>
                  <button
                    onClick={addRow}
                    className="bg-indigo-600 text-white p-2 rounded-lg cursor-pointer hover:bg-indigo-700"
                  >
                    <Plus size={18} />
                  </button>
                </td>
              </tr>

              {/* Added Data */}
              {rows.map((item, i) => (
                <tr key={i} className="border-t border-gray-800">
                  <td className="p-3 text-white whitespace-normal break-words max-w-[200px]">
                    {item.day}
                  </td>

                  <td className="p-3 text-white whitespace-normal break-words max-w-[200px]">
                    {item.method}
                  </td>

                  <td className="p-3 text-white whitespace-normal break-words max-w-[200px]">
                    {item.activity}
                  </td>

                  <td className="p-3 text-white whitespace-normal break-words max-w-[200px]">
                    {item.assessment}
                  </td>

                  <td>
                    <button
                      onClick={() => removeRow(i)}
                      className="bg-red-500 p-2 rounded-lg cursor-pointer text-white hover:bg-red-600"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* footer */}

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button className="bg-green-500 px-6 py-3 rounded-xl text-white cursor-pointer hover:bg-green-600">
            Create Weekly Plan
          </button>

          <button
            onClick={close}
            className="bg-red-500 px-6 py-3 rounded-xl text-gray-300 cursor-pointer hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
