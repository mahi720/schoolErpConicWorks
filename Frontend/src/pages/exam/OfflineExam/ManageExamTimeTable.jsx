import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Download, FileText, Save, SaveAll } from "lucide-react";

export default function ManageExamTimeTable() {
  const { state } = useLocation();

  const [activeClass, setActiveClass] = useState("Class 1");

  const [subjects, setSubjects] = useState([
    {
      id: 1,
      subject: "Hindi",
      mode: "Theory",
      stream: "NA",
      max: "",
      min: "",
      date: "",
      time: "",
      duration: "",
    },

    {
      id: 2,
      subject: "English",
      mode: "Theory",
      stream: "NA",
      max: "",
      min: "",
      date: "",
      time: "",
      duration: "",
    },

    {
      id: 3,
      subject: "Maths",
      mode: "Theory",
      stream: "NA",
      max: "",
      min: "",
      date: "",
      time: "",
      duration: "",
    },
  ]);

  const handleChange = (id, name, value) => {
    setSubjects(
      subjects.map((item) =>
        item.id === id
          ? {
              ...item,
              [name]: value,
            }
          : item,
      ),
    );
  };

  const saveTimeTable = () => {
    console.log({
      exam: state,
      class: activeClass,
      subjects,
    });

    alert("Time Table Saved Successfully");
  };

  return (
    <div className="space-y-6 overflow-auto w-full">
      {/* Exam Info */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex justify-between">
        <div>
          <h2 className="text-xl text-white font-semibold">{state?.title}</h2>

          <p className="text-gray-400 mt-3">Academic Year : {state?.year}</p>

          <p className="text-gray-400">Board : {state?.board}</p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="bg-green-500 px-3 py-2 rounded-lg text-white">
              Start : {state?.start}
            </span>

            <span className="bg-red-500 px-3 py-2 rounded-lg text-white">
              End : {state?.end}
            </span>
          </div>

          <p className="text-gray-300">Status : {state?.status}</p>
        </div>
      </div>

      {/* Classes */}

      <div className="bg-gray-900 border whitespace-nowrap border-gray-800 rounded-xl p-3 flex gap-4 overflow-auto custom-scrollbar">
        {[
          "Nursery",
          "KG 1",
          "KG 2",
          "Class 1",
          "Class 2",
          "Class 3",
          "Class 4",
          "Class 5",
          "Class 6",
          "Class 7",
          "Class 8",
          "Class 9",
          "Class 10",
        ].map((cls) => (
          <button
            onClick={() => setActiveClass(cls)}
            className={`px-5 py-2 rounded-lg cursor-pointer ${
              activeClass === cls
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* Title */}

      <div className="flex justify-between items-center">
        {/* left */}
        <h2 className="text-xl text-white">
          Time Table for {state?.board} ({activeClass})
        </h2>

        {/* right */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <p className="text-gray-400 whitespace-nowrap">Publish Result:</p>

            <select className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-white w-32 cursor-pointer">
              <option>Select Result</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <button
            onClick={saveTimeTable}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl text-white flex items-center gap-2 cursor-pointer"
          >
            <Save size={18} />
            Save Time Table For {activeClass}
          </button>

          <button className="bg-green-600 px-5 py-3 hover:bg-green-700 rounded-xl text-white flex items-center gap-2 cursor-pointer">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-auto custom-scrollbar">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SN.",
                "Subject Name",
                "Study Mode",
                "Stream",
                "Max Marks",
                "Min Marks",
                "Exam Date",
                "Exam Time",
                "Duration",
                "Action",
              ].map((h) => (
                <th className="p-4 text-left text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {subjects.map((item, index) => (
              <tr className="border-t border-gray-800">
                <td className="p-4 text-gray-300">{index + 1}.</td>

                <td className="p-4 text-white">{item.subject}</td>

                <td className="p-4 text-gray-400">{item.mode}</td>

                <td className="p-4 text-gray-400">{item.stream}</td>

                <td className="p-3">
                  <input
                    value={item.max}
                    onChange={(e) =>
                      handleChange(item.id, "max", e.target.value)
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white w-full"
                  />
                </td>

                <td className="p-3">
                  <input
                    value={item.min}
                    onChange={(e) =>
                      handleChange(item.id, "min", e.target.value)
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white w-full"
                  />
                </td>

                <td className="p-3">
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) =>
                      handleChange(item.id, "date", e.target.value)
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white w-full"
                  />
                </td>

                <td className="p-3">
                  <input
                    type="time"
                    value={item.time}
                    onChange={(e) =>
                      handleChange(item.id, "time", e.target.value)
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white w-full"
                  />
                </td>

                <td className="p-1">
                  <select
                    value={item.duration}
                    onChange={(e) =>
                      handleChange(item.id, "duration", e.target.value)
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white w-full"
                  >
                    <option>Duration</option>

                    <option>1 Hour</option>

                    <option>2 Hours</option>

                    <option>3 Hours</option>
                  </select>
                </td>
                <td className="p-4">
                  <button className="bg-blue-500 px-2 py-2 rounded-lg text-white hover:bg-blue-600 cursor-pointer">
                    <FileText size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
