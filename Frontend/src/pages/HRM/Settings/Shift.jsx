import React, { useEffect, useMemo, useState } from "react";
import { Edit, Loader2, RotateCcw, Trash2 } from "lucide-react";

import ShiftModal from "../../../components/HRM/Settings/AddNewShift";

import { useShiftStore } from "../../../store/hrm/settings/shift/shiftStore";

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

export default function Shift() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const {
    shifts,
    loading,
    submitLoading,
    fetchShifts,
    deleteShift,
    restoreShift,
  } = useShiftStore();

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  const sortedShifts = useMemo(() => {
    return [...shifts].sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [shifts]);

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
    const confirmed = window.confirm(
      `Kya aap "${item.shiftName}" shift ko inactive karna chahte hain?`,
    );

    if (!confirmed) return;

    const success = await deleteShift(item.slug);

    if (success && editData?.slug === item.slug) {
      handleClose();
    }
  };

  const handleRestore = async (item) => {
    const confirmed = window.confirm(
      `Kya aap "${item.shiftName}" shift ko restore karna chahte hain?`,
    );

    if (!confirmed) return;

    await restoreShift(item.slug);
  };

  const getDepartmentName = (item) => {
    return item.department?.departmentName || item.departmentName || "-";
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl text-white font-semibold">Shift</h2>

        <button
          type="button"
          onClick={handleAdd}
          disabled={submitLoading}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add New Shift
        </button>
      </div>

      <hr className="border-gray-800" />

      <div className="overflow-x-auto overflow-y-auto max-h-[550px] custom-scrollbar">
        <table className="w-full min-w-[1200px]">
          <thead className="sticky top-0 bg-gray-900 z-10">
            <tr className="border border-gray-800">
              <th className="p-3 text-gray-300">Sno.</th>

              <th className="p-3 text-gray-300">Department</th>

              <th className="p-3 text-gray-300">Shift</th>

              <th className="p-3 text-gray-300">Code</th>

              <th className="p-3 text-gray-300">Login Time</th>

              <th className="p-3 text-gray-300">Login Buffer</th>

              <th className="p-3 text-gray-300">Logout Time</th>

              <th className="p-3 text-gray-300">Logout Buffer</th>

              <th className="p-3 text-gray-300">Status</th>

              <th className="p-3 text-gray-300">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="p-10 text-center text-gray-400">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    Loading shifts...
                  </div>
                </td>
              </tr>
            ) : sortedShifts.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-10 text-center text-gray-400">
                  No shifts found
                </td>
              </tr>
            ) : (
              sortedShifts.map((item, index) => (
                <tr
                  key={item.slug}
                  className={`border border-gray-800 text-center ${
                    !item.isActive ? "bg-red-500/5" : "hover:bg-gray-800/40"
                  }`}
                >
                  <td className="p-3 text-gray-300">{index + 1}.</td>

                  <td className="p-3 text-gray-300">
                    {getDepartmentName(item)}
                  </td>

                  <td className="p-3 text-gray-300">{item.shiftName}</td>

                  <td className="p-3 text-gray-300">{item.shiftCode}</td>

                  <td className="p-3 text-gray-300 whitespace-nowrap">
                    {formatTime(item.loginTime)}
                  </td>

                  <td className="p-3 text-gray-300 whitespace-nowrap">
                    {item.loginBufferMinutes} Minutes
                  </td>

                  <td className="p-3 text-gray-300 whitespace-nowrap">
                    {formatTime(item.logoutTime)}
                  </td>

                  <td className="p-3 text-gray-300 whitespace-nowrap">
                    {item.logoutBufferMinutes} Minutes
                  </td>

                  <td className="p-3">
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

                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        disabled={!item.isActive || submitLoading}
                        title="Edit Shift"
                        className={`p-2 rounded-lg text-white ${
                          item.isActive
                            ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
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
                          title="Delete Shift"
                          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg cursor-pointer text-white disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRestore(item)}
                          disabled={submitLoading}
                          title="Restore Shift"
                          className="bg-green-500 hover:bg-green-600 p-2 rounded-lg cursor-pointer text-white disabled:opacity-50"
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

      <ShiftModal open={open} close={handleClose} editData={editData} />
    </div>
  );
}
