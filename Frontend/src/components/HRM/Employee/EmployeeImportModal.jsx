import React, { useEffect, useState } from "react";
import { FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

import { useEmployeeStore } from "../../../store/HRM/employee/employeeStore";

export default function EmployeeImportModal({ open, close }) {
  const [file, setFile] = useState(null);

  const importEmployees = useEmployeeStore((state) => state.importEmployees);

  const importLoading = useEmployeeStore((state) => state.importLoading);

  const importResult = useEmployeeStore((state) => state.importResult);

  const clearImportResult = useEmployeeStore(
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      toast.error("Please select an Excel file");

      e.target.value = "";

      return;
    }

    setFile(selectedFile);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select an Excel file");

      return;
    }

    await importEmployees(file);
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
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Import Employees
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Import employees from Excel
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

        <div className="p-6 space-y-6 overflow-auto custom-scrollbar">
          <div>
            <label className="block text-gray-300 mb-2">
              Excel File
              <span className="text-red-500"> *</span>
            </label>

            <label className="border-2 border-dashed border-gray-700 hover:border-indigo-500 bg-gray-800/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition">
              <FileSpreadsheet size={40} className="text-green-500 mb-3" />

              <p className="text-white">
                {file ? file.name : "Select Employee Excel File"}
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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-400">
              <span>Full Name *</span>
              <span>Phone Number *</span>
              <span>Email *</span>
              <span>Date of Birth *</span>
              <span>Qualification *</span>
              <span>Department *</span>
              <span>Designation *</span>
              <span>Nature of Appointment *</span>
              <span>Joining Date *</span>
              <span>Pay Band *</span>
              <span>Job Role Description *</span>
            </div>
          </div>

          {importResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Rows</p>

                  <p className="text-xl text-white font-semibold mt-1">
                    {importResult.totalRows}
                  </p>
                </div>

                <div className="bg-green-950/30 border border-green-800 rounded-lg p-4">
                  <p className="text-green-400 text-sm">Imported</p>

                  <p className="text-xl text-green-300 font-semibold mt-1">
                    {importResult.successCount}
                  </p>
                </div>

                <div className="bg-red-950/30 border border-red-800 rounded-lg p-4">
                  <p className="text-red-400 text-sm">Failed</p>

                  <p className="text-xl text-red-300 font-semibold mt-1">
                    {importResult.failedCount}
                  </p>
                </div>
              </div>

              {importResult.results?.length > 0 && (
                <div className="border border-gray-800 rounded-xl overflow-hidden">
                  <div className="overflow-auto custom-scrollbar max-h-[300px]">
                    <table className="w-full min-w-[700px]">
                      <thead className="bg-gray-800 sticky top-0">
                        <tr>
                          <th className="p-3 text-left text-gray-300">Row</th>

                          <th className="p-3 text-left text-gray-300">
                            Employee
                          </th>

                          <th className="p-3 text-left text-gray-300">Code</th>

                          <th className="p-3 text-left text-gray-300">
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
                            key={`${item.row}-${index}`}
                            className="border-t border-gray-800"
                          >
                            <td className="p-3 text-gray-300">{item.row}</td>

                            <td className="p-3 text-gray-300 whitespace-nowrap">
                              {item.fullName || "-"}
                            </td>

                            <td className="p-3 text-gray-300 whitespace-nowrap">
                              {item.employeeCode || "-"}
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

                            <td className="p-3 text-gray-400">
                              {item.message}
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
            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 px-5 py-2 rounded-lg text-white cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleImport}
            disabled={importLoading || !file}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer"
          >
            {importLoading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Upload size={17} />
            )}

            {importLoading ? "Importing..." : "Import Employees"}
          </button>
        </div>
      </div>
    </div>
  );
}
