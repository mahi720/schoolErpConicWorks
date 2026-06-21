import React from "react";
import { Edit, Trash2, User, Funnel } from "lucide-react";

export default function Designations() {
  const designations = [
    { id: 1, dept: "TEACHING", name: "PRINCIPAL", level: 1 },
    { id: 2, dept: "TEACHING", name: "PGT", level: 2 },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">Designations</h2>

      <hr className="border-gray-800" />

      <div className="flex items-end gap-6">
        <select className="bg-gray-800 border cursor-pointer border-gray-700 rounded-lg px-4 py-3 text-white w-50">
          <option>Select Department</option>
          <option>Teaching</option>
          <option>Non-Teaching</option>
        </select>

        <input
          placeholder="Designation Name"
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-50"
        />

        <input
          placeholder="Designation Level"
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-50"
        />

        <button className="bg-blue-500 hover:bg-blue-600 px-6 w-30 py-3 rounded-lg text-white cursor-pointer">
          Save
        </button>
      </div>

      <div className="flex items-end gap-6 justify-end">
        {/* <Funnel size={25} className="fill-blue-600 text-blue-600 mb-3" /> */}
        <Funnel size={25} className="text-white mb-3" />

        <select className="bg-gray-800 border cursor-pointer border-gray-700 rounded-lg px-4 py-3 text-white w-50">
          <option>Select an option</option>
          <option>Teaching</option>
          <option>Non-Teaching</option>
        </select>

        <button className="bg-red-500 hover:bg-red-600 px-6 w-25 py-3 rounded-lg text-white cursor-pointer">
          Clear
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border border-gray-800">
            <th className="p-3 text-gray-300">Sno.</th>

            <th className="p-3 text-gray-300">Department</th>

            <th className="p-3 text-gray-300">Designation Name</th>

            <th className="p-3 text-gray-300">Designation Level</th>

            <th className="p-3 text-gray-300">Action</th>
          </tr>
        </thead>

        <tbody>
          {designations.map((item, index) => (
            <tr key={item.id} className="border border-gray-800 text-center">
              <td className="p-3 text-gray-300">{index + 1}.</td>

              <td className="p-3 text-gray-300">{item.dept}</td>

              <td className="p-3 text-gray-300">{item.name}</td>

              <td className="p-3 text-gray-300">{item.level}</td>

              <td className="p-3 flex justify-center gap-2">
                <button className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg cursor-pointer text-white">
                  <Edit size={16} />
                </button>

                <button className="bg-red-500 hover:bg-red-600 p-2 rounded-lg cursor-pointer text-white">
                  <Trash2 size={16} />
                </button>

                <button className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer p-2 rounded text-white">
                  <User size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
