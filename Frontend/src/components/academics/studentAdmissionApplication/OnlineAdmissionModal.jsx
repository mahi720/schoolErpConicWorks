import React, { useState } from "react";
import { X, Plus, Link as LinkIcon, Trash2, Search } from "lucide-react";

export default function OnlineAdmissionModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    academicYear: "",
    board: "",
    school: "",
    className: "",
    lastDate: "",
    fee: "",
  });

  const [applications, setApplications] = useState([
    {
      id: 1,
      academicYear: "2025-26",
      lastDate: "30-05-2025",
      fee: "400",
      school: "CENTRAL",
      board: "CBSE",
      className: "XI & XII",
      status: "Active",
    },

    {
      id: 2,
      academicYear: "2025-26",
      lastDate: "30-06-2025",
      fee: "400",
      school: "CENTRAL",
      board: "ICSE",
      className: "I TO X",
      status: "Active",
    },
    {
      id: 2,
      academicYear: "2025-26",
      lastDate: "30-06-2025",
      fee: "400",
      school: "CENTRAL",
      board: "ICSE",
      className: "I TO X",
      status: "Active",
    },
    {
      id: 2,
      academicYear: "2025-26",
      lastDate: "30-06-2025",
      fee: "400",
      school: "CENTRAL",
      board: "ICSE",
      className: "I TO X",
      status: "Active",
    },
    {
      id: 2,
      academicYear: "2025-26",
      lastDate: "30-06-2025",
      fee: "400",
      school: "CENTRAL",
      board: "ICSE",
      className: "I TO X",
      status: "Active",
    },
    {
      id: 2,
      academicYear: "2025-26",
      lastDate: "30-06-2025",
      fee: "400",
      school: "CENTRAL",
      board: "ICSE",
      className: "I TO X",
      status: "Active",
    },
  ]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = () => {
    if (
      !formData.academicYear ||
      !formData.board ||
      !formData.school ||
      !formData.className
    ) {
      return;
    }

    setApplications([
      ...applications,
      {
        id: Date.now(),
        academicYear: formData.academicYear,
        lastDate: formData.lastDate,
        fee: formData.fee,
        school: formData.school,
        board: formData.board,
        className: formData.className,
        status: "Active",
      },
    ]);

    setFormData({
      academicYear: "",
      board: "",
      school: "",
      className: "",
      lastDate: "",
      fee: "",
    });
  };

  const handleDelete = (id) => {
    setApplications(applications.filter((item) => item.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 w-full max-w-6xl rounded-2xl border border-gray-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}

        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-3xl font-bold text-white">
            Create New Admission Form
          </h2>

          <button onClick={onClose}>
            <X size={24} className="text-gray-400 cursor-pointer" />
          </button>
        </div>

        {/* Body */}

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Form */}

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-300 mb-2">
                Academic Year <span className="text-red-500"> *</span>
              </label>

              <select
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer"
              >
                <option value="">Select Academic Year</option>

                <option>2025-26</option>

                <option>2026-27</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Select Board <span className="text-red-500"> *</span>
              </label>

              <select
                name="board"
                value={formData.board}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer"
              >
                <option value="">Select Board</option>

                <option>CBSE</option>

                <option>ICSE</option>

                <option>STATE</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Select School <span className="text-red-500"> *</span>
              </label>

              <select
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer"
              >
                <option value="">Select School</option>

                <option>CENTRAL</option>

                <option>SPECIAL SCHOOL</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Select Class <span className="text-red-500"> *</span>
              </label>

              <select
                name="className"
                value={formData.className}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer"
              >
                <option value="">Select Class</option>

                <option>I TO V</option>

                <option>VI TO X</option>

                <option>XI & XII</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Last Date To Apply <span className="text-red-500"> *</span>
              </label>

              <input
                type="date"
                name="lastDate"
                value={formData.lastDate}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Applicable Fee <span className="text-red-500"> *</span>
              </label>

              <input
                type="number"
                name="fee"
                value={formData.fee}
                onChange={handleChange}
                placeholder="Enter Fee"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>
          </div>

          {/* Button */}

          <div className="flex justify-end">
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white cursor-pointer"
            >
              <Plus size={18} />
              Create
            </button>
          </div>

          {/* Table */}

          <div className="border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  {/* Header */}

                  <div className="p-5 flex justify-between items-center border-b border-gray-800">
                    <h2 className="text-xl font-semibold text-white">
                      Admission Forms
                    </h2>

                    <div className="relative">
                      <Search
                        size={18}
                        className="absolute left-3 top-4 text-gray-400"
                      />

                      <input
                        placeholder="Search"
                        className="w-[300px] bg-gray-800 border border-gray-700 pl-10 p-3 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  {/* Table */}

                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="p-4 text-left text-gray-300">SN</th>

                          <th className="p-4 text-left text-gray-300">
                            Academic Yr
                          </th>

                          <th className="p-4 text-left text-gray-300">
                            Last Date
                          </th>

                          <th className="p-4 text-left text-gray-300">Fee</th>

                          <th className="p-4 text-left text-gray-300">
                            School
                          </th>

                          <th className="p-4 text-left text-gray-300">Board</th>

                          <th className="p-4 text-left text-gray-300">Class</th>

                          <th className="p-4 text-left text-gray-300">
                            Status
                          </th>

                          <th className="p-4 text-center text-gray-300">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {applications.map((item, index) => (
                          <tr
                            key={item.id}
                            className="border-t border-gray-800"
                          >
                            <td className="p-4 text-white">{index + 1}</td>

                            <td className="p-4 text-white">
                              {item.academicYear}
                            </td>

                            <td className="p-4 text-white">{item.lastDate}</td>

                            <td className="p-4 text-white">₹{item.fee}</td>

                            <td className="p-4 text-white">{item.school}</td>

                            <td className="p-4 text-white">{item.board}</td>

                            <td className="p-4 text-white">{item.className}</td>

                            <td className="p-4">
                              <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                                {item.status}
                              </span>
                            </td>

                            <td className="p-4">
                              <div className="flex justify-center gap-2">
                                <button className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 cursor-pointer">
                                  <LinkIcon size={16} />
                                </button>

                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 cursor-pointer"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
