import React, { useState } from "react";
import { Search, Eye, Plus, ClipboardPlus } from "lucide-react";
import AddHealthInfoModal from "../../components/academics/StudentHealthManagementModal/AddHealthInfoModal";
import AddOtherInfoModal from "../../components/academics/StudentHealthManagementModal/AddOtherInfoModal";

export default function StudentHealthManagement() {
  const [healthModal, setHealthModal] = useState(false);
  const [otherModal, setOtherModal] = useState(false);

  const students = [
    {
      adm: "test",
      boardReg: "NA",
      id: "HPSSDR-1820/14",
      name: "test",
      father: "test",
      parent: "NHAL",
      dob: "25/04/2019",
      board: "CGBSE",
      class: "Class 1",
      section: "A",
      phone: "9131260698",
    },
    {
      adm: "98",
      boardReg: "NA",
      id: "HPSSDR-1820/14",
      name: "K U THANEESH",
      father: "K U THANEESH",
      parent: "NHAL",
      dob: "01/01/1970",
      board: "CGBSE",
      class: "Nursery",
      section: "A",
      phone: "NA",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Student Health Management
        </h1>

        <p className="text-gray-400 mt-1">Manage students health records</p>
      </div>

      {/* Filters */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="grid grid-cols-6 gap-4">
          <select className="input cursor-pointer">
            <option>Select Board</option>
            <option>CBSE</option>
            <option>BSEB</option>
            <option>CGBSE</option>
          </select>

          <select className="input cursor-pointer">
            <option>Select Class</option>
            <option>Class 1</option>
            <option>Class 2</option>
            <option>Class 3</option>
            <option>Class 4</option>
          </select>

          <select className="input cursor-pointer">
            <option>Select Section</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>

          <select className="input cursor-pointer">
            <option>Select Acad. Year</option>
            <option>2025-26</option>
            <option>2024-25</option>
            <option>2023-24</option>
          </select>

          <select className="input cursor-pointer">
            <option>Select Category</option>
            <option>OBC</option>
            <option>General</option>
          </select>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />

            <input
              placeholder="Search student..."
              className="input w-full !pl-12 pr-4"
            />
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-auto max-h-[500px] custom-scrollbar">
        <table className="w-full text-sm">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SN.",
                "Adm No.",
                "Board Reg.",
                "Student ID",
                "Student",
                "Father",
                "Parent",
                "DOB",
                "Board",
                "Class",
                "Section",
                "Phone",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="p-4 text-left text-gray-300 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr
                key={i}
                className="border-t border-gray-800 hover:bg-gray-800/50 transition"
              >
                <td className="td">{i + 1}.</td>

                <td className="td">{s.adm}</td>

                <td className="td">{s.boardReg}</td>

                <td className="td">{s.id}</td>

                <td className="td font-semibold text-white">{s.name}</td>

                <td className="td">{s.father}</td>

                <td className="td">{s.parent}</td>

                <td className="td">{s.dob}</td>

                <td className="td">{s.board}</td>

                <td className="td">{s.class}</td>

                <td className="td">{s.section}</td>

                <td className="td">{s.phone}</td>

                {/* Actions */}

                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg">
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => setHealthModal(true)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 cursor-pointer rounded-lg"
                    >
                      <ClipboardPlus title="Add Health Info" size={16} />
                    </button>

                    <button
                      onClick={() => setOtherModal(true)}
                      className="bg-green-500 hover:bg-green-600 text-white cursor-pointer p-2 rounded-lg"
                    >
                      <Plus title="Add Other Info" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddHealthInfoModal
        open={healthModal}
        close={() => setHealthModal(false)}
      />

      <AddOtherInfoModal open={otherModal} close={() => setOtherModal(false)} />
    </div>
  );
}
