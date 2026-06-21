import React, { useEffect, useRef, useState } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  DollarSign,
  IndianRupeeIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PickupPointModal from "../../components/transportation/PickupPointModal";

const ManagePickupPoints = () => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [menu, setMenu] = useState(null);

  const pickupPoints = [
    {
      id: 1,
      name: "sector 7",
      status: "Active",
      fees: ["30 days - 1000.00", "90 days - 3000.00", "365 days - 12000.00"],
    },
    {
      id: 2,
      name: "sector 10",
      status: "Inactive",
      fees: ["30 days - 500.00"],
    },
    {
      id: 3,
      name: "sector 10",
      status: "Inactive",
      fees: ["30 days - 500.00"],
    },
    {
      id: 4,
      name: "sector 10",
      status: "Inactive",
      fees: ["30 days - 1000.00", "90 days - 3000.00", "365 days - 12000.00"],
    },
    {
      id: 5,
      name: "sector 10",
      status: "Inactive",
      fees: ["30 days - 500.00"],
    },
    {
      id: 6,
      name: "sector 10",
      status: "Inactive",
      fees: ["30 days - 500.00"],
    },
  ];

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
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-white font-semibold">
          Manage Pickup Points
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setEditData(null);
              setModal(true);
            }}
            className="bg-cyan-600 hover:bg-cyan-700 px-5 py-3 rounded-lg text-white flex gap-2 cursor-pointer"
          >
            <Plus size={18} className="mt-1" />
            Create Pickup Point
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

      <div className="overflow-auto custom-scrollbar">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-800">
            <tr>
              {["SNo.", "Name", "Transportation Fees", "Status", "Action"].map(
                (h) => (
                  <th key={h} className="text-left px-5 py-4 text-gray-300">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {pickupPoints.map((item, index) => (
              <tr key={item.id} className="border-t border-gray-800">
                <td className="px-5 py-5 text-gray-300">{index + 1}.</td>

                <td className="px-5 py-5 text-gray-300">{item.name}</td>

                <td className="px-5 py-5 text-gray-300">
                  <div className="space-y-3">
                    {item.fees.map((fee, i) => (
                      <p key={i}>
                        {i + 1}. {fee}
                      </p>
                    ))}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`text-white px-3 py-1 rounded-lg text-sm ${
                      item.status === "Active" ? "bg-emerald-700" : "bg-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-5 py-5 relative">
                  <div ref={menuRef} className="relative inline-block">
                    <button
                      onClick={() => setMenu(menu === item.id ? null : item.id)}
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
                            setModal(true);
                            setMenu(null);
                          }}
                          className="flex items-center gap-3 px-5 py-3 text-gray-300 hover:bg-gray-700 w-full cursor-pointer"
                        >
                          <Edit size={18} />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              "/transportation/pickup-points/manageTransportationFees",
                            )
                          }
                          className="flex items-center cursor-pointer gap-3 px-5 py-3 text-gray-300 hover:bg-gray-700 w-full"
                        >
                          <IndianRupeeIcon size={18} />
                          Manage Fees
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

      {modal && (
        <PickupPointModal close={() => setModal(false)} editData={editData} />
      )}
    </div>
  );
};

export default ManagePickupPoints;
