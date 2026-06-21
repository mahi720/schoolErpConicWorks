import React, { useState } from "react";

import { Pencil, Trash2, Settings, BookOpen } from "lucide-react";

import MarksConfigurationModal from "./MarksConfigurationModal";

import SubjectTopicsModal from "./SubjectTopicsModal";

export default function ClassSubjectTable() {
  const [showMarks, setShowMarks] = useState(false);

  const [showTopics, setShowTopics] = useState(false);

  const subjects = [
    {
      id: 1,
      name: "Mathematics",
      studyMode: "Theory",
      type: "Scholastic",
      stream: "Science",
      status: "Active",
      pt: 10,
      ma: 20,
      sea: 5,
      pf: 15,
      term: 40,
      practical: 10,
    },

    {
      id: 2,
      name: "English",
      studyMode: "Theory",
      type: "Scholastic",
      stream: "All",
      status: "Active",
      pt: 10,
      ma: 20,
      sea: 5,
      pf: 15,
      term: 40,
      practical: 0,
    },
  ];

  return (
    <>
      <div className="rounded-xl border border-gray-800 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-4">SN</th>

              <th className="p-4">Subject Name</th>

              <th className="p-4">Study Mode</th>

              <th className="p-4">Subject Type</th>

              <th className="p-4">Streams</th>

              <th className="p-4">Status</th>

              <th className="p-4">PT</th>

              <th className="p-4">MA</th>

              <th className="p-4">SEA</th>

              <th className="p-4">PF</th>

              <th className="p-4">TERM</th>

              <th className="p-4">PRACTICAL</th>

              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((item, index) => (
              <tr key={item.id} className="border-t border-gray-800">
                <td className="p-4 text-white">{index + 1}</td>

                <td className="p-4 text-white">{item.name}</td>

                <td className="p-4 text-white">{item.studyMode}</td>

                <td className="p-4 text-white">{item.type}</td>

                <td className="p-4 text-white">{item.stream}</td>

                <td className="p-4">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg">
                    {item.status}
                  </span>
                </td>

                <td className="p-4 text-white">{item.pt}</td>
                <td className="p-4 text-white">{item.ma}</td>
                <td className="p-4 text-white">{item.sea}</td>
                <td className="p-4 text-white">{item.pf}</td>
                <td className="p-4 text-white">{item.term}</td>
                <td className="p-4 text-white">{item.practical}</td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="p-2 bg-blue-500/20 rounded-lg cursor-pointer text-blue-400">
                      <Pencil size={16} />
                    </button>

                    <button className="p-2 bg-red-500/20 rounded-lg cursor-pointer text-red-400">
                      <Trash2 size={16} />
                    </button>

                    <button
                      onClick={() => setShowMarks(true)}
                      className="p-2 bg-green-500/20 rounded-lg cursor-pointer text-green-400"
                      title="Configure Marks"
                    >
                      <Settings size={16} />
                    </button>

                    <button
                      onClick={() => setShowTopics(true)}
                      className="p-2 bg-purple-500/20 rounded-lg cursor-pointer text-purple-400"
                      title="Manage Topics"
                    >
                      <BookOpen size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MarksConfigurationModal
        isOpen={showMarks}
        onClose={() => setShowMarks(false)}
      />

      <SubjectTopicsModal
        isOpen={showTopics}
        onClose={() => setShowTopics(false)}
      />
    </>
  );
}
