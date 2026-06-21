import React, { useState } from "react";
import {
  Search,
  Upload,
  Download,
  Plus,
  Edit,
  Eye,
  RefreshCcw,
  BanknoteArrowUp,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginStatusModal from "../../../components/HRM/Employee/LoginStatus";
import ConfirmModal from "../../../components/HRM/Employee/DRF";

export default function Employees() {
  const navigate = useNavigate();
  const [loginModal, setLoginModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [drfValue, setDrfValue] = useState("");
  const employees = [
    {
      id: 1285,
      name: "SHAGUFTA KHANUM",
      dept: "TEACHING",
      designation: "PGT",
      nature: "Adhoc",
      phone: "7899006766",
      email: "shagufta@school.com",
    },
    {
      id: 1237,
      name: "PUJA MAITY",
      dept: "TEACHING",
      designation: "TGT",
      nature: "Adhoc",
      phone: "999999",
      email: "pooja@school.com",
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h2 className="text-xl text-white font-semibold">Employees</h2>

        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />

            <input
              placeholder="Search"
              className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white w-80"
            />
          </div>

          <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white flex gap-2 cursor-pointer">
            <Upload size={17} className="mt-1" />
            Import Excel
          </button>

          <button className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-white flex gap-2 cursor-pointer">
            <Download size={17} className="mt-1" />
            Export
          </button>

          <button
            onClick={() => navigate("/hrm/employees/add-employee-form")}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white flex gap-2 cursor-pointer"
          >
            <Plus size={17} className="mt-1" />
            Add New Employee
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-auto custom-scrollbar">
        <table className="w-full min-w-[1300px]">
          <thead className="bg-gray-800">
            <tr>
              {[
                "Sno.",
                "E Sn.",
                "Emp Id",
                "Name/Code",
                "Department",
                "Designation",
                "Nature of Appointment",
                "Phone Number",
                "Email",
                "LS",
                "DRF",
                "Action",
              ].map((h) => (
                <th key={h} className="p-3 text-left text-gray-300">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {employees.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-gray-800 hover:bg-gray-800/50"
              >
                <td className="p-3 text-gray-300">{index + 1}</td>

                <td className="p-3 text-indigo-400">0</td>

                <td className="p-3 text-gray-300">{item.id}</td>

                <td className="p-3 text-indigo-400 whitespace-nowrap cursor-pointer">
                  {item.name} ({item.id})
                </td>

                <td className="p-3 text-gray-300">{item.dept}</td>

                <td className="p-3 text-gray-300">{item.designation}</td>

                <td className="p-3 text-gray-300">{item.nature}</td>

                <td className="p-3 text-gray-300">{item.phone}</td>

                <td className="p-3 text-gray-300">{item.email}</td>

                <td className="p-3">
                  <button
                    onClick={() => setLoginModal(true)}
                    className="bg-indigo-600 rounded-lg text-white px-3 py-1 cursor-pointer"
                  >
                    D
                  </button>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => {
                      setDrfValue("No");
                      setConfirmModal(true);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg cursor-pointer"
                  >
                    No
                  </button>
                </td>

                <td className="p-3">
                  <div className="flex gap-3">
                    <button className="text-white bg-green-500 hover:bg-green-600 rounded-lg cursor-pointer p-2 ">
                      <Edit size={17} />
                    </button>

                    <button className="text-white bg-red-500 p-2 hover:bg-red-600 rounded-lg cursor-pointer">
                      <Trash2 size={17} />
                    </button>

                    <button
                      onClick={() =>
                        navigate("/hrm/employees/salary-structure")
                      }
                      className="text-white bg-blue-400 hover:bg-blue-500 p-2 rounded-lg cursor-pointer"
                    >
                      <BanknoteArrowUp size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <LoginStatusModal open={loginModal} close={() => setLoginModal(false)} />

      <ConfirmModal
        open={confirmModal}
        close={() => setConfirmModal(false)}
        value={drfValue}
      />
    </div>
  );
}
