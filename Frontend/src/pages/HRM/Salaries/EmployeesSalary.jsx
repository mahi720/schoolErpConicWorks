import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmployeesSalary() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const employees = [
    {
      id: 1,
      name: "Admin",
      code: "Admin001 (Admin001)",
      dept: "Teaching (Admin)",
      salary: "25192",
      saved: "NO",
      locked: "NO",
    },
    {
      id: 2,
      name: "Rohan Sharma",
      code: "R007 (R007)",
      dept: "Teaching (Admin)",
      salary: "17520",
      saved: "NO",
      locked: "NO",
    },
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(employees.map((e) => e.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    selected.includes(id)
      ? setSelected(selected.filter((i) => i !== id))
      : setSelected([...selected, id]);
  };

  return (
    <div className="space-y-8">
      {/* header */}

      <div className="flex justify-between items-start">
        <h1 className="text-3xl text-white font-bold">Employees</h1>

        <div className="space-y-3">
          <div className="flex gap-3 justify-end">
            <button className="bg-indigo-600 px-5 hover:bg-indigo-700 py-2 rounded-lg text-white cursor-pointer">
              Bank Statement
            </button>

            <button className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-lg text-white cursor-pointer">
              Salary Statement
            </button>

            <button className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-white cursor-pointer">
              Leave Balance
            </button>

            <button className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg text-white cursor-pointer">
              All Payslip
            </button>
          </div>

          <div className="flex gap-3">
            <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-60 cursor-pointer">
              <option>Select Month</option>
              <option>Sep</option>
              <option>Aug</option>
              <option>July</option>
              <option>June</option>
              <option>May</option>
              <option>April</option>
              <option>March</option>
              <option>Feb</option>
              <option>Jan</option>
            </select>

            <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-60 cursor-pointer">
              <option>Select Year</option>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>

            <button className="bg-green-500 px-5 hover:bg-green-600 py-2 rounded-lg text-white cursor-pointer">
              GO
            </button>

            <button className="bg-cyan-500 px-5 py-2 hover:bg-cyan-600 rounded-lg text-white cursor-pointer">
              Save
            </button>

            <button className="bg-gray-800 px-5 py-2 rounded-lg hover:bg-gray-600 text-white cursor-pointer">
              Lock
            </button>

            <button className="bg-indigo-600 px-5 py-2 hover:bg-indigo-700 rounded-lg text-white cursor-pointer">
              Attendance Detail
            </button>
          </div>
        </div>
      </div>

      {/* breadcrumb */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-5 text-gray-400">
        {/* Dashboard / Employee */}
      </div>

      {/* filters */}

      <div className="grid grid-cols-4 gap-6">
        <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white cursor-pointer">
          <option>Select Department</option>
          <option>Teaching</option>
          <option>Non-Teaching</option>
        </select>

        <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white cursor-pointer">
          <option>Select Designation</option>
          <option>Principle</option>
          <option>TGT</option>
          <option>PRT</option>
          <option>Music Teacher</option>
          <option>Dance Teacher</option>
        </select>

        <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white cursor-pointer">
          <option>Select Employee</option>
          <option>Admin</option>
          <option>Rohan Sharama</option>
        </select>

        <button className="bg-green-500 hover:bg-green-600 rounded-lg text-white cursor-pointer">
          Search
        </button>
      </div>

      {/* table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selected.length === employees.length}
                  onChange={handleSelectAll}
                  className="cursor-pointer"
                />
              </th>

              {[
                "SNo.",
                "Employee Name",
                "Employee ID/Code",
                "Department/Designation",
                "Salary",
                "Saved",
                "Locked",
                "More",
              ].map((h) => (
                <th className="p-4 text-gray-300 text-left">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {employees.map((emp, index) => (
              <tr
                key={emp.id}
                className="border-t border-gray-800 hover:bg-gray-800/50"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(emp.id)}
                    onChange={() => handleSelect(emp.id)}
                    className="cursor-pointer"
                  />
                </td>

                <td className="p-4 text-gray-300">{index + 1}.</td>

                <td className="p-4 text-indigo-400">{emp.name}</td>

                <td className="p-4 text-gray-300">{emp.code}</td>

                <td className="p-4 text-gray-300">{emp.dept}</td>

                <td className="p-4 text-gray-300">₹ {emp.salary}</td>

                <td className="p-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded">
                    {emp.saved}
                  </span>
                </td>

                <td className="p-4">
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded">
                    {emp.locked}
                  </span>
                </td>

                <td className="p-4">
                  <button
                    onClick={() =>
                      navigate("/hrm/salary-management/salary-details")
                    }
                    className="text-indigo-400 cursor-pointer"
                  >
                    <ArrowRight />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
