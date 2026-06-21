import React from "react";
import { Edit, Trash2 } from "lucide-react";

export default function Departments() {
  const departments = [
    { id: 1, name: "TEACHING" },
    { id: 2, name: "NON-TEACHING" },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">Departments</h2>

      <hr className="border-gray-800" />

      <div className="flex items-end gap-8">
        <div className="flex flex-col">
          <label className="text-gray-300 text-sm">
            Department Name <span className="text-red-500"> *</span>
          </label>

          <input
            placeholder="Department Name"
            className="mt-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-96"
          />
        </div>

        <button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-white cursor-pointer">
          Save
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border border-gray-800">
            <th className="p-3 text-gray-300">Sno.</th>

            <th className="p-3 text-gray-300">Department Name</th>

            <th className="p-3 text-gray-300">Action</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((item, index) => (
            <tr key={item.id} className="border border-gray-800 text-center">
              <td className="p-3 text-gray-300">{index + 1}</td>

              <td className="p-3 text-gray-300">{item.name}</td>

              <td className="p-3 flex justify-center gap-2">
                <button className="bg-blue-500 p-2  cursor-pointer hover:bg-blue-700 rounded-lg text-white">
                  <Edit size={16} />
                </button>

                <button className="bg-red-500 p-2 cursor-pointer hover:bg-red-800 rounded-lg text-white">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
