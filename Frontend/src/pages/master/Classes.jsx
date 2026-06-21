import React, { useState } from "react";
import { Plus, Pencil, Trash2, Layers, FolderTree } from "lucide-react";
import { classData } from "../../data/classData";
import DataTable from "../../components/common/DataTable";
import AddClassModal from "../../components/classes/AddClassModal";
import UpdateTimingModal from "../../components/classes/UpdateTimingModal";
import ManageStreamModal from "../../components/classes/ManageStreamModal";
import ManageSectionModal from "../../components/classes/ManageSectionModal";
import MapStreamModal from "../../components/classes/MapStreamModal";
import MapSectionModal from "../../components/classes/MapSectionModal";

export default function Classes() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTimingModal, setShowTimingModal] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showMapStream, setShowMapStream] = useState(false);
  const [showMapSection, setShowMapSection] = useState(false);

  const columns = [
    {
      key: "checkbox",

      label: (
        <input
          type="checkbox"
          checked={selectedRows.length === classData.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(classData.map((item) => item.id));
            } else {
              setSelectedRows([]);
            }
          }}
          className="cursor-pointer"
        />
      ),

      render: (value, row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows((prev) => [...prev, row.id]);
            } else {
              setSelectedRows((prev) => prev.filter((id) => id !== row.id));
            }
          }}
          className="cursor-pointer"
        />
      ),
    },

    {
      key: "sn",
      label: "SN",
      render: (v, row, index) => index + 1,
    },

    {
      key: "name",
      label: "Class",
    },

    {
      key: "stream",
      label: "Streams",
    },

    {
      key: "section",
      label: "Sections",
    },

    {
      key: "classTeacher",
      label: "Class Teacher",
    },

    {
      key: "timing",
      label: "Class Timing",
    },

    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs
          ${
            value === "active"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {value}
        </span>
      ),
    },

    {
      key: "action",
      label: "Action",

      render: (value, row) => (
        <div className="flex items-center gap-2 cursor-pointer">
          {/* Edit */}
          <button
            onClick={() => console.log("Edit", row)}
            className="p-2 rounded-lg cursor-pointer bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
            title="Edit"
          >
            <Pencil size={16} />
          </button>

          {/* Manage Stream */}
          <button
            onClick={() => {
              console.log("Manage Stream", row);

              // setSelectedClass(row)
              setShowMapStream(true);
            }}
            className="p-2 rounded-lg cursor-pointer bg-green-500/20 text-green-400 hover:bg-green-500/30"
            title="Manage Stream"
          >
            <Layers size={16} />
          </button>

          {/* Manage Section */}
          <button
            onClick={() => {
              console.log("Manage Section", row);

              // setSelectedClass(row)
              setShowMapSection(true);
            }}
            className="p-2 rounded-lg cursor-pointer bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
            title="Manage Section"
          >
            <FolderTree size={16} />
          </button>

          {/* Delete */}
          <button
            onClick={() => console.log("Delete", row)}
            className="p-2 rounded-lg bg-red-500/20 cursor-pointer text-red-400 hover:bg-red-500/30"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Classes</h1>

          <p className="text-gray-400 mt-1">Manage school classes</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition"
          >
            <Plus size={18} />
            Add Class
          </button>

          <button
            onClick={() => setShowSectionModal(true)}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition"
          >
            <Plus size={18} />
            Add Section
          </button>

          <button
            onClick={() => setShowStreamModal(true)}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
          >
            <Plus size={18} />
            Add Stream
          </button>

          <button
            disabled={selectedRows.length === 0}
            className={`px-4 py-2 rounded-xl
      ${
        selectedRows.length === 0
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : "bg-emerald-600 text-white cursor-pointer"
      }`}
          >
            Update Class Teacher
          </button>

          <button
            disabled={selectedRows.length === 0}
            onClick={() => setShowTimingModal(true)}
            className={`px-4 py-2 rounded-xl
      ${
        selectedRows.length === 0
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : "bg-rose-600 text-white cursor-pointer"
      }`}
          >
            Update Class Timing
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={classData}
        searchFields={["title"]}
        title="Classes"
      />

      <AddClassModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <UpdateTimingModal
        isOpen={showTimingModal}
        onClose={() => setShowTimingModal(false)}
      />

      <ManageStreamModal
        isOpen={showStreamModal}
        onClose={() => setShowStreamModal(false)}
      />

      <ManageSectionModal
        isOpen={showSectionModal}
        onClose={() => setShowSectionModal(false)}
      />

      <MapStreamModal
        isOpen={showMapStream}
        onClose={() => setShowMapStream(false)}
      />

      <MapSectionModal
        isOpen={showMapSection}
        onClose={() => setShowMapSection(false)}
      />
    </div>
  );
}
