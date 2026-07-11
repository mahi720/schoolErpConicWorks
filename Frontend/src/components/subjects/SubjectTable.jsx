import React, { useState } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import { useSubjectStore } from "../../store/master/subject/subjectStore";

export default function SubjectTable({
  selectedSubjects,
  setSelectedSubjects,
  onEditSubject,
}) {
  const [search, setSearch] = useState("");

  const { subjects, fetchSubjects, deleteSubject, restoreSubject } =
    useSubjectStore();

  const filteredSubjects = subjects.filter((item) =>
    item.subjectTitle.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (slug) => {
    if (selectedSubjects.includes(slug)) {
      setSelectedSubjects((prev) => prev.filter((item) => item !== slug));
    } else {
      setSelectedSubjects((prev) => [...prev, slug]);
    }
  };

  return (
    <div className="rounded-xl border border-gray-800 overflow-hidden">
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-5 flex justify-between items-center flex-wrap border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Subject List</h2>

          <div className="relative">
            <Search size={18} className="absolute left-3 top-4 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Subject..."
              className="w-[300px] bg-gray-800 border border-gray-700 pl-10 p-3 rounded-xl text-white outline-none"
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
                    filteredSubjects.length > 0 &&
                    selectedSubjects.length === filteredSubjects.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSubjects(
                        filteredSubjects.map((item) => item.slug),
                      );
                    } else {
                      setSelectedSubjects([]);
                    }
                  }}
                  className="cursor-pointer"
                />
              </th>

              <th className="p-4">SN</th>
              <th className="p-4">Subject Name</th>
              <th className="p-4">Subject Type</th>
              <th className="p-4">Subject Order</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredSubjects.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-10">
                  No Subjects Found
                </td>
              </tr>
            ) : (
              filteredSubjects.map((subject, index) => (
                <tr key={subject.slug} className="border-t border-gray-800">
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject.slug)}
                      onChange={() => handleSelect(subject.slug)}
                      className="cursor-pointer"
                    />
                  </td>

                  <td className="p-4 text-white">{index + 1}</td>

                  <td className="p-4 text-white">{subject.subjectTitle}</td>

                  <td className="p-4 text-white">{subject.subjectType}</td>

                  <td className="p-4 text-white">{subject.subjectOrder}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        subject.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {subject.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditSubject(subject)}
                        className="p-2 rounded-lg bg-blue-500/20 cursor-pointer text-blue-400"
                      >
                        <Pencil size={16} />
                      </button>

                      {subject.isActive ? (
                        <button
                          onClick={async () => {
                            if (
                              window.confirm(`Delete ${subject.subjectTitle}?`)
                            ) {
                              const success = await deleteSubject(subject.slug);

                              if (success) {
                                fetchSubjects();
                              }
                            }
                          }}
                          className="p-2 rounded-lg bg-red-500/20 cursor-pointer text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            if (
                              window.confirm(`Restore ${subject.subjectTitle}?`)
                            ) {
                              const success = await restoreSubject(
                                subject.slug,
                              );

                              if (success) {
                                fetchSubjects();
                              }
                            }
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs cursor-pointer"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
