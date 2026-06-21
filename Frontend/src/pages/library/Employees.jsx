import React, { useState } from "react";
import {
  Search,
  Filter,
  FileText,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Employees = () => {
  const navigate = useNavigate();
  const [exportOpen, setExportOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterData, setFilterData] = useState({
    department: "",
    designation: "",
  });

  const employees = [
    {
      id: 1,
      empId: "Admin001",
      name: "Admin",
      department: "Teaching",
      designation: "Admin",
      issuedBooks: 0,
    },
    {
      id: 2,
      empId: "R007",
      name: "Ritesh",
      department: "Teaching",
      designation: "Admin",
      issuedBooks: 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-white">Employees List</h1>

        <div className="flex gap-5 items-center">
          {/* Search */}

          <div className="flex">
            <input
              placeholder="Employee Id / Name"
              className="bg-gray-800 border border-gray-700 px-4 py-3 text-white rounded-l-lg outline-none w-72"
            />

            <button className="bg-gray-700 hover:bg-gray-600 px-4 text-white rounded-r-lg cursor-pointer">
              <Search size={18} />
            </button>
          </div>

          {/* Filter */}

          <button
            onClick={() => {
              setShowFilter(!showFilter);

              if (showFilter) {
                setFilterData({
                  department: "",
                  designation: "",
                });
              }
            }}
            className="flex gap-2 items-center text-indigo-400 cursor-pointer"
          >
            <Filter size={22} />
            Filter
          </button>

          {/* Export */}

          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg text-white flex gap-2 cursor-pointer"
            >
              <FileText size={17} className="mt-1" />
              Export
              <ChevronDown size={17} className="mt-1" />
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg w-40 z-50">
                <p className="px-4 py-3 text-white hover:bg-gray-700 cursor-pointer">
                  Excel
                </p>

                <p className="px-4 py-3 text-white hover:bg-gray-700 cursor-pointer">
                  PDF
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFilter && (
        <div className="grid grid-cols-2 gap-6 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div>
            <label className="text-gray-400">Department :</label>

            <select
              value={filterData.department}
              onChange={(e) =>
                setFilterData({
                  ...filterData,
                  department: e.target.value,
                })
              }
              className="bg-gray-800 border cursor-pointer border-gray-700 mt-2 text-white rounded-lg px-4 py-3 w-full"
            >
              <option value="">Select Department</option>

              <option>Teaching</option>
              <option>Account</option>
              <option>Library</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400">Designation :</label>

            <select
              value={filterData.designation}
              onChange={(e) =>
                setFilterData({
                  ...filterData,
                  designation: e.target.value,
                })
              }
              className="bg-gray-800 border cursor-pointer border-gray-700 mt-2 text-white rounded-lg px-4 py-3 w-full"
            >
              <option value="">Select Designation</option>
              <option>Admin</option>
              <option>Teacher</option>
              <option>Librarian</option>
            </select>
          </div>
        </div>
      )}

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-auto custom-scrollbar">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SNo.",
                "Employee ID",
                "Employee Name",
                "Department",
                "Designation",
                "Issued Books",
                "Action",
              ].map((item) => (
                <th key={item} className="px-6 py-4 text-left text-gray-300">
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {employees.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-800 hover:bg-gray-800/50"
              >
                <td className="px-6 py-4 text-gray-300">{item.id}.</td>

                <td className="px-6 py-4 text-gray-300">{item.empId}</td>

                <td className="px-6 py-4 text-indigo-400">{item.name}</td>

                <td className="px-6 py-4 text-gray-300">{item.department}</td>

                <td className="px-6 py-4 text-gray-300">{item.designation}</td>

                <td className="px-6 py-4 text-gray-300">{item.issuedBooks}</td>

                <td className="px-6 py-4">
                  <ArrowRight
                    onClick={() =>
                      navigate("/library/employeeList/employee-detail")
                    }
                    size={18}
                    className="text-indigo-400 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
    </div>
  );
};

export default Employees;
