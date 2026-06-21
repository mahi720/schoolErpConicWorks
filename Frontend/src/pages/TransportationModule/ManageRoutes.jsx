import React, { useEffect, useRef, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  IndianRupeeIcon,
  Route,
} from "lucide-react";
import RouteModal from "../../components/transportation/RouteModal";
import { useNavigate } from "react-router-dom";

const ManageRoutes = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menu, setMenu] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: "Bhuj - madhapar",
      distance: "20.00",
      shift: "Morning Shift",
      status: "Active",
      pickup: 4,
    },
    {
      id: 2,
      name: "Bhuj-Anjar",
      distance: "15.00",
      shift: "Morning Shift",
      status: "Active",
      pickup: 3,
    },
    {
      id: 3,
      name: "Bhuj-Anjar",
      distance: "15.00",
      shift: "Morning Shift",
      status: "Active",
      pickup: 3,
    },
    {
      id: 4,
      name: "Bhuj-Anjar",
      distance: "15.00",
      shift: "Morning Shift",
      status: "Inactive",
      pickup: 3,
    },
    {
      id: 5,
      name: "Bhuj-Anjar",
      distance: "15.00",
      shift: "Morning Shift",
      status: "Active",
      pickup: 3,
    },
  ]);

  const handleEdit = (item) => {
    setEditData(item);
    setOpenModal(true);
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(null);
      }
    };

    document.addEventListener("mousedown", closeMenu);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}

      {/* Header */}

      <div className="flex items-center gap-5">
        <h1 className="text-3xl font-semibold text-white whitespace-nowrap">
          Manage routes
        </h1>

        <div className="flex justify-end items-center gap-4 w-full">
          <button
            onClick={() => {
              setEditData(null);
              setOpenModal(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 px-5 py-3 rounded-lg text-white flex gap-2 cursor-pointer whitespace-nowrap"
          >
            <Plus size={18} className="mt-1" />
            Create Route
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

      {/* List */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl text-white font-semibold">List Routes</h2>
        </div>

        <div className="overflow-auto custom-scrollbar">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-800">
              <tr>
                {[
                  "SNo.",
                  "Name",
                  "Distance (KM)",
                  "Shift",
                  "Status",
                  "Pickup points",
                  "Action",
                ].map((h) => (
                  <th className="px-5 py-4 text-left text-gray-300">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {routes.map((item, index) => (
                <tr className="border-t border-gray-800">
                  <td className="px-5 py-4 text-gray-300">{index + 1}.</td>

                  <td className="px-5 py-4 text-gray-300">{item.name}</td>

                  <td className="px-5 py-4 text-gray-300">{item.distance}</td>

                  <td className="px-5 py-4 text-gray-300">{item.shift}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`text-white px-3 py-1 rounded-lg text-sm ${
                        item.status === "Active"
                          ? "bg-emerald-700"
                          : "bg-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-300">{item.pickup}</td>

                  <td className="px-5 py-5 relative">
                    <div ref={menuRef} className="relative inline-block">
                      <button
                        onClick={() =>
                          setMenu(menu === item.id ? null : item.id)
                        }
                        className="bg-gray-600 p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                      >
                        <MoreVertical className="text-white" />
                      </button>

                      {menu === item.id && (
                        <div
                          onMouseDown={(e) => e.stopPropagation()}
                          className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl w-48 shadow-xl z-50 overflow-hidden"
                        >
                          <button
                            onClick={() => {
                              setEditData(item);
                              setOpenModal(true);
                              setMenu(null);
                            }}
                            className="flex items-center gap-3 px-5 py-3 text-gray-300 hover:bg-gray-700 w-full cursor-pointer"
                          >
                            <Edit size={18} />
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              navigate("/transportation/routes/change-order")
                            }
                            className="flex items-center cursor-pointer gap-3 px-5 py-3 text-gray-300 hover:bg-gray-700 w-full"
                          >
                            <Route size={18} />
                            Change Order
                          </button>

                          <button className="flex items-center cursor-pointer gap-3 px-5 py-3 text-red-400 hover:bg-gray-700 w-full">
                            <Trash2 size={18} />
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
      </div>

      {openModal && (
        <RouteModal
          editData={editData}
          close={() => {
            setOpenModal(false);
            setEditData(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageRoutes;
