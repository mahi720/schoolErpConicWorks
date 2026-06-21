import React, { useState } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import VehicleModal from "../../components/transportation/VehicleModal";

const ManageVehicles = () => {
  const [vehicleModal, setVehicleModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const vehicles = [
    {
      id: 1,
      name: "Vehicle 4",
      number: "VH04",
      capacity: "100",
      status: "Active",
    },
    {
      id: 2,
      name: "Vehicle 4",
      number: "VH04",
      capacity: "100",
      status: "Active",
    },
    {
      id: 3,
      name: "Vehicle 4",
      number: "VH04",
      capacity: "100",
      status: "Inactive",
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-white font-semibold">Manage Vehicles</h1>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setEditData(null);
              setVehicleModal(true);
            }}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-lg flex gap-2 cursor-pointer"
          >
            <Plus size={18} className="mt-1" />
            Create Vehicle
          </button>

          <div className="relative w-70">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              //   value={search}
              //   onChange={(e) => setSearch(e.target.value)}
              placeholder="Search here.."
              className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white min-w-full outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-auto custom-scrollbar">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SNo.",
                "Name",
                "Vehicle Number",
                "Vehicle Capacity",
                "Status",
                "Action",
              ].map((h) => (
                <th key={h} className="text-left text-gray-300 px-5 py-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {vehicles.map((item, index) => (
              <tr key={item.id} className="border-t border-gray-800">
                <td className="px-5 py-4 text-gray-300">{index + 1}.</td>

                <td className="px-5 py-4 text-gray-300">{item.name}</td>

                <td className="px-5 py-4 text-gray-300">{item.number}</td>

                <td className="px-5 py-4 text-gray-300">{item.capacity}</td>

                <td className="px-5 py-4">
                  <span
                    className={`text-white px-3 py-1 rounded-lg text-sm ${
                      item.status === "Active" ? "bg-emerald-700" : "bg-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditData(item);
                        setVehicleModal(true);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-lg cursor-pointer"
                    >
                      <Edit size={17} className="text-white" />
                    </button>

                    <button className="bg-red-600 hover:bg-red-700 p-2 rounded-lg cursor-pointer">
                      <Trash2 size={17} className="text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vehicleModal && (
        <VehicleModal
          close={() => {
            setVehicleModal(false);
            setEditData(null);
          }}
          editData={editData}
        />
      )}
    </div>
  );
};

export default ManageVehicles;
