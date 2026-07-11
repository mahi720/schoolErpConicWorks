import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  DollarSign,
  Plus,
  ReceiptIndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DriverHelperModal from "../../components/transportation/DriverHelperModal";

const ManageDriverHelper = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [menu, setMenu] = useState(null);
  const [selected, setSelected] = useState([]);

  const staffs = [
    {
      id: 1,
      name: "Suresh Kumar",
      email: "suresh.kumar@school.com",
      role: "Helper",
      mobile: "9876501234",
      status: "Active",
    },
    {
      id: 2,
      name: "Rajesh Gandhi",
      email: "rajesh.gandhi@school.com",
      role: "Driver",
      mobile: "9876543210",
      status: "Active",
    },
    {
      id: 5,
      name: "Rajesh Gandhi",
      email: "rajesh.gandhi@school.com",
      role: "Driver",
      mobile: "9876543210",
      status: "Active",
    },
    {
      id: 3,
      name: "Rajesh Gandhi",
      email: "rajesh.gandhi@school.com",
      role: "Driver",
      mobile: "9876543210",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Rajesh Gandhi",
      email: "rajesh.gandhi@school.com",
      role: "Driver",
      mobile: "9876543210",
      status: "Active",
    },
  ];

  const selectAll = (e) => {
    if (e.target.checked) {
      setSelected(staffs.map((item) => item.id));
    } else {
      setSelected([]);
    }
  };

  const selectSingle = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-white font-semibold">Staff List</h1>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setEditData(null);
              setModal(true);
            }}
            className="bg-cyan-600 hover:bg-cyan-700 px-5 py-3 rounded-lg text-white flex gap-2 cursor-pointer"
          >
            <Plus size={18} className="mt-1" />
            Create Driver/Helper
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

      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="w-14 px-5 py-4 text-center">
              <input
                type="checkbox"
                checked={selected.length === staffs.length}
                onChange={selectAll}
                className="cursor-pointer w-4 h-4"
              />
            </th>
            {["SNo.", "Name", "Roles", "Mobile", "Status", "Action"].map(
              (h) => (
                <th className="px-5 py-4 text-left text-gray-300">{h}</th>
              ),
            )}
          </tr>
        </thead>

        <tbody>
          {staffs.map((item, index) => (
            <tr className="border-t border-gray-800">
              <td className="w-14 px-5 py-5 text-center">
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={() => selectSingle(item.id)}
                  className="cursor-pointer w-4 h-4"
                />
              </td>
              <td className="px-5 py-5 text-gray-300">{index + 1}.</td>

              <td className="px-5 py-5">
                <p className="text-white">{item.name}</p>

                <p className="text-gray-500 text-sm">{item.email}</p>
              </td>

              <td className="px-5 py-5 text-gray-300">{item.role}</td>

              <td className="px-5 py-5 text-gray-300">{item.mobile}</td>

              <td className="px-5 py-4">
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
                    className="bg-gray-600 p-2 rounded-lg cursor-pointer hover:bg-gray-700"
                  >
                    <MoreVertical className="text-white" />
                  </button>

                  {menu === item.id && (
                    <div
                      onMouseDown={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl w-52 overflow-hidden z-50"
                    >
                      <button
                        onClick={() => {
                          setEditData(item);
                          setModal(true);
                          setMenu(null);
                        }}
                        className="flex gap-3 px-5 py-3 cursor-pointer text-gray-300 hover:bg-gray-700 w-full"
                      >
                        <Edit size={18} className="mt-1" />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          navigate("/hrm/employees/salary-structure")
                        }
                        className="flex gap-3 px-5 py-3 cursor-pointer text-gray-300 hover:bg-gray-700 w-full"
                      >
                        <ReceiptIndianRupee size={18} className="mt-1" />
                        Salary Structure
                      </button>

                      <button className="flex gap-3 px-5 py-3 cursor-pointer text-red-400 hover:bg-gray-700 w-full">
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

      {modal && (
        <DriverHelperModal close={() => setModal(false)} editData={editData} />
      )}
    </div>
  );
};

export default ManageDriverHelper;
