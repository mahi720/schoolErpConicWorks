import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Loader2, Search } from "lucide-react";

import AssignStreamModal from "../../components/academics/stream&SectionManager/AssignStreamModal";
import AssignSectionModal from "../../components/academics/stream&SectionManager/AssignSectionModal";
import PromoteStudentModal from "../../components/academics/PromotionModal/PromoteStudentModal";

import { useSessionStore } from "../../store/master/session/sessionStore";
import { useStudentAcademicMappingStore } from "../../store/academic/studentAcademicMapping/studentAcademicMappingStore";

const initialFilters = {
  session: "",
  board: "",
  classTitle: "",
  streamSlug: "",
  sectionSlug: "",
  search: "",
};

export default function StudentPromotion() {
  const [selected, setSelected] = useState([]);
  const [targetSelected, setTargetSelected] = useState([]);

  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);

  const [sourceFilters, setSourceFilters] = useState(initialFilters);
  const [targetFilters, setTargetFilters] = useState(initialFilters);
  // const [pendingTargetAcademic, setPendingTargetAcademic] = useState(null);
  const [autoSelectingTarget, setAutoSelectingTarget] = useState(false);

  const [sourceBoards, setSourceBoards] = useState([]);
  const [targetBoards, setTargetBoards] = useState([]);

  const [sourceStudents, setSourceStudents] = useState([]);
  const [targetStudents, setTargetStudents] = useState([]);

  const [sourceSetupLoading, setSourceSetupLoading] = useState(false);
  const [targetSetupLoading, setTargetSetupLoading] = useState(false);

  const [sourceStudentLoading, setSourceStudentLoading] = useState(false);
  const [targetStudentLoading, setTargetStudentLoading] = useState(false);

  const {
    sessions,
    loading: sessionLoading,
    fetchSessions,
  } = useSessionStore();

  const { fetchAcademicSetup, fetchMappedStudents, resetStudentLists } =
    useStudentAcademicMappingStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    let isActive = true;

    const loadSourceSetup = async () => {
      setSourceBoards([]);
      setSourceStudents([]);
      setSelected([]);

      setSourceFilters((current) => ({
        ...current,
        board: "",
        classTitle: "",
        streamSlug: "",
        sectionSlug: "",
      }));

      if (!sourceFilters.session) {
        return;
      }

      try {
        setSourceSetupLoading(true);

        await fetchAcademicSetup(sourceFilters.session);

        if (!isActive) {
          return;
        }

        const latestBoards =
          useStudentAcademicMappingStore.getState().boards || [];

        setSourceBoards(latestBoards);
      } catch (error) {
        if (isActive) {
          setSourceBoards([]);
        }
      } finally {
        if (isActive) {
          setSourceSetupLoading(false);
        }
      }
    };

    loadSourceSetup();

    return () => {
      isActive = false;
    };
  }, [sourceFilters.session, fetchAcademicSetup]);

  useEffect(() => {
    setSourceStudents([]);
    setSelected([]);

    setSourceFilters((current) => ({
      ...current,
      classTitle: "",
      streamSlug: "",
      sectionSlug: "",
    }));
  }, [sourceFilters.board]);

  useEffect(() => {
    let isActive = true;

    const loadTargetSetup = async () => {
      if (autoSelectingTarget) {
        return;
      }

      setTargetBoards([]);
      setTargetStudents([]);
      setTargetSelected([]);

      setTargetFilters((current) => ({
        ...current,
        board: "",
        classTitle: "",
        streamSlug: "",
        sectionSlug: "",
      }));

      if (!targetFilters.session) {
        return;
      }

      try {
        setTargetSetupLoading(true);

        await fetchAcademicSetup(targetFilters.session);

        if (!isActive) {
          return;
        }

        const latestBoards =
          useStudentAcademicMappingStore.getState().boards || [];

        setTargetBoards(latestBoards);
      } catch (error) {
        if (isActive) {
          setTargetBoards([]);
        }
      } finally {
        if (isActive) {
          setTargetSetupLoading(false);
        }
      }
    };

    loadTargetSetup();

    return () => {
      isActive = false;
    };
  }, [targetFilters.session, fetchAcademicSetup]);

  // useEffect(() => {
  //   setTargetStudents([]);
  //   setTargetSelected([]);

  //   if (pendingTargetAcademic) {
  //     return;
  //   }

  //   setTargetFilters((current) => ({
  //     ...current,
  //     classTitle: "",
  //     streamSlug: "",
  //     sectionSlug: "",
  //   }));
  // }, [targetFilters.board, pendingTargetAcademic]);

  useEffect(() => {
    setTargetStudents([]);
    setTargetSelected([]);

    if (autoSelectingTarget) {
      return;
    }

    setTargetFilters((current) => ({
      ...current,
      classTitle: "",
      streamSlug: "",
      sectionSlug: "",
    }));
  }, [targetFilters.board]);

  useEffect(() => {
    setSourceStudents([]);
    setSelected([]);

    setSourceFilters((current) => ({
      ...current,
      streamSlug: "",
      sectionSlug: "",
    }));
  }, [sourceFilters.classTitle]);

  useEffect(() => {
    setTargetStudents([]);
    setTargetSelected([]);

    if (autoSelectingTarget) {
      return;
    }

    setTargetFilters((current) => ({
      ...current,
      streamSlug: "",
      sectionSlug: "",
    }));
  }, [targetFilters.classTitle]);

  useEffect(() => {
    const loadSourceStudents = async () => {
      if (
        !sourceFilters.session ||
        !sourceFilters.board ||
        !sourceFilters.classTitle
      ) {
        setSourceStudents([]);
        setSelected([]);

        return;
      }

      try {
        setSourceStudentLoading(true);
        setSelected([]);

        resetStudentLists();

        await fetchMappedStudents({
          session: sourceFilters.session,
          board: sourceFilters.board,
          classTitle: sourceFilters.classTitle,
          status: "all",
        });

        const latestStudents =
          useStudentAcademicMappingStore.getState().mappedStudents || [];

        setSourceStudents(normalizeMappedStudents(latestStudents));
      } finally {
        setSourceStudentLoading(false);
      }
    };

    loadSourceStudents();
  }, [
    sourceFilters.session,
    sourceFilters.board,
    sourceFilters.classTitle,
    fetchMappedStudents,
    resetStudentLists,
  ]);

  useEffect(() => {
    let isActive = true;

    const loadTargetStudents = async () => {
      if (autoSelectingTarget) {
        return;
      }

      if (
        !targetFilters.session ||
        !targetFilters.board ||
        !targetFilters.classTitle
      ) {
        setTargetStudents([]);
        setTargetSelected([]);

        return;
      }

      try {
        setTargetStudentLoading(true);
        setTargetSelected([]);

        await fetchMappedStudents({
          session: targetFilters.session,
          board: targetFilters.board,
          classTitle: targetFilters.classTitle,
          status: "all",
        });

        if (!isActive) {
          return;
        }

        const latestStudents =
          useStudentAcademicMappingStore.getState().mappedStudents || [];

        setTargetStudents(normalizeMappedStudents(latestStudents));
      } finally {
        if (isActive) {
          setTargetStudentLoading(false);
        }
      }
    };

    loadTargetStudents();

    return () => {
      isActive = false;
    };
  }, [
    targetFilters.session,
    targetFilters.board,
    targetFilters.classTitle,
    fetchMappedStudents,
  ]);

  const sourceBoardData = useMemo(() => {
    return sourceBoards.find((board) => board.title === sourceFilters.board);
  }, [sourceBoards, sourceFilters.board]);

  const targetBoardData = useMemo(() => {
    return targetBoards.find((board) => board.title === targetFilters.board);
  }, [targetBoards, targetFilters.board]);

  const sourceClasses = useMemo(() => {
    return sourceBoardData?.classes || [];
  }, [sourceBoardData]);

  const targetClasses = useMemo(() => {
    return targetBoardData?.classes || [];
  }, [targetBoardData]);

  const sourceClassData = useMemo(() => {
    return sourceClasses.find(
      (classItem) => classItem.classTitle === sourceFilters.classTitle,
    );
  }, [sourceClasses, sourceFilters.classTitle]);

  const targetClassData = useMemo(() => {
    return targetClasses.find(
      (classItem) => classItem.classTitle === targetFilters.classTitle,
    );
  }, [targetClasses, targetFilters.classTitle]);

  const sourceSections = sourceClassData?.sections || [];
  const sourceStreams = sourceClassData?.streams || [];

  const targetSections = targetClassData?.sections || [];
  const targetStreams = targetClassData?.streams || [];

  const filteredSourceStudents = useMemo(() => {
    return filterStudents(sourceStudents, sourceFilters);
  }, [sourceStudents, sourceFilters]);

  const filteredTargetStudents = useMemo(() => {
    return filterStudents(targetStudents, targetFilters);
  }, [targetStudents, targetFilters]);

  const selectedStudents = useMemo(() => {
    return sourceStudents.filter((student) =>
      selected.includes(student.studentSlug),
    );
  }, [sourceStudents, selected]);

  const selectedTargetStudents = useMemo(() => {
    return targetStudents.filter((student) =>
      targetSelected.includes(student.studentSlug),
    );
  }, [targetStudents, targetSelected]);

  const hasTargetSelected = targetSelected.length > 0;

  const toggleSelect = (studentSlug) => {
    setSelected((current) =>
      current.includes(studentSlug)
        ? current.filter((slug) => slug !== studentSlug)
        : [...current, studentSlug],
    );
  };

  const toggleTargetSelect = (studentSlug) => {
    setTargetSelected((current) =>
      current.includes(studentSlug)
        ? current.filter((slug) => slug !== studentSlug)
        : [...current, studentSlug],
    );
  };

  const handleSourceFilterChange = (field, value) => {
    setSourceFilters((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === "streamSlug" || field === "sectionSlug") {
      setSelected([]);
    }
  };

  const handleTargetFilterChange = (field, value) => {
    setTargetFilters((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === "streamSlug" || field === "sectionSlug") {
      setTargetSelected([]);
    }
  };

  const refreshSourceStudents = async () => {
    if (
      !sourceFilters.session ||
      !sourceFilters.board ||
      !sourceFilters.classTitle
    ) {
      return;
    }

    try {
      setSourceStudentLoading(true);

      await fetchMappedStudents({
        session: sourceFilters.session,
        board: sourceFilters.board,
        classTitle: sourceFilters.classTitle,
        status: "all",
      });

      const latestStudents =
        useStudentAcademicMappingStore.getState().mappedStudents || [];

      setSourceStudents(normalizeMappedStudents(latestStudents));
      setSelected([]);
    } finally {
      setSourceStudentLoading(false);
    }
  };

  const refreshTargetStudents = async () => {
    if (
      !targetFilters.session ||
      !targetFilters.board ||
      !targetFilters.classTitle
    ) {
      return;
    }

    try {
      setTargetStudentLoading(true);

      await fetchMappedStudents({
        session: targetFilters.session,
        board: targetFilters.board,
        classTitle: targetFilters.classTitle,
        status: "all",
      });

      const latestStudents =
        useStudentAcademicMappingStore.getState().mappedStudents || [];

      setTargetStudents(normalizeMappedStudents(latestStudents));
      setTargetSelected([]);
    } finally {
      setTargetStudentLoading(false);
    }
  };

  const handlePromotionSuccess = async (targetAcademic) => {
    try {
      setAutoSelectingTarget(true);
      setTargetSetupLoading(true);
      setTargetStudentLoading(true);

      setSelected([]);
      setTargetSelected([]);
      setTargetStudents([]);

      await fetchAcademicSetup(targetAcademic.session);

      const latestBoards =
        useStudentAcademicMappingStore.getState().boards || [];

      setTargetBoards(latestBoards);

      const matchingBoard = latestBoards.find(
        (board) => board.title === targetAcademic.board,
      );

      const matchingClass = matchingBoard?.classes?.find(
        (classItem) => classItem.classTitle === targetAcademic.classTitle,
      );

      const finalBoard = matchingBoard?.title || targetAcademic.board;

      const finalClass = matchingClass?.classTitle || targetAcademic.classTitle;

      const finalTargetFilters = {
        session: targetAcademic.session,
        board: finalBoard,
        classTitle: finalClass,
        streamSlug: targetAcademic.streamSlug || "",
        sectionSlug: targetAcademic.sectionSlug || "",
        search: "",
      };

      setTargetFilters(finalTargetFilters);

      await fetchMappedStudents({
        session: targetAcademic.session,
        board: finalBoard,
        classTitle: finalClass,
        status: "all",
      });

      const latestStudents =
        useStudentAcademicMappingStore.getState().mappedStudents || [];

      setTargetStudents(normalizeMappedStudents(latestStudents));

      await refreshSourceStudents();
    } finally {
      setTargetSetupLoading(false);
      setTargetStudentLoading(false);

      window.setTimeout(() => {
        setAutoSelectingTarget(false);
      }, 0);
    }
  };
  return (
    <div className="space-y-8">
      {/* TITLE */}

      <h1 className="text-3xl font-bold text-white">Student Promotion</h1>

      {/* Rules */}

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-lg text-white mb-3">Promotion Rules</h2>

          <ul className="list-disc ml-5 space-y-2 text-gray-300">
            <li>Selected students must be eligible for promotion.</li>

            <li>Students must clear examination and dues.</li>

            <li>Leaving certificate students can't be promoted.</li>
          </ul>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-lg text-white mb-3">Important Notes</h2>

          <ul className="list-disc ml-5 space-y-2">
            <li className="text-red-400">Academic year should be different.</li>

            <li className="text-gray-300">Board will remain same.</li>

            <li className="text-yellow-400">
              Wrong promotion can be demoted later.
            </li>
          </ul>
        </div>
      </div>

      {/* Button */}

      <div className="flex justify-center">
        <button
          onClick={() => setShowPromoteModal(true)}
          disabled={selected.length === 0}
          className={`
        px-6 py-3 rounded-2xl
        flex items-center gap-3
        text-white

        ${
          selected.length
            ? "bg-indigo-600 cursor-pointer hover:bg-indigo-700"
            : "bg-gray-700 cursor-not-allowed"
        }

        `}
        >
          Promote
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Source Target */}

      <div className="grid grid-cols-2 gap-8">
        {/* Source */}

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 space-y-5">
          <h2 className="text-xl text-white">Source Class</h2>

          <div className="flex gap-3">
            {/* Academic Year */}

            <select
              value={sourceFilters.session}
              onChange={(event) =>
                handleSourceFilterChange("session", event.target.value)
              }
              disabled={sessionLoading}
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {sessionLoading ? "Loading..." : "Select Acd. Year"}
              </option>

              {sessions.map((session) => (
                <option key={session.slug} value={session.name}>
                  {session.name}
                </option>
              ))}
            </select>

            {/* Board */}

            <select
              value={sourceFilters.board}
              onChange={(event) =>
                handleSourceFilterChange("board", event.target.value)
              }
              disabled={!sourceFilters.session || sourceSetupLoading}
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {sourceSetupLoading ? "Loading..." : "Select Board"}
              </option>

              {sourceBoards.map((board) => (
                <option key={board.slug} value={board.title}>
                  {board.title}
                </option>
              ))}
            </select>

            {/* Class */}

            <select
              value={sourceFilters.classTitle}
              onChange={(event) =>
                handleSourceFilterChange("classTitle", event.target.value)
              }
              disabled={!sourceFilters.board}
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Select Class</option>

              {sourceClasses.map((classItem) => (
                <option key={classItem.slug} value={classItem.classTitle}>
                  {classItem.classTitle}
                </option>
              ))}
            </select>
          </div>

          <Filter
            filters={sourceFilters}
            sections={sourceSections}
            streams={sourceStreams}
            onChange={handleSourceFilterChange}
            disabled={!sourceFilters.classTitle}
          />

          <StudentTable
            data={filteredSourceStudents}
            selected={selected}
            setSelected={setSelected}
            toggleSelect={toggleSelect}
            loading={sourceStudentLoading}
            filterReady={
              sourceFilters.session &&
              sourceFilters.board &&
              sourceFilters.classTitle
            }
          />
        </div>

        {/* Target */}

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-white">Target Class</h2>

            <div className="flex gap-3">
              <button
                disabled={!hasTargetSelected}
                onClick={() => hasTargetSelected && setShowStreamModal(true)}
                className={`px-4 py-2 rounded-xl text-white transition-all
              ${
                hasTargetSelected
                  ? "bg-indigo-600 cursor-pointer hover:bg-indigo-700"
                  : "bg-gray-700 opacity-50 cursor-not-allowed pointer-events-none"
              }`}
              >
                Assign Stream
              </button>

              <button
                disabled={!hasTargetSelected}
                onClick={() => hasTargetSelected && setShowSectionModal(true)}
                className={`px-4 py-2 rounded-xl text-white transition-all
              ${
                hasTargetSelected
                  ? "bg-pink-500 cursor-pointer hover:bg-pink-600"
                  : "bg-gray-700 opacity-50 cursor-not-allowed pointer-events-none"
              }`}
              >
                Assign Section
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            {/* Academic Year */}

            <select
              value={targetFilters.session}
              onChange={(event) =>
                handleTargetFilterChange("session", event.target.value)
              }
              disabled={sessionLoading}
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {sessionLoading ? "Loading..." : "Select Acd. Year"}
              </option>

              {sessions.map((session) => (
                <option key={session.slug} value={session.name}>
                  {session.name}
                </option>
              ))}
            </select>

            {/* Board */}

            <select
              value={targetFilters.board}
              onChange={(event) =>
                handleTargetFilterChange("board", event.target.value)
              }
              disabled={!targetFilters.session || targetSetupLoading}
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {targetSetupLoading ? "Loading..." : "Select Board"}
              </option>

              {targetBoards.map((board) => (
                <option key={board.slug} value={board.title}>
                  {board.title}
                </option>
              ))}
            </select>

            {/* Class */}

            <select
              value={targetFilters.classTitle}
              onChange={(event) =>
                handleTargetFilterChange("classTitle", event.target.value)
              }
              disabled={!targetFilters.board}
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Select Class</option>

              {targetClasses.map((classItem) => (
                <option key={classItem.slug} value={classItem.classTitle}>
                  {classItem.classTitle}
                </option>
              ))}
            </select>
          </div>

          <Filter
            filters={targetFilters}
            sections={targetSections}
            streams={targetStreams}
            onChange={handleTargetFilterChange}
            disabled={!targetFilters.classTitle}
          />

          <StudentTable
            data={filteredTargetStudents}
            selected={targetSelected}
            setSelected={setTargetSelected}
            toggleSelect={toggleTargetSelect}
            loading={targetStudentLoading}
            filterReady={
              targetFilters.session &&
              targetFilters.board &&
              targetFilters.classTitle
            }
          />
        </div>
      </div>

      <AssignStreamModal
        isOpen={showStreamModal}
        onClose={() => setShowStreamModal(false)}
        selectedStudents={selectedTargetStudents}
        streams={targetStreams}
        session={targetFilters.session}
        board={targetFilters.board}
        classTitle={targetFilters.classTitle}
        onSuccess={refreshTargetStudents}
      />

      <AssignSectionModal
        isOpen={showSectionModal}
        onClose={() => setShowSectionModal(false)}
        selectedStudents={selectedTargetStudents}
        sections={targetSections}
        session={targetFilters.session}
        board={targetFilters.board}
        classTitle={targetFilters.classTitle}
        onSuccess={refreshTargetStudents}
      />

      <PromoteStudentModal
        isOpen={showPromoteModal}
        onClose={() => setShowPromoteModal(false)}
        selectedStudents={selectedStudents}
        sourceAcademic={{
          session: sourceFilters.session,
          board: sourceFilters.board,
          classTitle: sourceFilters.classTitle,
          sectionSlug: sourceFilters.sectionSlug || null,
          streamSlug: sourceFilters.streamSlug || null,
        }}
        onSuccess={handlePromotionSuccess}
      />
    </div>
  );
}

function Filter({ filters, sections, streams, onChange, disabled }) {
  return (
    <div className="flex gap-3">
      <select
        value={filters.streamSlug}
        onChange={(event) => onChange("streamSlug", event.target.value)}
        disabled={disabled}
        className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">Select Stream</option>

        {streams.map((stream) => (
          <option key={stream.slug} value={stream.slug}>
            {stream.streamTitle || stream.title || stream.name}
          </option>
        ))}
      </select>

      <select
        value={filters.sectionSlug}
        onChange={(event) => onChange("sectionSlug", event.target.value)}
        disabled={disabled}
        className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">Select Section</option>

        {sections.map((section) => (
          <option key={section.slug} value={section.slug}>
            {section.sectionTitle || section.title || section.name}
          </option>
        ))}
      </select>

      <div className="relative flex-1">
        <Search size={18} className="absolute left-3 top-4 text-gray-400" />

        <input
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Search Student"
          className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 pl-10 text-white"
        />
      </div>
    </div>
  );
}

function StudentTable({
  data,
  setSelected,
  selected,
  toggleSelect,
  loading,
  filterReady,
}) {
  const selectableSlugs = data.map((item) => item.studentSlug).filter(Boolean);

  const allSelected =
    selectableSlugs.length > 0 &&
    selectableSlugs.every((slug) => selected.includes(slug));

  const selectAll = (event) => {
    if (event.target.checked) {
      setSelected(selectableSlugs);

      return;
    }

    setSelected([]);
  };

  return (
    <div className="custom-scrollbar custom-scrollbar-horizontal max-h-[500px] overflow-x-auto overflow-y-auto">
      <table className="w-full">
        <thead className="bg-gray-800 sticky top-0 z-10">
          <tr>
            <th className="p-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={selectAll}
                disabled={!setSelected || data.length === 0}
              />
            </th>

            <th className="p-3 text-left text-gray-300">SN.</th>

            <th className="p-3 text-left text-gray-300">Roll</th>

            <th className="p-3 text-left text-gray-300">Name</th>

            <th className="p-3 text-left text-gray-300">Stream</th>

            <th className="p-3 text-left text-gray-300">Section</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="p-10">
                <div className="flex items-center justify-center gap-3 text-gray-400">
                  <Loader2 size={20} className="animate-spin" />
                  Loading students...
                </div>
              </td>
            </tr>
          ) : !filterReady ? (
            <tr>
              <td colSpan={6} className="p-10 text-center text-gray-400">
                Select academic year, board and class.
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-10 text-center text-gray-400">
                No students found.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.mappingSlug || item.studentSlug}
                className="border-t border-gray-800"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.studentSlug)}
                    onChange={() =>
                      toggleSelect && toggleSelect(item.studentSlug)
                    }
                  />
                </td>

                <td className="p-3 text-white">{index + 1}.</td>

                <td className="p-3 text-white">{item.roll}</td>

                <td className="p-3 text-white">{item.name}</td>

                <td className="p-3">
                  <span className="px-5 py-2 border border-indigo-500 rounded-lg text-indigo-400">
                    {item.stream}
                  </span>
                </td>

                <td className="p-3">
                  <span className="px-5 py-2 border border-red-500 rounded-lg text-red-400">
                    {item.section}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function normalizeMappedStudents(students = []) {
  return students
    .filter(
      (mapping) =>
        mapping.isActive !== false && mapping.academicStatus !== "PROMOTED",
    )
    .map((mapping) => {
      const student = mapping.student || {};

      return {
        mappingSlug: mapping.slug,

        studentSlug: student.slug || mapping.studentSlug,

        roll:
          mapping.formattedRollNumber ||
          mapping.rollNumber ||
          mapping.rollNo ||
          "-",

        name: student.studentName || student.name || "-",

        admissionNumber: student.admissionNumber || "-",

        streamSlug: mapping.stream?.slug || mapping.streamSlug || null,

        stream:
          mapping.stream?.streamTitle ||
          mapping.stream?.title ||
          mapping.stream?.name ||
          "NA",

        sectionSlug: mapping.section?.slug || mapping.sectionSlug || null,

        section:
          mapping.section?.sectionTitle ||
          mapping.section?.title ||
          mapping.section?.name ||
          "NA",
      };
    })
    .filter((student) => student.studentSlug);
}

function filterStudents(students, filters) {
  const searchText = filters.search.trim().toLowerCase();

  return students.filter((student) => {
    const matchesStream =
      !filters.streamSlug || student.streamSlug === filters.streamSlug;

    const matchesSection =
      !filters.sectionSlug || student.sectionSlug === filters.sectionSlug;

    const matchesSearch =
      !searchText ||
      student.name.toLowerCase().includes(searchText) ||
      student.admissionNumber.toLowerCase().includes(searchText) ||
      String(student.roll).toLowerCase().includes(searchText);

    return matchesStream && matchesSection && matchesSearch;
  });
}
