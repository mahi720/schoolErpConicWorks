import React, { useState } from "react";
import {
  Search,
  Filter,
  FileText,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const students = [
    {
      id: 1,
      studentId: "TESTONIC",
      name: "TESTONIC",
      board: "CGBSE",
      class: "Class 1 A",
      year: "2024-2025",
      books: 0,
    },
    {
      id: 2,
      studentId: "98",
      name: "HPSSDR-1820/14",
      board: "CGBSE",
      class: "Nursery",
      year: "2020-2021",
      books: 0,
    },
    {
      id: 3,
      studentId: "97",
      name: "HPSSDR-2693/20",
      board: "CGBSE",
      class: "Nursery",
      year: "2020-2021",
      books: 1,
    },
  ];

  return (
    <div className="space-y-8">
      {/* header */}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-white font-semibold">Student List</h1>

        <div className="flex items-center gap-5">
          {/* search */}

          <div className="flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Student Id / Name"
              className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-l-lg text-white w-60"
            />

            <button className="bg-gray-600 hover:bg-gray-700 border cursor-pointer border-gray-500 px-4 rounded-r-lg text-white">
              <Search size={18} />
            </button>
          </div>

          {/* <button className="flex items-center gap-2 text-indigo-400 cursor-pointer">
            <Filter size={24} />
            Filter
          </button> */}

          {/* <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg cursor-pointer">
            Clear Filter
          </button> */}

          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 cursor-pointer">
            <FileText size={18} />
            Export
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {/* filters */}

      <div className="grid grid-cols-6 gap-6">
        <div>
          <label className="text-gray-400 font-normal text-sm">Board</label>

          <select className="mt-1 cursor-pointer bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg w-full">
            <option>Select Board</option>
            <option>CGBSE</option>
            <option>CBSE</option>
            <option>State Board</option>
          </select>
        </div>

        <div>
          <label className="text-gray-400 font-normal text-sm">Class</label>

          <select className="mt-1 cursor-pointer bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg w-full">
            <option>Select Class</option>
            <option>Nursery</option>
            <option>Class 1</option>
            <option>Class 2</option>
            <option>Class 4</option>
          </select>
        </div>

        <div>
          <label className="text-gray-400 font-normal text-sm">Stream</label>

          <select className="mt-1 cursor-pointer bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg w-full">
            <option>Select Stream</option>
            <option>Science</option>
            <option>Commerce</option>
            <option>Arts</option>
          </select>
        </div>

        <div>
          <label className="text-gray-400 font-normal text-sm">
            Academic Year
          </label>

          <select className="mt-1 cursor-pointer bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg w-full">
            <option>Select Acad. Year</option>
            <option>2024-2025</option>
            <option>2020-2021</option>
          </select>
        </div>

        <div>
          <label className="text-gray-400 font-normal text-sm">Section</label>

          <select className="mt-1 cursor-pointer bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg w-full">
            <option>Select Section</option>
            <option>A</option>
            <option>B</option>
          </select>
        </div>

        {/* <div className="flex items-end">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg cursor-pointer">
            Filter
          </button>
        </div> */}
      </div>

      {/* table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-auto custom-scrollbar">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SNo.",
                "Student ID",
                "Student Name",
                "Board",
                "Class Section/Stream",
                "Academic Year",
                "Issued Books",
                "Action",
              ].map((h) => (
                <th key={h} className="p-3 text-gray-300 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {students.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-800 hover:bg-gray-800/50"
              >
                <td className="p-3 text-gray-300">{item.id}.</td>

                <td className="p-3 text-gray-300">{item.studentId}</td>

                <td className="p-3 text-indigo-400">{item.name}</td>

                <td className="p-3 text-gray-300">{item.board}</td>

                <td className="p-3 text-gray-300">{item.class}</td>

                <td className="p-3 text-gray-300">{item.year}</td>

                <td className="p-3 text-gray-300">{item.books}</td>

                <td className="p-3">
                  <button
                    onClick={() =>
                      navigate("/library/studentList/student-detail")
                    }
                    className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    <ArrowRight size={20} />
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
