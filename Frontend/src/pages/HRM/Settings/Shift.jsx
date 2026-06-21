import React, { useState } from "react";
import { Edit, Trash2, User, Funnel } from "lucide-react";
import ShiftModal from "../../../components/HRM/Settings/AddNewShift";

export default function Shift() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const designations = [
    {
      id: 1,
      dept: "TEACHING",
      shift: "FIRST HALF",
      code: "FH",
      loginTime: "07:30 AM",
      loginBufferTime: "07:40 AM",
      logoutTime: "05:00 PM",
      logoutBufferTime: "04:50 PM",
    },
    {
      id: 2,
      dept: "TEACHING",
      shift: "GENERAL SHIFT",
      code: "GS",
      loginTime: "07:30 AM",
      loginBufferTime: "07:40 AM",
      logoutTime: "05:00 PM",
      logoutBufferTime: "04:50 PM",
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-white font-semibold">Shift</h2>
        <button
          onClick={() => {
            setOpen(true);
            setEditData(null);
          }}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white cursor-pointer"
        >
          Add New Shift
        </button>
      </div>

      <hr className="border-gray-800" />

      <table className="w-full">
        <thead>
          <tr className="border border-gray-800">
            <th className="p-3 text-gray-300">Sno.</th>

            <th className="p-3 text-gray-300">Department</th>

            <th className="p-3 text-gray-300">Shift</th>

            <th className="p-3 text-gray-300">Code</th>

            <th className="p-3 text-gray-300">Login Time</th>
            <th className="p-3 text-gray-300">Login Buffer Time</th>
            <th className="p-3 text-gray-300">Logout Time</th>
            <th className="p-3 text-gray-300">Logout Buffer Time</th>
            <th className="p-3 text-gray-300">Actions</th>
          </tr>
        </thead>

        <tbody>
          {designations.map((item, index) => (
            <tr key={item.id} className="border border-gray-800 text-center">
              <td className="p-3 text-gray-300">{index + 1}.</td>

              <td className="p-3 text-gray-300">{item.dept}</td>

              <td className="p-3 text-gray-300">{item.shift}</td>

              <td className="p-3 text-gray-300">{item.code}</td>
              <td className="p-3 text-gray-300">{item.loginTime}</td>
              <td className="p-3 text-gray-300">{item.loginBufferTime}</td>
              <td className="p-3 text-gray-300">{item.logoutTime}</td>
              <td className="p-3 text-gray-300">{item.logoutBufferTime}</td>

              <td className="p-3 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setOpen(true);
                    setEditData(item);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg cursor-pointer text-white"
                >
                  <Edit size={16} />
                </button>

                {/* <button className="bg-red-500 hover:bg-red-600 p-2 rounded-lg cursor-pointer text-white">
                  <Trash2 size={16} />
                </button>

                <button className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer p-2 rounded text-white">
                  <User size={16} />
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ShiftModal
        open={open}
        close={() => setOpen(false)}
        editData={editData}
      />
    </div>
  );
}
