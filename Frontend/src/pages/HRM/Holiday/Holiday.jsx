import React, { useEffect, useMemo, useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  Edit,
  FileText,
  Loader2,
  Plus,
  RefreshCcw,
  RotateCcw,
  Trash2,
} from "lucide-react";

import HolidayModal from "../../../components/HRM/HolidayModal/HolidayModal";

import { useHolidayStore } from "../../../store/hrm/holiday/holidayStore";

import { useDepartmentStore } from "../../../store/hrm/settings/department/departmentStore";

import { useEmployeeStore } from "../../../store/hrm/employee/employeeStore";

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}-${month}-${year}`;
};

export default function Holiday() {
  const currentYear = new Date().getFullYear();

  const [open, setOpen] = useState(false);

  const [editData, setEditData] = useState(null);

  const [exportOpen, setExportOpen] = useState(false);

  // const [selectedYear, setSelectedYear] = useState(String(currentYear));

  const [selectedYear, setSelectedYear] = useState("");

  const {
    holidays,

    selectedHoliday,

    loading,
    modalLoading,
    deleteLoading,
    restoreLoading,

    fetchHolidays,
    // fetchHolidayByGroupSlug,
    fetchHolidayBySlug,
    createHoliday,
    updateHoliday,
    deleteHoliday,
    restoreHoliday,

    clearSelectedHoliday,
  } = useHolidayStore();

  const {
    departments,
    loading: departmentLoading,
    fetchDepartments,
  } = useDepartmentStore();

  const {
    employees,
    loading: employeeLoading,
    fetchEmployees,
  } = useEmployeeStore();

  useEffect(() => {
    fetchHolidays();

    fetchDepartments({
      status: "active",
    });

    fetchEmployees({
      status: "active",
    });
  }, [fetchHolidays, fetchDepartments, fetchEmployees]);

  const years = useMemo(() => {
    const holidayYears = holidays
      .map((item) => {
        if (!item.date) return null;

        return Number(String(item.date).slice(0, 4));
      })
      .filter(Boolean);

    const defaultYears = [];

    for (let year = currentYear - 5; year <= currentYear + 10; year += 1) {
      defaultYears.push(year);
    }

    return [...new Set([...holidayYears, ...defaultYears])].sort(
      (a, b) => b - a,
    );
  }, [holidays, currentYear]);

  const handleYearFilter = async () => {
    await fetchHolidays(
      selectedYear
        ? {
            year: selectedYear,
          }
        : {},
    );
  };

  const handleOpenCreate = () => {
    clearSelectedHoliday();

    setEditData(null);

    setOpen(true);
  };

  const handleOpenEdit = async (item) => {
    const data = await fetchHolidayBySlug(item.holidaySlug);

    if (!data) {
      return;
    }

    setEditData(data);
    setOpen(true);
  };

  const handleCloseModal = () => {
    if (modalLoading) {
      return;
    }

    setOpen(false);

    setEditData(null);

    clearSelectedHoliday();
  };

  const saveHoliday = async (payload) => {
    let success = false;

    if (editData) {
      success = await updateHoliday(editData.holidaySlug, payload);
    } else {
      success = await createHoliday(payload);
    }

    if (!success) {
      return;
    }

    setOpen(false);
    setEditData(null);

    await fetchHolidays(selectedYear ? { year: selectedYear } : {});
  };

  const handleDelete = async (item) => {
    const success = await deleteHoliday(item.holidaySlug);

    if (!success) {
      return;
    }

    await fetchHolidays(
      selectedYear
        ? {
            year: selectedYear,
          }
        : {},
    );
  };

  const handleRestore = async (item) => {
    const success = await restoreHoliday(item.holidaySlug);

    if (!success) {
      return;
    }

    await fetchHolidays(
      selectedYear
        ? {
            year: selectedYear,
          }
        : {},
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Holidays</h1>

        <p className="text-gray-500 text-sm mt-1">
          Manage department and employee holidays
        </p>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportOpen((prev) => !prev)}
              className="bg-gray-800 hover:bg-gray-700 px-5 py-3 rounded-lg text-white flex items-center gap-2 cursor-pointer"
            >
              <FileText size={18} />
              Export
              {exportOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {exportOpen && (
              <div className="absolute top-14 left-0 bg-gray-800 border border-gray-700 rounded-lg w-36 z-20 overflow-hidden shadow-xl">
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 cursor-pointer"
                >
                  PDF
                </button>

                <button
                  type="button"
                  className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 cursor-pointer"
                >
                  Excel
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-lg text-white flex items-center gap-2 cursor-pointer"
          >
            <Plus size={18} />
            Add Holiday
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 w-52 cursor-pointer"
          >
            <option value="">Select Year</option>

            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleYearFilter}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 cursor-pointer px-7 py-3 rounded-lg text-white flex items-center gap-2"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <RefreshCcw size={17} />
            )}
            GO
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-auto custom-scrollbar max-h-[650px]">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                {[
                  "SNo.",
                  "Date",
                  "Title",
                  "Type",
                  "Dept/Employee",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="p-4 text-gray-300 text-left font-semibold whitespace-nowrap"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Loader2 size={20} className="animate-spin" />
                      Loading holidays...
                    </div>
                  </td>
                </tr>
              ) : holidays.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-500">
                    No holidays found for {selectedYear}
                  </td>
                </tr>
              ) : (
                holidays.map((item, index) => (
                  <tr
                    key={item.rowKey || `${item.holidaySlug}-${index}`}
                    className={`border-t border-gray-800 ${
                      item.isActive
                        ? "hover:bg-gray-800/50"
                        : "bg-gray-950/40 opacity-70"
                    }`}
                  >
                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      {index + 1}.
                    </td>

                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      {formatDate(item.date)}
                    </td>

                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      {item.title}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          item.type === "DEPARTMENT"
                            ? "bg-indigo-500/15 text-indigo-400"
                            : "bg-purple-500/15 text-purple-400"
                        }`}
                      >
                        {item.type === "DEPARTMENT" ? "Department" : "Employee"}
                      </span>
                    </td>

                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      {item.targetName || "-"}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          item.isActive
                            ? "bg-green-500/15 text-green-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {item.isActive ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="bg-cyan-500 hover:bg-cyan-600 cursor-pointer p-2 rounded-lg text-white"
                              title="Edit Holiday"
                            >
                              <Edit size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={deleteLoading}
                              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 cursor-pointer p-2 rounded-lg text-white"
                              title="Delete Holiday"
                            >
                              {deleteLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              disabled
                              className="bg-gray-700 p-2 rounded-lg text-gray-500 cursor-not-allowed"
                              title="Inactive holiday cannot be edited"
                            >
                              <Edit size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRestore(item)}
                              disabled={restoreLoading}
                              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 cursor-pointer p-2 rounded-lg text-white"
                              title="Restore Holiday"
                            >
                              {restoreLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <RotateCcw size={16} />
                              )}
                            </button>
                          </>
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

      <HolidayModal
        open={open}
        close={handleCloseModal}
        save={saveHoliday}
        editData={editData || selectedHoliday}
        departments={departments || []}
        employees={employees || []}
        departmentLoading={departmentLoading}
        employeeLoading={employeeLoading}
        modalLoading={modalLoading}
      />
    </div>
  );
}
