import React, { useEffect, useMemo, useState } from "react";
import { Download, Loader2, Pencil, RotateCcw, Trash2 } from "lucide-react";

import CreateAcademicEventModal from "../../components/academics/AcademicCalendarModal/CreateAcademicEventModal";

import { useSessionStore } from "../../store/master/session/sessionStore";
import { useAcademicCalendarStore } from "../../store/academic/academicCalender/academicCalendarStore";

export default function AcademicCalendar() {
  const [activeTab, setActiveTab] = useState("Academic Calendar");
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSession, setSelectedSession] = useState("");

  const {
    sessions,
    loading: sessionLoading,
    fetchSessions,
  } = useSessionStore();

  const {
    academicCalendars,
    loading,
    submitLoading,
    fetchAcademicCalendars,
    createAcademicCalendar,
    updateAcademicCalendar,
    deleteAcademicCalendar,
    restoreAcademicCalendar,
  } = useAcademicCalendarStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    const params = {
      status: "all",
    };

    if (selectedSession) {
      params.session = selectedSession;
    }

    fetchAcademicCalendars(params);
  }, [selectedSession, fetchAcademicCalendars]);

  const holidayData = useMemo(() => {
    return academicCalendars.filter(
      (item) => item.isHoliday || item.category === "HOLIDAY",
    );
  }, [academicCalendars]);

  const displayedData =
    activeTab === "Academic Calendar" ? academicCalendars : holidayData;

  const handleOpenCreateModal = () => {
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleOpenEditModal = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleCloseModal = () => {
    if (submitLoading) return;

    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const handleCreate = async (payload) => {
    return createAcademicCalendar(payload);
  };

  const handleUpdate = async (slug, payload) => {
    return updateAcademicCalendar(slug, payload);
  };

  const handleDelete = async (slug) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this academic event?",
    );

    if (!confirmed) return;

    await deleteAcademicCalendar(slug);
  };

  const handleRestore = async (slug) => {
    await restoreAcademicCalendar(slug);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateRange = (startDate, endDate) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const formatCategory = (category) => {
    if (!category) return "-";

    return category
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const downloadCSV = (data, fileName) => {
    if (!data.length) return;

    const headers = [
      "SN",
      "Academic Year",
      "Start Date",
      "End Date",
      "Title",
      "Description",
      "Category",
      "Holiday",
      "Status",
      "Color",
    ];

    const rows = data.map((item, index) => [
      index + 1,
      item.session || "",
      formatDate(item.startDate),
      formatDate(item.endDate),
      item.title || "",
      item.description || "",
      formatCategory(item.category),
      item.isHoliday ? "Yes" : "No",
      item.isActive ? "Active" : "Inactive",
      item.color || "",
    ]);

    const escapeCSVValue = (value) => {
      const stringValue = String(value ?? "");
      return `"${stringValue.replace(/"/g, '""')}"`;
    };

    const csvContent = [
      headers.map(escapeCSVValue).join(","),
      ...rows.map((row) => row.map(escapeCSVValue).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${fileName}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Academic Calendar</h1>

        <div className="flex flex-wrap gap-3">
          <select
            value={selectedSession}
            onChange={(event) => setSelectedSession(event.target.value)}
            disabled={sessionLoading}
            className="cursor-pointer rounded-xl border border-gray-700 bg-gray-800 px-6 py-3 text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">All Academic Years</option>

            {sessions.map((session) => (
              <option key={session.slug || session.name} value={session.name}>
                {session.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => downloadCSV(holidayData, "academic-holidays-list")}
            disabled={!holidayData.length}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-blue-500 px-4 py-3 text-gray-300 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={17} />
            Download Holidays List
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="cursor-pointer rounded-xl border border-indigo-500 px-5 py-3 text-gray-300 transition hover:bg-indigo-700"
          >
            Create Academic Calendar
          </button>

          <button
            type="button"
            onClick={() => downloadCSV(academicCalendars, "academic-calendar")}
            disabled={!academicCalendars.length}
            className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-3 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            title="Download Academic Calendar"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-800 p-2">
        {["Academic Calendar", "Holidays"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer rounded-lg p-3 transition ${
              activeTab === tab
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700/50"
            }`}
          >
            {tab}

            {tab === "Holidays" && (
              <span className="ml-2 rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                {holidayData.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <div className="custom-scrollbar max-h-[70vh] overflow-x-auto overflow-y-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="sticky top-0 z-10 bg-gray-800">
              <tr>
                <th className="p-4 text-left text-gray-300">SN.</th>

                {/* <th className="p-4 text-left text-gray-300">Academic Year</th> */}

                <th className="p-4 text-left text-gray-300">Date</th>

                <th className="p-4 text-left text-gray-300">Title</th>

                <th className="p-4 text-left text-gray-300">Description</th>

                {activeTab === "Academic Calendar" && (
                  <>
                    <th className="p-4 text-left text-gray-300">Category</th>

                    <th className="p-4 text-left text-gray-300">Status</th>

                    <th className="p-4 text-center text-gray-300">Actions</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={activeTab === "Academic Calendar" ? 8 : 5}
                    className="p-10"
                  >
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Loader2 size={22} className="animate-spin" />
                      Loading academic calendar...
                    </div>
                  </td>
                </tr>
              ) : displayedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeTab === "Academic Calendar" ? 8 : 5}
                    className="p-10 text-center text-gray-400"
                  >
                    {activeTab === "Holidays"
                      ? "No holidays found"
                      : "No academic events found"}
                  </td>
                </tr>
              ) : (
                displayedData.map((item, index) => (
                  <tr
                    key={item.slug}
                    className="border-t border-gray-800 transition hover:bg-gray-800/40"
                  >
                    <td className="p-4 text-gray-300">{index + 1}.</td>

                    {/* <td className="p-4 text-gray-300">{item.session || "-"}</td> */}

                    <td className="whitespace-nowrap p-4 text-gray-300">
                      {formatDateRange(item.startDate, item.endDate)}
                    </td>

                    <td className="p-4 text-gray-300">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-4 w-4 shrink-0 rounded-full border border-white/20"
                          style={{
                            backgroundColor: item.color || "#6366f1",
                          }}
                        />

                        <span className="font-medium">{item.title}</span>
                      </div>
                    </td>

                    <td className="p-4 text-gray-300">
                      <p className="max-w-md">{item.description || "-"}</p>
                    </td>

                    {activeTab === "Academic Calendar" && (
                      <>
                        <td className="p-4 text-gray-300">
                          <span
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-sm"
                            style={{
                              backgroundColor: `${item.color || "#6366f1"}20`,
                              // color: item.color || "#818cf8",
                              color: "#c6cdcb",
                            }}
                          >
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: item.color || "#6366f1",
                              }}
                            />

                            {formatCategory(item.category)}
                          </span>
                        </td>

                        <td className="p-4">
                          <span
                            className={`rounded-lg px-3 py-1 text-sm ${
                              item.isActive
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            {item.isActive ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(item)}
                                  disabled={submitLoading}
                                  className="cursor-pointer rounded-lg bg-indigo-600 p-2 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Edit"
                                >
                                  <Pencil size={16} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDelete(item.slug)}
                                  disabled={submitLoading}
                                  className="cursor-pointer rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRestore(item.slug)}
                                disabled={submitLoading}
                                className="cursor-pointer rounded-lg bg-emerald-600 p-2 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Restore"
                              >
                                <RotateCcw size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateAcademicEventModal
        isOpen={showEventModal}
        onClose={handleCloseModal}
        eventData={selectedEvent}
        sessions={sessions}
        defaultSession={selectedSession}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        loading={submitLoading}
      />
    </div>
  );
}
