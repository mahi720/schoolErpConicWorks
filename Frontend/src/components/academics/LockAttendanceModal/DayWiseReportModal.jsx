import React, { useMemo } from "react";
import { CalendarDays, Loader2, X } from "lucide-react";

const STATUS_CONFIG = {
  P: {
    label: "Present",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },

  PRESENT: {
    label: "Present",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },

  A: {
    label: "Absent",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
  },

  ABSENT: {
    label: "Absent",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
  },

  L: {
    label: "Leave",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },

  LEAVE: {
    label: "Leave",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },

  HD: {
    label: "Half Day",
    className: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  },

  HALF_DAY: {
    label: "Half Day",
    className: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  },

  "HALF DAY": {
    label: "Half Day",
    className: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  },

  H: {
    label: "Holiday",
    className: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  },

  HOLIDAY: {
    label: "Holiday",
    className: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  },

  SUNDAY: {
    label: "Sunday",
    className: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  },

  NOT_MARKED: {
    label: "Not Marked",
    className: "bg-gray-700/60 text-gray-300 border-gray-600",
  },
};

const normalizeStatus = (status) => {
  if (!status) return "NOT_MARKED";

  return String(status)
    .trim()
    .toUpperCase()
    .replaceAll("-", "_")
    .replaceAll(" ", "_");
};

const getDateKey = (date) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const year = parsedDate.getUTCFullYear();
  const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (year, month, day) => {
  return `${String(day).padStart(2, "0")}/${String(month).padStart(
    2,
    "0",
  )}/${year}`;
};

const getMonthName = (year, month) => {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
};

const getDayName = (year, month, day) => {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

export default function DayWiseReportModal({
  open,
  close,
  report = null,
  loading = false,
}) {
  const year = Number(report?.year);
  const month = Number(report?.month);

  /*
   * Backend response mein inmein se koi bhi array ho,
   * component support karega.
   */
  const attendanceDays =
    report?.attendanceDays ||
    report?.days ||
    report?.studentAttendanceDays ||
    [];

  /*
   * Monthly attendance JSON ko bhi support karega:
   *
   * {
   *   "01": "P",
   *   "02": "A",
   *   "03": "L"
   * }
   */
  const attendanceJson =
    report?.attendance && typeof report.attendance === "object"
      ? report.attendance
      : {};

  const attendanceMap = useMemo(() => {
    const map = new Map();

    attendanceDays.forEach((item) => {
      const dateKey = getDateKey(item.attendanceDate || item.date);

      if (!dateKey) return;

      map.set(dateKey, item);
    });

    return map;
  }, [attendanceDays]);

  const monthDays = useMemo(() => {
    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      return [];
    }

    const totalDays = new Date(Date.UTC(year, month, 0)).getUTCDate();

    return Array.from({ length: totalDays }, (_, index) => {
      const day = index + 1;

      const dateObject = new Date(Date.UTC(year, month - 1, day));

      const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(
        day,
      ).padStart(2, "0")}`;

      const attendanceRecord = attendanceMap.get(dateKey);

      const jsonDayKey = String(day).padStart(2, "0");

      const storedStatus =
        attendanceRecord?.attendanceStatus ||
        attendanceRecord?.status ||
        attendanceJson?.[jsonDayKey] ||
        null;

      const normalizedStoredStatus = normalizeStatus(storedStatus);

      const isSunday = dateObject.getUTCDay() === 0;

      /*
       * Stored Holiday ko Sunday se priority di गई है.
       * Agar koi attendance manually marked hai,
       * woh bhi Sunday se priority lega.
       */
      let finalStatus = normalizedStoredStatus;

      if (finalStatus === "NOT_MARKED" && isSunday) {
        finalStatus = "SUNDAY";
      }

      const statusConfig =
        STATUS_CONFIG[finalStatus] || STATUS_CONFIG.NOT_MARKED;

      return {
        day,
        dateKey,
        formattedDate: formatDate(year, month, day),
        dayName: getDayName(year, month, day),
        isSunday,
        attendanceRecord,
        status: finalStatus,
        statusConfig,
      };
    });
  }, [year, month, attendanceMap, attendanceJson]);

  const summary = useMemo(() => {
    return monthDays.reduce(
      (result, item) => {
        switch (item.status) {
          case "P":
          case "PRESENT":
            result.present += 1;
            break;

          case "A":
          case "ABSENT":
            result.absent += 1;
            break;

          case "L":
          case "LEAVE":
            result.leave += 1;
            break;

          case "HD":
          case "HALF_DAY":
            result.halfDay += 1;
            break;

          case "H":
          case "HOLIDAY":
            result.holiday += 1;
            break;

          case "SUNDAY":
            result.sunday += 1;
            break;

          default:
            result.notMarked += 1;
            break;
        }

        return result;
      },
      {
        present: 0,
        absent: 0,
        leave: 0,
        halfDay: 0,
        holiday: 0,
        sunday: 0,
        notMarked: 0,
      },
    );
  }, [monthDays]);

  if (!open) return null;

  const studentName =
    report?.student?.studentName || report?.studentName || "Student";

  const admissionNumber =
    report?.student?.admissionNumber || report?.admissionNumber || "-";

  const rollNumberPrefix = report?.rollNumberPrefix || "";

  const rollNumber = report?.rollNumber ?? "-";

  const monthTitle =
    Number.isInteger(year) && Number.isInteger(month)
      ? getMonthName(year, month)
      : "-";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm">
      <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
        {/* Header */}

        <div className="flex items-start justify-between gap-4 border-b border-gray-800 p-5">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Attendance Report
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {studentName} • {monthTitle}
            </p>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              <span>
                Admission No:{" "}
                <span className="text-gray-300">{admissionNumber}</span>
              </span>

              <span>
                Roll No:{" "}
                <span className="text-gray-300">
                  {rollNumberPrefix}
                  {rollNumber}
                </span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={close}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Summary */}

        {!loading && monthDays.length > 0 && (
          <div className="grid grid-cols-2 gap-2 border-b border-gray-800 p-4 sm:grid-cols-4 lg:grid-cols-7">
            <SummaryItem label="Present" value={summary.present} />

            <SummaryItem label="Absent" value={summary.absent} />

            <SummaryItem label="Leave" value={summary.leave} />

            <SummaryItem label="Half Day" value={summary.halfDay} />

            <SummaryItem label="Holiday" value={summary.holiday} />

            <SummaryItem label="Sunday" value={summary.sunday} />

            <SummaryItem label="Not Marked" value={summary.notMarked} />
          </div>
        )}

        {/* Body */}

        <div className="custom-scrollbar flex-1 overflow-x-auto overflow-y-auto">
          {loading ? (
            <div className="flex min-h-72 items-center justify-center">
              <div className="flex items-center gap-3 text-gray-400">
                <Loader2 size={22} className="animate-spin" />
                Loading attendance report...
              </div>
            </div>
          ) : monthDays.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-gray-500">
              <CalendarDays size={40} />

              <p className="mt-3">Attendance report not available</p>
            </div>
          ) : (
            <table className="w-full min-w-[600px]">
              <thead className="sticky top-0 z-10 bg-gray-800">
                <tr>
                  <th className="whitespace-nowrap p-3 text-left text-sm font-medium text-gray-300">
                    Date
                  </th>

                  <th className="whitespace-nowrap p-3 text-left text-sm font-medium text-gray-300">
                    Day
                  </th>

                  <th className="whitespace-nowrap p-3 text-left text-sm font-medium text-gray-300">
                    Status
                  </th>

                  <th className="whitespace-nowrap p-3 text-left text-sm font-medium text-gray-300">
                    Locked
                  </th>
                </tr>
              </thead>

              <tbody>
                {monthDays.map((item) => (
                  <tr
                    key={item.dateKey}
                    className="border-t border-gray-800 transition hover:bg-gray-800/40"
                  >
                    <td className="whitespace-nowrap p-3 text-sm text-white">
                      {item.formattedDate}
                    </td>

                    <td className="whitespace-nowrap p-3 text-sm text-gray-400">
                      {item.dayName}
                    </td>

                    <td className="whitespace-nowrap p-3">
                      <span
                        className={`inline-flex rounded-lg border px-3 py-1 text-xs font-medium ${item.statusConfig.className}`}
                      >
                        {item.statusConfig.label}
                      </span>
                    </td>

                    <td className="whitespace-nowrap p-3 text-sm text-gray-400">
                      {item.attendanceRecord?.isLocked ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}

        <div className="flex justify-end border-t border-gray-800 p-4">
          <button
            type="button"
            onClick={close}
            className="rounded-xl bg-gray-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-3 text-center">
      <p className="text-lg font-semibold text-white">{value}</p>

      <p className="mt-1 whitespace-nowrap text-xs text-gray-500">{label}</p>
    </div>
  );
}
