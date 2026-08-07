import React, { useEffect, useMemo, useState } from "react";
import { Edit, Loader2, RotateCcw, Trash2 } from "lucide-react";

import BasicSettingModal from "../../../components/HRM/Settings/BasicSettingModal";

import { useBasicSettingStore } from "../../../store/hrm/settings/basicSetting/basicSettingStore";

const weekDayOrder = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  "2ND_SATURDAY": 7,
  "4TH_SATURDAY": 8,
  SUNDAY: 9,
};

const getWeekDayLabel = (value) => {
  const labels = {
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
    "2ND_SATURDAY": "2nd Saturday",
    "4TH_SATURDAY": "4th Saturday",
    SUNDAY: "Sunday",
  };

  return labels[value] || value?.replaceAll("_", " ") || "-";
};

const formatTime = (value) => {
  if (!value) return "-";

  if (typeof value === "string" && /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
    const [hours, minutes] = value.split(":").map(Number);

    const suffix = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${String(formattedHours).padStart(2, "0")}:${String(
      minutes,
    ).padStart(2, "0")} ${suffix}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
};

export default function BasicSettings() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [yearStart, setYearStart] = useState("April");

  const {
    basicSettings,
    loading,
    submitLoading,
    fetchBasicSettings,
    deleteBasicSetting,
    restoreBasicSetting,
  } = useBasicSettingStore();

  useEffect(() => {
    fetchBasicSettings();
  }, [fetchBasicSettings]);

  const sortedBasicSettings = useMemo(() => {
    return [...basicSettings].sort((first, second) => {
      const firstCreatedAt = new Date(first.createdAt).getTime();

      const secondCreatedAt = new Date(second.createdAt).getTime();

      if (firstCreatedAt !== secondCreatedAt) {
        return firstCreatedAt - secondCreatedAt;
      }

      const firstDay = weekDayOrder[first.weekDay] || 999;

      const secondDay = weekDayOrder[second.weekDay] || 999;

      return firstDay - secondDay;
    });
  }, [basicSettings]);

  const handleAdd = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEdit = (item) => {
    if (!item.isActive) return;

    setEditData(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  const handleDelete = async (item) => {
    const departmentName =
      item.department?.departmentName ||
      item.departmentName ||
      "selected department";

    const confirmed = window.confirm(
      `Kya aap ${departmentName} ke ${getWeekDayLabel(
        item.weekDay,
      )} setting ko inactive karna chahte hain?`,
    );

    if (!confirmed) return;

    const success = await deleteBasicSetting(item.slug);

    if (success && editData?.slug === item.slug) {
      handleClose();
    }
  };

  const handleRestore = async (item) => {
    const departmentName =
      item.department?.departmentName ||
      item.departmentName ||
      "selected department";

    const confirmed = window.confirm(
      `Kya aap ${departmentName} ke ${getWeekDayLabel(
        item.weekDay,
      )} setting ko restore karna chahte hain?`,
    );

    if (!confirmed) return;

    await restoreBasicSetting(item.slug);
  };

  const getDepartmentName = (item) => {
    return item.department?.departmentName || item.departmentName || "-";
  };

  const getShiftDisplay = (item) => {
    if (item.dayType === "HOLIDAY") {
      return "Holiday";
    }

    const shift = item.shift;

    if (!shift) {
      return "-";
    }

    const loginTime = formatTime(shift.loginTime);
    const logoutTime = formatTime(shift.logoutTime);

    return `${shift.shiftName} (${shift.shiftCode}) [${loginTime} - ${logoutTime}]`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-5">
        <h1 className="text-2xl font-bold text-white">Basic Settings</h1>

        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <button
            type="button"
            onClick={handleAdd}
            disabled={submitLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add/Update
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-gray-300 whitespace-nowrap">
              Academic Year Begin From
              <span className="text-red-500"> *</span>
            </label>

            <select
              value={yearStart}
              onChange={(event) => setYearStart(event.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-full sm:w-72 cursor-pointer outline-none"
            >
              <option value="">Select Month</option>

              <option value="January">January</option>

              <option value="February">February</option>

              <option value="March">March</option>

              <option value="April">April</option>

              <option value="May">May</option>

              <option value="June">June</option>

              <option value="July">July</option>

              <option value="August">August</option>

              <option value="September">September</option>

              <option value="October">October</option>

              <option value="November">November</option>

              <option value="December">December</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[550px] custom-scrollbar">
          <table className="w-full min-w-[1050px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-gray-300 text-center">Sno.</th>

                <th className="p-4 text-gray-300 text-center">Department</th>

                <th className="p-4 text-gray-300 text-center">Day</th>

                <th className="p-4 text-gray-300 text-center">Type</th>

                <th className="p-4 text-gray-300 text-center">Shift</th>

                <th className="p-4 text-gray-300 text-center">Status</th>

                <th className="p-4 text-gray-300 text-center">Options</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-400">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 size={20} className="animate-spin" />
                      Loading basic settings...
                    </div>
                  </td>
                </tr>
              ) : sortedBasicSettings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-400">
                    No basic settings found
                  </td>
                </tr>
              ) : (
                sortedBasicSettings.map((item, index) => (
                  <tr
                    key={item.slug}
                    className={`border-t border-gray-800 text-center ${
                      item.isActive ? "hover:bg-gray-800/50" : "bg-red-500/5"
                    }`}
                  >
                    <td className="p-4 text-gray-300">{index + 1}</td>

                    <td className="p-4 text-gray-300">
                      {getDepartmentName(item)}
                    </td>

                    <td className="p-4 text-gray-300">
                      {getWeekDayLabel(item.weekDay)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          item.dayType === "WORKING"
                            ? "bg-blue-500/15 text-blue-400"
                            : "bg-yellow-500/15 text-yellow-400"
                        }`}
                      >
                        {item.dayType === "WORKING" ? "Working" : "Holiday"}
                      </span>
                    </td>

                    <td
                      className={`p-4 ${
                        item.dayType === "HOLIDAY"
                          ? "text-yellow-400"
                          : "text-indigo-400"
                      }`}
                    >
                      {getShiftDisplay(item)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          item.isActive
                            ? "bg-green-500/15 text-green-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          disabled={!item.isActive || submitLoading}
                          title="Edit Basic Setting"
                          className={`p-3 rounded-lg text-white ${
                            item.isActive
                              ? "bg-cyan-500 hover:bg-cyan-600 cursor-pointer"
                              : "bg-gray-700 opacity-50 cursor-not-allowed"
                          }`}
                        >
                          <Edit size={16} />
                        </button>

                        {item.isActive ? (
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={submitLoading}
                            title="Delete Basic Setting"
                            className="bg-red-500 hover:bg-red-600 p-3 rounded-lg text-white cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRestore(item)}
                            disabled={submitLoading}
                            title="Restore Basic Setting"
                            className="bg-green-500 hover:bg-green-600 p-3 rounded-lg text-white cursor-pointer disabled:opacity-50"
                          >
                            <RotateCcw size={16} />
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

      <BasicSettingModal open={open} close={handleClose} editData={editData} />
    </div>
  );
}
