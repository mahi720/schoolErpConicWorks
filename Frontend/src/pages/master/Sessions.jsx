import React, { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Sessions() {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    status: "active",
  });

  const sessions = [
    {
      id: 1,
      name: "2024-2025",
      startDate: "2024-04-01",
      endDate: "2025-03-31",
      status: "active",
    },

    {
      id: 2,
      name: "2025-2026",
      startDate: "2024-04-01",
      endDate: "2025-03-31",
      status: "active",
    },

    {
      id: 3,
      name: "2026-2027",
      startDate: "2024-04-01",
      endDate: "2025-03-31",
      status: "active",
    },
  ];

  const columns = [
    {
      key: "sn",
      label: "SN",
      render: (v, row, index) => index + 1,
    },
    { key: "name", label: "Session Name" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: <Pencil size={16} />,
      onClick: (row) => {
        console.log("Edit", row);
      },
    },

    {
      label: <Trash2 size={16} />,
      variant: "danger",
      onClick: (row) => {
        console.log("Delete", row);
      },
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    setShowModal(false);

    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      status: "active",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-300">Sessions & Years</h1>

          <p className="text-gray-400">Manage academic sessions</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <Plus size={18} />
          Add Session
        </button>
      </div>

      <DataTable
        columns={columns}
        data={sessions}
        searchFields={["name"]}
        title="Sessions"
        actions={actions}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg p-6 shadow-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-300">Add Session</h2>

              <button onClick={() => setShowModal(false)}>
                <X className="text-gray-300 cursor-pointer" size={22} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-300">Session Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="2025-2026"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border text-gray-300 rounded-lg p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300">Start Date</label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full cursor-pointer text-gray-300 border rounded-lg p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300">End Date</label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full cursor-pointer text-gray-300 border rounded-lg p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300">Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full cursor-pointer bg-gray-800 text-white border border-gray-700 rounded-lg p-2 mt-1 focus:outline-none"
                >
                  <option
                    className="bg-gray-800 cursor-pointer text-white"
                    value="active"
                  >
                    Active
                  </option>

                  <option
                    className="bg-gray-800 cursor-pointer text-white"
                    value="closed"
                  >
                    Closed
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-300 cursor-pointer px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
