import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import DataTable from "../../components/common/DataTable";
import { Download, Eye } from "lucide-react";

export default function Certificates() {
  const { students } = useApp();
  const [certificateType, setCertificateType] = useState("all");

  const certificateTypes = {
    tc: "Transfer Certificate",
    cc: "Character Certificate",
    sc: "School Certificate",
    conduct: "Conduct Certificate",
  };

  const columns = [
    { key: "name", label: "Student Name", sortable: true },
    { key: "rollNo", label: "Roll No", sortable: true },
    { key: "class", label: "Class", sortable: true },
  ];

  const actions = [
    {
      label: "Preview",
      onClick: (row) => console.log("Preview certificate", row),
    },
    {
      label: "Download",
      onClick: (row) => console.log("Download certificate", row),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Certificates
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Generate and manage student certificates
        </p>
      </div>

      {/* Certificate Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setCertificateType("all")}
          className={`p-4 rounded-lg border transition-colors ${
            certificateType === "all"
              ? "border-primary bg-blue-600/5"
              : "border-gray-200 dark:border-gray-700 hover:border-primary"
          }`}
        >
          <p className="font-semibold text-black dark:text-white">
            All Certificates
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {students.length} Available
          </p>
        </button>
        {Object.entries(certificateTypes).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setCertificateType(key)}
            className={`p-4 rounded-lg border transition-colors ${
              certificateType === key
                ? "border-primary bg-blue-600/5"
                : "border-gray-200 dark:border-gray-700 hover:border-primary"
            }`}
          >
            <p className="font-semibold text-black dark:text-white">{label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {students.length} Available
            </p>
          </button>
        ))}
      </div>

      {/* Students List */}
      <DataTable
        columns={columns}
        data={students}
        searchFields={["name", "rollNo"]}
        title="Generate Certificates"
        actions={actions}
        itemsPerPage={10}
      />

      {/* Bulk Actions */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Bulk Actions</h3>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
            <Download size={16} />
            Download All Selected
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-600 dark:bg-gray-700 transition-colors">
            <Eye size={16} />
            Preview Selected
          </button>
        </div>
      </div>
    </div>
  );
}
