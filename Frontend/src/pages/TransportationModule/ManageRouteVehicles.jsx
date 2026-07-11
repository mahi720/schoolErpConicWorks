import React, { useEffect, useRef, useState } from "react";
import { Plus, Search, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import RouteVehicleModal from "../../components/transportation/RouteVehicleModal";
import { useNavigate } from "react-router-dom";

const ManageRouteVehicles = () => {
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [menu, setMenu] = useState(null);

  const routes = [
    {
      id: 1,
      route: "Bhuj - madhapar - Morning Shift",
      vehicle: "Vehicle 2",
      pickup: "08:26 AM - 09:49 AM",
      drop: "02:26 PM - 05:49 PM",
      driver: "Rajesh Gandhi",
      driverEmail: "rajesh.gandhi@school.com",
      helper: "Suresh Kumar",
      helperEmail: "suresh.kumar@school.com",
      status: "Active",
    },
    {
      id: 2,
      route: "Bhuj - madhapar - Morning Shift",
      vehicle: "Vehicle 2",
      pickup: "08:26 AM - 09:49 AM",
      drop: "02:26 PM - 05:49 PM",
      driver: "Rajesh Gandhi",
      driverEmail: "rajesh.gandhi@school.com",
      helper: "Suresh Kumar",
      helperEmail: "suresh.kumar@school.com",
      status: "Active",
    },
    {
      id: 3,
      route: "Bhuj - madhapar - Morning Shift",
      vehicle: "Vehicle 2",
      pickup: "08:26 AM - 09:49 AM",
      drop: "02:26 PM - 05:49 PM",
      driver: "Rajesh Gandhi",
      driverEmail: "rajesh.gandhi@school.com",
      helper: "Suresh Kumar",
      helperEmail: "suresh.kumar@school.com",
      status: "Inactive",
    },
  ];

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(null);
      }
    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-white text-2xl font-semibold">
          Manage Route Vehicles
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setEditData(null);
              setModal(true);
            }}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-lg flex gap-2 cursor-pointer"
          >
            <Plus size={20} className="mt-1" />
            Create Route Vehicle
          </button>

          <div className="relative w-70">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              placeholder="Search here.."
              className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white w-full outline-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-auto custom-scrollbar">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-gray-800 whitespace-nowrap">
            <tr>
              {[
                "SNo.",
                "Route",
                "Vehicle",
                "Schedule (Pickup / Drop)",
                "Driver",
                "Helper",
                "Status",
                "Action",
              ].map((h) => (
                <th className="text-left px-5 py-4 text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {routes.map((item, index) => (
              <tr className="border-t border-gray-800">
                <td className="px-5 py-5 text-gray-300">{index + 1}.</td>

                <td className="px-5 py-5 text-gray-300">{item.route}</td>

                <td className="px-5 py-5 text-gray-300 whitespace-nowrap">
                  {item.vehicle}
                </td>

                <td className="px-5 py-5 whitespace-nowrap">
                  <p className="text-gray-300">
                    <span className="bg-emerald-700 px-2 py-1 rounded text-xs">
                      PICKUP
                    </span>{" "}
                    {item.pickup}
                  </p>

                  <p className="text-gray-300 mt-3">
                    <span className="bg-cyan-700 px-2 py-1 rounded text-xs">
                      DROP
                    </span>{" "}
                    {item.drop}
                  </p>
                </td>

                <td className="px-5 py-5">
                  <p className="text-white">{item.driver}</p>

                  <p className="text-gray-500 text-sm">{item.driverEmail}</p>
                </td>

                <td className="px-5 py-5">
                  <p className="text-white">{item.helper}</p>

                  <p className="text-gray-500 text-sm">{item.helperEmail}</p>
                </td>

                <td className="px-5 py-5">
                  <span
                    className={`text-white px-3 py-1 rounded-lg text-sm ${
                      item.status === "Active" ? "bg-emerald-700" : "bg-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-5 py-5">
                  <div ref={menuRef} className="relative inline-block">
                    <button
                      onClick={() => setMenu(menu === item.id ? null : item.id)}
                      className="bg-gray-600 hover:bg-gray-700 p-2 cursor-pointer rounded-lg"
                    >
                      <MoreVertical className="text-white" />
                    </button>

                    {menu === item.id && (
                      <div
                        onMouseDown={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl w-44 overflow-hidden z-50"
                      >
                        <button
                          onClick={() =>
                            navigate("/transportation/route-vehicles/details")
                          }
                          className="flex gap-3 px-5 py-3 cursor-pointer text-gray-300 hover:bg-gray-700 w-full"
                        >
                          <Eye size={18} className="mt-1" />
                          View
                        </button>

                        <button
                          onClick={() => {
                            setEditData(item);
                            setModal(true);
                            setMenu(null);
                          }}
                          className="flex gap-3 px-5 py-3 text-gray-300 cursor-pointer hover:bg-gray-700 w-full"
                        >
                          <Edit size={18} className="mt-1" />
                          Edit
                        </button>

                        <button className="flex gap-3 px-5 py-3 text-red-400 cursor-pointer hover:bg-gray-700 w-full">
                          <Trash2 size={18} className="mt-1" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <RouteVehicleModal close={() => setModal(false)} editData={editData} />
      )}
    </div>
  );
};

export default ManageRouteVehicles;
