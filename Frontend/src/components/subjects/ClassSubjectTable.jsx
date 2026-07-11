import React, { useEffect, useMemo, useState } from "react";
import { Trash2, Settings, BookOpen, Loader2 } from "lucide-react";

import MarksConfigurationModal from "./MarksConfigurationModal";
import SubjectTopicsModal from "./SubjectTopicsModal";

import { useClassSubjectStore } from "../../store/master/addSubjectToClass/classSubjectStore";

export default function ClassSubjectTable({ board, session, classTitle }) {
  const [showMarks, setShowMarks] = useState(false);
  const [showTopics, setShowTopics] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const { classSubjects, loading, fetchClassSubjects, deleteClassSubject } =
    useClassSubjectStore();

  useEffect(() => {
    if (!board || !session || !classTitle) return;

    fetchClassSubjects({
      board,
      session,
      classTitle,
    });
  }, [board, session, classTitle, fetchClassSubjects]);

  const marksComponentColumns = useMemo(() => {
    const componentMap = new Map();

    classSubjects.forEach((subject) => {
      const configs = Array.isArray(subject.marksConfigs)
        ? subject.marksConfigs
        : [];

      configs.forEach((config) => {
        const name = config.componentName?.trim();

        if (!name) return;

        const normalizedName = name.toLowerCase();

        if (!componentMap.has(normalizedName)) {
          componentMap.set(normalizedName, name);
        }
      });
    });

    return Array.from(componentMap.entries()).map(([key, label]) => ({
      key,
      label,
    }));
  }, [classSubjects]);

  const getMarksConfig = (subject, componentKey) => {
    const configs = Array.isArray(subject.marksConfigs)
      ? subject.marksConfigs
      : [];

    return configs.find(
      (config) => config.componentName?.trim().toLowerCase() === componentKey,
    );
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove ${item.subjectTitle} from ${classTitle}?`,
    );

    if (!confirmDelete) return;

    await deleteClassSubject(item.slug);
  };

  const openMarksModal = (item) => {
    setSelectedSubject(item);
    setShowMarks(true);
  };

  const openTopicsModal = (item) => {
    setSelectedSubject(item);
    setShowTopics(true);
  };

  const handleMarksModalClose = () => {
    setShowMarks(false);
    setSelectedSubject(null);

    fetchClassSubjects({
      board,
      session,
      classTitle,
    });
  };

  return (
    <>
      <div className="rounded-xl border border-gray-800 overflow-auto max-h-[70vh] custom-scrollbar">
        <table className="min-w-max w-full">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-4">SN.</th>
              <th className="p-4">Subject Name</th>
              <th className="p-4">Study Mode</th>
              <th className="p-4">Subject Type</th>
              <th className="p-4">Stream</th>
              <th className="p-4">Status</th>

              {marksComponentColumns.map((component) => (
                <th key={component.key} className="p-4 whitespace-nowrap">
                  {component.label}
                </th>
              ))}

              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7 + marksComponentColumns.length} className="p-10">
                  <div className="flex items-center justify-center text-gray-400">
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Loading class subjects...
                  </div>
                </td>
              </tr>
            ) : classSubjects.length === 0 ? (
              <tr>
                <td
                  colSpan={7 + marksComponentColumns.length}
                  className="p-10 text-center text-gray-400"
                >
                  No subjects assigned to this class
                </td>
              </tr>
            ) : (
              classSubjects.map((item, index) => (
                <tr key={item.slug} className="border-t border-gray-800">
                  <td className="p-4 text-white">{index + 1}.</td>

                  <td className="p-4 text-white font-medium">
                    {item.subjectTitle || "-"}
                  </td>

                  <td className="p-4 text-white">{item.studyType || "-"}</td>

                  <td className="p-4 text-white">{item.subjectType || "-"}</td>

                  <td className="p-4 text-white">{item.stream || "All"}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        item.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {marksComponentColumns.map((component) => {
                    const config = getMarksConfig(item, component.key);

                    return (
                      <td
                        key={`${item.slug}-${component.key}`}
                        className="p-4 text-center"
                      >
                        {config ? (
                          <div className="inline-flex flex-col items-center rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5">
                            <span className="text-sm font-semibold text-blue-300">
                              {config.totalMarks}
                            </span>

                            {config.passingMarks !== null &&
                              config.passingMarks !== undefined && (
                                <span className="text-[10px] text-gray-400">
                                  Pass: {config.passingMarks}
                                </span>
                              )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">N/A</span>
                        )}
                      </td>
                    );
                  })}

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openMarksModal(item)}
                        className="p-2 bg-green-500/20 rounded-lg cursor-pointer text-green-400"
                        title="Configure Marks"
                      >
                        <Settings size={16} />
                      </button>

                      <button
                        onClick={() => openTopicsModal(item)}
                        className="p-2 bg-purple-500/20 rounded-lg cursor-pointer text-purple-400"
                        title="Manage Topics"
                      >
                        <BookOpen size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 bg-red-500/20 rounded-lg cursor-pointer text-red-400"
                        title="Remove Subject From Class"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <MarksConfigurationModal
        isOpen={showMarks}
        onClose={handleMarksModalClose}
        subjectData={selectedSubject}
      />

      <SubjectTopicsModal
        isOpen={showTopics}
        onClose={() => {
          setShowTopics(false);
          setSelectedSubject(null);
        }}
        subjectData={selectedSubject}
      />
    </>
  );
}
