import React from "react";
import { useApp } from "../../context/AppContext";
import { Pencil, Search, Trash2 } from "lucide-react";

export default function SubjectTable({
  selectedSubjects,
  setSelectedSubjects,
}) {
  const { subjects } = useApp();

  const handleSelect = (id) => {
    if (selectedSubjects.includes(id)) {
      setSelectedSubjects(selectedSubjects.filter((item) => item !== id));
    } else {
      setSelectedSubjects([...selectedSubjects, id]);
    }
  };

  return (
    <div className="rounded-xl border border-gray-800 overflow-hidden">
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {/* Header */}

        <div className="p-5 flex justify-between items-center flex-wrap border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Subject List</h2>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-4 text-gray-400" />

            <input
              placeholder="Search"
              className="w-[300px] bg-gray-800 border border-gray-700 pl-10 p-3 rounded-xl text-white"
            />
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={
                    selectedSubjects.length === subjects.length &&
                    subjects.length > 0
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSubjects(
                        subjects.map((subject) => subject.id),
                      );
                    } else {
                      setSelectedSubjects([]);
                    }
                  }}
                  className="cursor-pointer"
                />
              </th>

              <th className="p-4 text-gray-300">SN</th>

              <th className="p-4">Subject Name</th>

              <th className="p-4">Subject Type</th>

              <th className="p-4">Subject Order</th>

              <th className="p-4">Status</th>

              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((subject, index) => (
              <tr key={subject.id} className="border-t border-gray-800">
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject.id)}
                    onChange={() => handleSelect(subject.id)}
                    className="cursor-pointer"
                  />
                </td>

                <td className="p-4 text-white">{index + 1}</td>

                <td className="p-4 text-white">{subject.name}</td>

                <td className="p-4 text-white">{subject.type}</td>

                <td className="p-4 text-white">{subject.order}</td>

                <td className="p-4">
                  <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400">
                    {subject.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-blue-500/20 cursor-pointer text-blue-400">
                      <Pencil size={16} />
                    </button>

                    <button className="p-2 rounded-lg bg-red-500/20 cursor-pointer text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
