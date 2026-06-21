import React, { useState } from "react";
import { Edit } from "lucide-react";
import BasicSettingModal from "../../../components/HRM/Settings/BasicSettingModal";

export default function BasicSettings() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [yearStart, setYearStart] = useState("April");

  const shiftData = [
    {
      department: "TEACHING",
      day: "Monday",
      shift: "GENERAL SHIFT (GS) [07:25 AM - 02:55 PM]",
    },
    {
      department: "TEACHING",
      day: "Tuesday",
      shift: "GENERAL SHIFT (GS) [07:25 AM - 02:55 PM]",
    },
    {
      department: "TEACHING",
      day: "Wednesday",
      shift: "GENERAL SHIFT (GS) [07:25 AM - 02:55 PM]",
    },
    {
      department: "TEACHING",
      day: "Thursday",
      shift: "GENERAL SHIFT (GS) [07:25 AM - 02:55 PM]",
    },
    {
      department: "TEACHING",
      day: "Friday",
      shift: "GENERAL SHIFT (GS) [07:25 AM - 02:55 PM]",
    },
    {
      department: "TEACHING",
      day: "Saturday",
      shift: "GENERAL SHIFT (GS) [07:25 AM - 02:55 PM]",
    },
    {
      department: "TEACHING",
      day: "2nd Saturday",
      shift: "Holiday",
    },
    {
      department: "TEACHING",
      day: "Sunday",
      shift: "Holiday",
    },
    {
      department: "NON-TEACHING",
      day: "Monday",
      shift: "GENERAL SHIFT (GS) [07:25 AM - 02:55 PM]",
    },
    {
      department: "NON-TEACHING",
      day: "Tuesday",
      shift: "GENERAL SHIFT (GS) [07:25 AM - 02:55 PM]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Basic Settings</h1>

        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              setEditData(null);
              setOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl cursor-pointer"
          >
            Add/Update
          </button>

          <div className="flex items-center gap-3">
            <label className="text-gray-300">
              Academic Year Begin From
              <span className="text-red-500"> *</span>
            </label>

            <select
              value={yearStart}
              onChange={(e) => setYearStart(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-72 cursor-pointer"
            >
              <option>Select Months</option>
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
              <option>August</option>
              <option>September</option>
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-auto custom-scrollbar">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-800">
              <tr>
                {["Department", "Day", "Shift", "Options"].map((h) => (
                  <th key={h} className="p-4 text-gray-300 text-center">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {shiftData.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="p-4 text-gray-300 text-center">
                    {item.department}
                  </td>

                  <td className="p-4 text-gray-300 text-center">{item.day}</td>

                  <td className="p-4 text-indigo-400 text-center">
                    {item.shift}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setEditData(item);
                        setOpen(true);
                      }}
                      className="bg-cyan-500 hover:bg-cyan-600 p-3 rounded-lg text-white cursor-pointer"
                    >
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <BasicSettingModal
        open={open}
        close={() => setOpen(false)}
        editData={editData}
      />
    </div>
  );
}
