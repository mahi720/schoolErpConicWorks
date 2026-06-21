import React, { useState } from "react";
import {
  Eye,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InactiveStudents() {
  const navigate = useNavigate();
  const [students] = useState([
    {
      id: 1,
      admissionNo: "100",
      boardRegNo: "NA",
      studentId: "HPSSDR-1957/15",
      studentName: "ELIZABETH ABRAHAM",
      fatherName: "DAVALA",
      parentFromHAL: "NHAL",
      dob: "01/01/1970",
      board: "CBSE",
      className: "Nursery",
      section: "A",
      category: "General",
      gender: "F",
      phone: "NA",
      inactiveDate: "01-11-2025",
    },

    {
      id: 2,
      admissionNo: "99",
      boardRegNo: "NA",
      studentId: "HPSSDR-1871/14",
      studentName: "J AKSHITH",
      fatherName: "J AKSHITH",
      parentFromHAL: "NHAL",
      dob: "01/01/1970",
      board: "CBSE",
      className: "Nursery",
      section: "A",
      category: "General",
      gender: "M",
      phone: "NA",
      inactiveDate: "02-11-2025",
    },

    {
      id: 3,
      admissionNo: "2756380",
      boardRegNo: "NA",
      studentId: "00510",
      studentName: "Test 1",
      fatherName: "tttt",
      parentFromHAL: "NHAL",
      dob: "29/07/2015",
      board: "CBSE",
      className: "XI",
      section: "A",
      category: "General",
      gender: "F",
      phone: "9691257900",
      inactiveDate: "08-11-2025",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Inactive Students</h1>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-xl text-white cursor-pointer">
            <FileSpreadsheet size={18} />
            Excel
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-red-500 rounded-xl text-white cursor-pointer">
            <FileText size={18} />
            PDF
          </button>
        </div>
      </div>

      {/* Filters */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <select className="w-56 bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white">
              <option>Select Board</option>
              <option>ICSE</option>
              <option>CBSE</option>
              <option>CGBSE</option>
            </select>

            <select className="w-56 bg-gray-800 cursor-pointer border border-gray-700 rounded-xl p-3 text-white">
              <option>Select Class</option>
              <option>Nursery</option>
              <option>LKG</option>
            </select>

            <select className="w-56 bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white">
              <option>Select Section</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-4 text-gray-400"
              />

              <input
                placeholder="Search by Name, Father Name"
                className="w-72 bg-gray-800 border border-gray-700 rounded-xl pl-10 p-3 text-white"
              />
            </div>

            <button className="px-5 border-gray-200 border rounded-xl hover:bg-gray-700 text-white cursor-pointer">
              Go
            </button>
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1700px]">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  SN.
                </th>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Adm no.
                </th>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Board Reg No.
                </th>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Student ID
                </th>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Student Name
                </th>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Father Name
                </th>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Parent From HAL
                </th>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  DOB
                </th>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Board
                </th>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Class
                </th>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Section
                </th>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Category
                </th>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Gender
                </th>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Phone
                </th>
                <th className="p-4 text-left text-gray-300 whitespace-nowrap">
                  Inactive Date
                </th>
                <th className="p-4 text-center text-gray-300">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  className="border-t border-gray-800 hover:bg-gray-800/30"
                >
                  <td className="p-4 text-white">{index + 1}.</td>

                  <td className="p-4 text-white">{student.admissionNo}</td>

                  <td className="p-4 text-white">{student.boardRegNo}</td>

                  <td className="p-4 text-white">{student.studentId}</td>

                  <td className="p-4 text-white">{student.studentName}</td>

                  <td className="p-4 text-white">{student.fatherName}</td>

                  <td className="p-4 text-white">{student.parentFromHAL}</td>

                  <td className="p-4 text-white">{student.dob}</td>

                  <td className="p-4 text-white">{student.board}</td>

                  <td className="p-4 text-white">{student.className}</td>

                  <td className="p-4 text-white">{student.section}</td>

                  <td className="p-4 text-white">{student.category}</td>

                  <td className="p-4 text-white">{student.gender}</td>

                  <td className="p-4 text-white">{student.phone}</td>

                  <td className="p-4 text-white">{student.inactiveDate}</td>

                  <td className="p-4">
                    <div className="flex flex-row gap-2 items-center">
                      <button
                        className="p-2 bg-indigo-600 rounded-lg text-white cursor-pointer"
                        onClick={() =>
                          navigate(`/academic/student-profile/${student.id}`)
                        }
                        title="View"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className="p-2 bg-emerald-500 rounded-lg text-white cursor-pointer"
                        title="Activate Student"
                      >
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
      </div>
    </div>
  );
}
