import React, { useEffect, useState } from "react";
import { FileSpreadsheet, Loader2, Upload, Download, X } from "lucide-react";
import toast from "react-hot-toast";

import { useEmployeeAttendanceStore } from "../../../store/HRM/attendance/employeeAttendanceStore";

export default function AttendanceImportModal({ open, close, onImported }) {
  const [file, setFile] = useState(null);

  const importAttendance = useEmployeeAttendanceStore(
    (state) => state.importAttendance,
  );

  const importLoading = useEmployeeAttendanceStore(
    (state) => state.importLoading,
  );

  const importResult = useEmployeeAttendanceStore(
    (state) => state.importResult,
  );

  const clearImportResult = useEmployeeAttendanceStore(
    (state) => state.clearImportResult,
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setFile(null);
    clearImportResult();
  }, [open, clearImportResult]);

  if (!open) {
    return null;
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      toast.error("Please select an Excel file");

      event.target.value = "";

      return;
    }

    setFile(selectedFile);

    clearImportResult();
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select an Excel file");

      return;
    }

    const result = await importAttendance(file);

    if (!result?.success) {
      return;
    }

    if (onImported) {
      await onImported(result.data);
    }
  };

  const handleClose = () => {
    if (importLoading) {
      return;
    }

    setFile(null);

    clearImportResult();

    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Import Employee Attendance
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Import employee punch records from Excel
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={importLoading}
            className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </div>
        {/*  attendance sample */}
        <div className="p-6 space-y-6 overflow-x-auto overflow-y-auto custom-scrollbar">
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-500/15 p-3 rounded-lg">
                  <FileSpreadsheet size={24} className="text-indigo-400" />
                </div>

                <div>
                  <p className="text-white font-medium">
                    Attendance Excel Format
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Download the sample Excel file and use the same format while
                    importing attendance.
                  </p>
                </div>
              </div>

              <a
                href="/templates/attendance_sample.xlsx"
                download="/templates/attendance_sample.xlsx"
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-white flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Download size={17} />
                Download Sample
              </a>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Excel File
              <span className="text-red-500"> *</span>
            </label>

            <label className="border-2 border-dashed border-gray-700 hover:border-indigo-500 bg-gray-800/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition">
              <FileSpreadsheet size={40} className="text-green-500 mb-3" />

              <p className="text-white text-center">
                {file ? file.name : "Select Attendance Excel File"}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Supported: .xlsx, .xls
              </p>

              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                hidden
              />
            </label>
          </div>

          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
            <p className="text-white font-medium mb-3">Required Columns</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-gray-900/70 border border-gray-700 rounded-lg p-3">
                <p className="text-gray-300">
                  Employee ID
                  <span className="text-red-500"> *</span>
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Employee identifier
                </p>
              </div>

              <div className="bg-gray-900/70 border border-gray-700 rounded-lg p-3">
                <p className="text-gray-300">
                  Punch Date
                  <span className="text-red-500"> *</span>
                </p>

                <p className="text-xs text-gray-500 mt-1">Attendance date</p>
              </div>

              <div className="bg-gray-900/70 border border-gray-700 rounded-lg p-3">
                <p className="text-gray-300">
                  Punch Time
                  <span className="text-red-500"> *</span>
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Employee punch time
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-blue-300 text-sm font-medium">
              Multiple Punch Handling
            </p>

            <p className="text-blue-200/70 text-sm mt-2 leading-relaxed">
              If an employee has multiple punches on the same date, the first
              punch will be used as IN time and the last punch will be used as
              OUT time. Intermediate punches will not be used for attendance
              calculation.
            </p>
          </div>

          {importResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Excel Rows</p>

                  <p className="text-xl text-white font-semibold mt-1">
                    {importResult.totalExcelRows ?? 0}
                  </p>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Attendance</p>

                  <p className="text-xl text-white font-semibold mt-1">
                    {importResult.groupedAttendanceCount ?? 0}
                  </p>
                </div>

                <div className="bg-green-950/30 border border-green-800 rounded-lg p-4">
                  <p className="text-green-400 text-sm">Imported</p>

                  <p className="text-xl text-green-300 font-semibold mt-1">
                    {importResult.successCount ?? 0}
                  </p>
                </div>

                <div className="bg-red-950/30 border border-red-800 rounded-lg p-4">
                  <p className="text-red-400 text-sm">Failed</p>

                  <p className="text-xl text-red-300 font-semibold mt-1">
                    {importResult.failedCount ?? 0}
                  </p>
                </div>

                <div className="bg-yellow-950/30 border border-yellow-800 rounded-lg p-4">
                  <p className="text-yellow-400 text-sm">Single Punch</p>

                  <p className="text-xl text-yellow-300 font-semibold mt-1">
                    {importResult.singlePunchCount ?? 0}
                  </p>
                </div>
              </div>

              {importResult.results?.length > 0 && (
                <div className="border border-gray-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto custom-scrollbar max-h-[350px]">
                    <table className="w-full min-w-[1050px]">
                      <thead className="bg-gray-800 sticky top-0 z-10">
                        <tr>
                          <th className="p-3 text-left text-gray-300 whitespace-nowrap">
                            SNo.
                          </th>

                          <th className="p-3 text-left text-gray-300 whitespace-nowrap">
                            Employee ID
                          </th>

                          <th className="p-3 text-left text-gray-300 whitespace-nowrap">
                            Employee
                          </th>

                          <th className="p-3 text-left text-gray-300 whitespace-nowrap">
                            Date
                          </th>

                          <th className="p-3 text-left text-gray-300 whitespace-nowrap">
                            Punches
                          </th>

                          <th className="p-3 text-left text-gray-300 whitespace-nowrap">
                            IN
                          </th>

                          <th className="p-3 text-left text-gray-300 whitespace-nowrap">
                            OUT
                          </th>

                          <th className="p-3 text-left text-gray-300 whitespace-nowrap">
                            Status
                          </th>

                          <th className="p-3 text-left text-gray-300">
                            Message
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {importResult.results.map((item, index) => (
                          <tr
                            key={`${item.employeeId}-${item.attendanceDate}-${index}`}
                            className="border-t border-gray-800"
                          >
                            <td className="p-3 text-gray-300">{index + 1}.</td>

                            <td className="p-3 text-gray-300 whitespace-nowrap">
                              {item.employeeId || "-"}
                            </td>

                            <td className="p-3 text-gray-300 whitespace-nowrap">
                              {item.fullName || "-"}
                            </td>

                            <td className="p-3 text-gray-300 whitespace-nowrap">
                              {item.attendanceDate || "-"}
                            </td>

                            <td className="p-3">
                              <span className="bg-gray-700 text-gray-200 px-2.5 py-1 rounded-md text-xs">
                                {item.punchCount ?? 0}
                              </span>
                            </td>

                            <td className="p-3 whitespace-nowrap">
                              <span className="bg-green-500/20 text-green-400 px-2.5 py-1 rounded-md text-xs">
                                {item.inTime || "-"}
                              </span>
                            </td>

                            <td className="p-3 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 rounded-md text-xs ${
                                  item.outTime
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }`}
                              >
                                {item.outTime || "No Punch"}
                              </span>
                            </td>

                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded-md text-xs ${
                                  item.success
                                    ? "bg-green-700 text-white"
                                    : "bg-red-700 text-white"
                                }`}
                              >
                                {item.success ? "Success" : "Failed"}
                              </span>
                            </td>

                            <td className="p-3 text-gray-400 min-w-[220px]">
                              {item.message || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {importResult.invalidRows?.length > 0 && (
                <div className="border border-red-900/60 rounded-xl overflow-hidden">
                  <div className="bg-red-950/30 px-4 py-3 border-b border-red-900/60">
                    <p className="text-red-400 font-medium">
                      Invalid Excel Rows
                    </p>
                  </div>

                  <div className="overflow-x-auto overflow-y-auto custom-scrollbar max-h-[220px]">
                    <table className="w-full min-w-[600px]">
                      <thead className="bg-gray-800 sticky top-0">
                        <tr>
                          <th className="p-3 text-left text-gray-300">Row</th>

                          <th className="p-3 text-left text-gray-300">
                            Employee ID
                          </th>

                          <th className="p-3 text-left text-gray-300">Error</th>
                        </tr>
                      </thead>

                      <tbody>
                        {importResult.invalidRows.map((item, index) => (
                          <tr
                            key={`${item.row}-${index}`}
                            className="border-t border-gray-800"
                          >
                            <td className="p-3 text-gray-300">
                              {item.row || "-"}
                            </td>

                            <td className="p-3 text-gray-300">
                              {item.employeeId || "-"}
                            </td>

                            <td className="p-3 text-red-400">
                              {item.message || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={importLoading}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 px-5 py-2.5 rounded-lg text-white cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleImport}
            disabled={importLoading || !file}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 rounded-lg text-white flex items-center gap-2 cursor-pointer"
          >
            {importLoading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Upload size={17} />
            )}

            {importLoading ? "Importing..." : "Import Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
}
