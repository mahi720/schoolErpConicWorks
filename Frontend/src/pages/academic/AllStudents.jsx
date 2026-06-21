import React, { useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  X,
  FileSpreadsheet,
  FileText,
  List,
  Filter,
  Trash2,
} from "lucide-react";
import AddStudentModal from "../../components/academics/addNewStudent/AddNewStudentComponent";
import { useNavigate } from "react-router-dom";

export default function AllStudents() {
  const navigate = useNavigate();
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [students] = useState([
    {
      id: 1,
      admNo: 226,
      admDate: "09-03-2019",
      rollNo: 723,
      studentName: "VIKRANT GUPTA",
      fatherName: "RAJESH GUPTA",
      motherName: "SARITA GUPTA",
      dob: "14/07/2012",
      board: "CBSE",
      class: "VII",
      section: "A",
      apaarId: "421016335438",
      penNo: "22195075733",
      aadharNo: "468180189334",
      category: "General",
      gender: "M",
      bloodGroup: "NA",
      phone: "7024550145",
      address: "H.NO-101, WARD NO-31, DURGA MANDIR ROAD, KHURSIPAR",
    },

    {
      id: 2,
      admNo: 225,
      admDate: "09-03-2019",
      rollNo: 722,
      studentName: "RUDRA PAL",
      fatherName: "AZAD PAL",
      motherName: "NEETA PAL",
      dob: "22/05/2013",
      board: "CBSE",
      class: "VII",
      section: "A",
      apaarId: "358103779377",
      penNo: "22037544366",
      aadharNo: "806967575703",
      category: "OBC",
      gender: "M",
      bloodGroup: "NA",
      phone: "7489791223",
      address: "WARD NO-31, SUBHASH NAGAR, KHURSIPAR",
    },
    {
      id: 2,
      admNo: 225,
      admDate: "09-03-2019",
      rollNo: 722,
      studentName: "RUDRA PAL",
      fatherName: "AZAD PAL",
      motherName: "NEETA PAL",
      dob: "22/05/2013",
      board: "CBSE",
      class: "VII",
      section: "A",
      apaarId: "358103779377",
      penNo: "22037544366",
      aadharNo: "806967575703",
      category: "OBC",
      gender: "M",
      bloodGroup: "NA",
      phone: "7489791223",
      address: "WARD NO-31, SUBHASH NAGAR, KHURSIPAR",
    },
    {
      id: 2,
      admNo: 225,
      admDate: "09-03-2019",
      rollNo: 722,
      studentName: "RUDRA PAL",
      fatherName: "AZAD PAL",
      motherName: "NEETA PAL",
      dob: "22/05/2013",
      board: "CBSE",
      class: "VII",
      section: "A",
      apaarId: "358103779377",
      penNo: "22037544366",
      aadharNo: "806967575703",
      category: "OBC",
      gender: "M",
      bloodGroup: "NA",
      phone: "7489791223",
      address: "WARD NO-31, SUBHASH NAGAR, KHURSIPAR",
    },
    {
      id: 2,
      admNo: 225,
      admDate: "09-03-2019",
      rollNo: 722,
      studentName: "RUDRA PAL",
      fatherName: "AZAD PAL",
      motherName: "NEETA PAL",
      dob: "22/05/2013",
      board: "CBSE",
      class: "VII",
      section: "A",
      apaarId: "358103779377",
      penNo: "22037544366",
      aadharNo: "806967575703",
      category: "OBC",
      gender: "M",
      bloodGroup: "NA",
      phone: "7489791223",
      address: "WARD NO-31, SUBHASH NAGAR, KHURSIPAR",
    },
    {
      id: 2,
      admNo: 225,
      admDate: "09-03-2019",
      rollNo: 722,
      studentName: "RUDRA PAL",
      fatherName: "AZAD PAL",
      motherName: "NEETA PAL",
      dob: "22/05/2013",
      board: "CBSE",
      class: "VII",
      section: "A",
      apaarId: "358103779377",
      penNo: "22037544366",
      aadharNo: "806967575703",
      category: "OBC",
      gender: "M",
      bloodGroup: "NA",
      phone: "7489791223",
      address: "WARD NO-31, SUBHASH NAGAR, KHURSIPAR",
    },
    {
      id: 2,
      admNo: 225,
      admDate: "09-03-2019",
      rollNo: 722,
      studentName: "RUDRA PAL",
      fatherName: "AZAD PAL",
      motherName: "NEETA PAL",
      dob: "22/05/2013",
      board: "CBSE",
      class: "VII",
      section: "A",
      apaarId: "358103779377",
      penNo: "22037544366",
      aadharNo: "806967575703",
      category: "OBC",
      gender: "M",
      bloodGroup: "NA",
      phone: "7489791223",
      address: "WARD NO-31, SUBHASH NAGAR, KHURSIPAR",
    },
    {
      id: 2,
      admNo: 225,
      admDate: "09-03-2019",
      rollNo: 722,
      studentName: "RUDRA PAL",
      fatherName: "AZAD PAL",
      motherName: "NEETA PAL",
      dob: "22/05/2013",
      board: "CBSE",
      class: "VII",
      section: "A",
      apaarId: "358103779377",
      penNo: "22037544366",
      aadharNo: "806967575703",
      category: "OBC",
      gender: "M",
      bloodGroup: "NA",
      phone: "7489791223",
      address: "WARD NO-31, SUBHASH NAGAR, KHURSIPAR",
    },
    {
      id: 2,
      admNo: 225,
      admDate: "09-03-2019",
      rollNo: 722,
      studentName: "RUDRA PAL",
      fatherName: "AZAD PAL",
      motherName: "NEETA PAL",
      dob: "22/05/2013",
      board: "CBSE",
      class: "VII",
      section: "A",
      apaarId: "358103779377",
      penNo: "22037544366",
      aadharNo: "806967575703",
      category: "OBC",
      gender: "M",
      bloodGroup: "NA",
      phone: "7489791223",
      address: "WARD NO-31, SUBHASH NAGAR, KHURSIPAR",
    },
    {
      id: 2,
      admNo: 225,
      admDate: "09-03-2019",
      rollNo: 722,
      studentName: "RUDRA PAL",
      fatherName: "AZAD PAL",
      motherName: "NEETA PAL",
      dob: "22/05/2013",
      board: "CBSE",
      class: "VII",
      section: "A",
      apaarId: "358103779377",
      penNo: "22037544366",
      aadharNo: "806967575703",
      category: "OBC",
      gender: "M",
      bloodGroup: "NA",
      phone: "7489791223",
      address: "WARD NO-31, SUBHASH NAGAR, KHURSIPAR",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">Students</h1>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 cursor-pointer"
            onClick={() => setShowStudentModal(true)}
          >
            <Plus size={18} />
            Add New Student
          </button>

          <button className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer">
            Namelist
          </button>

          <button className="w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center cursor-pointer">
            <List size={18} />
          </button>

          <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 cursor-pointer">
            <FileSpreadsheet size={18} />
            Excel
          </button>

          <button className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 cursor-pointer">
            <FileText size={18} />
            PDF
          </button>
        </div>
      </div>

      {/* Filters */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="grid grid-cols-5 gap-4">
          <select className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white">
            <option>Select Board</option>
            <option>CBSE</option>
            <option>CGBSE</option>
            <option>State Board</option>
          </select>

          <select className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white">
            <option>Select Class</option>
            <option>Nursery</option>
            <option>LKG</option>
            <option>UKG</option>
            <option>I</option>
            <option>II</option>
          </select>

          <select className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white">
            <option>Select Section</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
          </select>

          <select className="bg-gray-800 border border-gray-700 cursor-pointer rounded-xl p-3 text-white">
            <option>Select Category</option>
            <option>General</option>
            <option>OBC</option>
            <option>SC</option>
            <option>ST</option>
          </select>

          <div className="relative">
            <Search size={18} className="absolute left-3 top-4 text-gray-400" />

            <input
              placeholder="Name, Father Name, Phone etc."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 p-3 text-white"
            />
          </div>

          <select className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white">
            <option>Select Academic Year</option>
            <option>2024-25</option>
            <option>2025-26</option>
            <option>2026-27</option>
            <option>2027-28</option>
          </select>

          <select className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white">
            <option>Select Sponsership</option>
            <option>Self/Parent</option>
            <option>RTE</option>
            <option>Non-RTE</option>
            <option>Others</option>
          </select>

          <select className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white">
            <option>Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Transgender</option>
            <option>Other</option>
          </select>

          <select className="bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white">
            <option>Select Parent From HAL</option>
            <option>HAL</option>
            <option>NHAL</option>
            <option>TCL</option>
          </select>

          <button className="w-20 rounded-xl bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center gap-2 cursor-pointer">
            <Filter size={18} />
            Go
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1800px]">
            <thead className="bg-gray-800">
              <tr>
                {[
                  "SN",
                  "Adm no.",
                  "Adm date",
                  "Roll No.",
                  "Student Name",
                  "Father Name",
                  "Mother Name",
                  "DOB",
                  "Board",
                  "Class",
                  "Section",
                  "Apaar Id",
                  "PEN No",
                  "Aadhar No",
                  "Category",
                  "Gender",
                  "Blood Group",
                  "Phone",
                  "Address",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="p-4 text-left text-gray-300 whitespace-nowrap"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  className="border-t border-gray-800 hover:bg-gray-800/40 transition"
                >
                  <td className="p-4 text-white">{index + 1}.</td>

                  <td className="p-4 text-white">{student.admNo}</td>

                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {student.admDate}
                  </td>

                  <td className="p-4 text-white">{student.rollNo}</td>

                  <td className="p-4 text-white whitespace-nowrap">
                    {student.studentName}
                  </td>

                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {student.fatherName}
                  </td>

                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {student.motherName}
                  </td>

                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {student.dob}
                  </td>

                  <td className="p-4 text-white">{student.board}</td>

                  <td className="p-4 text-white">{student.class}</td>

                  <td className="p-4 text-white">{student.section}</td>

                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {student.apaarId}
                  </td>

                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {student.penNo}
                  </td>

                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {student.aadharNo}
                  </td>

                  <td className="p-4 text-white">{student.category}</td>

                  <td className="p-4 text-white">{student.gender}</td>

                  <td className="p-4 text-white">{student.bloodGroup}</td>

                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {student.phone}
                  </td>

                  <td className="p-4 text-gray-300 min-w-[250px]">
                    {student.address}
                  </td>

                  {/* Actions */}

                  <td className="p-4">
                    <div className="flex flex-row gap-2">
                      <button
                        className="w-10 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center cursor-pointer"
                        onClick={() =>
                          navigate(`/academic/student-profile/${student.id}`)
                        }
                      >
                        <Eye size={16} />
                      </button>

                      {/* <button className="w-10 h-10 rounded-lg bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center cursor-pointer"> */}
                      <button className="p-2 rounded-lg bg-red-500/20  text-red-400 cursor-pointer hover:bg-red-500/40">
                        <Trash2 size={16} />
                      </button>

                      <button className="p-2 rounded-lg bg-blue-500/20 cursor-pointer text-blue-400 hover:bg-blue-500/40">
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddStudentModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
      />
    </div>
  );
}
