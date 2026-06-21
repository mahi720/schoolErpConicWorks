import React, { useState } from "react";
import { Calendar, Upload, FileText, Edit } from "lucide-react";
import AttendanceModal from "../../../components/HRM/Attendance/AttendanceModal";
import ConfirmModal from "../../../components/HRM/Attendance/ConfirmModal";

export default function AttendanceManagement() {
  const [date, setDate] = useState("2026-06-11");
  const [selected, setSelected] = useState(null);

  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [edit, setEdit] = useState(false);

  const [locked, setLocked] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState([]);

  const employees = [
    {
      id: 1,
      empId: "1015315",
      name: "OM SINGH CHUNDAWAT",
      dept: "TEACHING (PRINCIPAL)",
      status: "P",
      InOUtTime: "- -",
    },
    {
      id: 2,
      empId: "1342",
      name: "AKSHATHA B",
      dept: "TEACHING (TGT)",
      status: "A",
      InOUtTime: "07:19 AM 03:07 PM",
    },
    {
      id: 3,
      empId: "712268",
      name: "K.A.SINDHU",
      dept: "TEACHING (TGT)",
      status: "A",
      InOUtTime: "- -",
    },
    {
      id: 4,
      empId: "1263",
      name: "ELIZABETH JOSEPH",
      dept: "TEACHING (TGT)",
      status: "A",
      InOUtTime: "07:19 AM 03:07 PM",
    },
  ];
  const [data, setData] = useState(employees);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEmp(data.map((emp) => emp.id));
    } else {
      setSelectedEmp([]);
    }
  };

  const handleSingleSelect = (id) => {
    if (selectedEmp.includes(id)) {
      setSelectedEmp(selectedEmp.filter((item) => item !== id));
    } else {
      setSelectedEmp([...selectedEmp, id]);
    }
  };

  return (
    <div className="space-y-8">
      {/* header */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Attendance Management</h1>

        <div className="flex gap-3">
          <button className="bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-lg text-white flex gap-2 cursor-pointer">
            <Upload size={18} className="mt-1" />
            Upload Attendance
          </button>

          <button className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-lg text-white cursor-pointer">
            Reconciliation
          </button>

          <button className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-lg text-white flex gap-2 cursor-pointer">
            <FileText size={18} className="mt-1" />
            Yearly Attendance Report
          </button>
        </div>
      </div>

      {/* count cards */}

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-gray-300 font-semibold">
            Yesterday's Present Count
          </h3>

          <h2 className="text-3xl text-white mt-5">0/44</h2>

          <div className="h-1 bg-green-500 rounded-full mt-8"></div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-gray-300 font-semibold">
            Yesterday's Absent Count
          </h3>

          <h2 className="text-3xl text-white mt-5">44/44</h2>

          <div className="h-1 bg-red-500 rounded-full mt-8"></div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-gray-300 font-semibold">
            Yesterday's On-Leave Count
          </h3>

          <h2 className="text-3xl text-white mt-5">0/44</h2>

          <div className="h-1 bg-yellow-500 rounded-full mt-8"></div>
        </div>
      </div>

      {/* filter */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-center">
        <h2 className="text-xl text-white">{date}</h2>

        <div className="flex gap-5">
          <button
            onClick={() => setLocked(true)}
            className="bg-cyan-500 hover:bg-cyan-600 px-12 py-2 rounded-lg text-white cursor-pointer"
          >
            Lock
          </button>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white cursor-pointer"
          />
        </div>
      </div>

      {/* table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-auto custom-scrollbar">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-800 whitespace-nowrap">
              <tr>
                {[
                  <input
                    type="checkbox"
                    checked={selectedEmp.length === data.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />,

                  "SNo.",
                  "Emp Id",
                  "Name",
                  "Department",
                  "In/Out Time",
                  "Status",
                  "Leave/Holiday",
                  "Locked",
                  "Action",
                ].map((h) => (
                  <th key={h} className="p-4 text-left text-gray-300">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-t border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedEmp.includes(emp.id)}
                      onChange={() => handleSingleSelect(emp.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>

                  <td className="p-4 text-gray-300">{emp.id}</td>

                  <td className="p-4 text-gray-300">{emp.empId}</td>

                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {emp.name}
                  </td>

                  <td className="p-4 text-gray-300 whitespace-nowrap">
                    {emp.dept}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    {emp.InOUtTime === "- -" ? (
                      <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-sm">
                        - -
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-sm">
                          IN : {emp.InOUtTime.split(" ").slice(0, 2).join(" ")}
                        </span>

                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm">
                          OUT : {emp.InOUtTime.split(" ").slice(2, 4).join(" ")}
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span
                      onClick={() => {
                        if (emp.status === "A") {
                          setSelected(emp);
                          setEdit(false);
                          setModal(true);
                        } else {
                          setSelected(emp);
                          setConfirm(true);
                        }
                      }}
                      className={`${emp.status === "A" ? "bg-red-500 mt-2" : "bg-green-500"} text-white px-3 py-1 rounded cursor-pointer`}
                    >
                      {emp.status}
                    </span>
                  </td>

                  <td className="p-4 text-gray-400">-</td>

                  <td className="p-4">
                    <span className="bg-cyan-500 text-white px-1 py-1 font-normal rounded">
                      {locked ? "YES" : "NO"}
                    </span>
                  </td>

                  <td>
                    {emp.status === "P" && !locked && (
                      <button
                        onClick={() => {
                          setSelected(emp);
                          setEdit(true);
                          setModal(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg cursor-pointer text-white"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AttendanceModal
        open={modal}
        close={() => setModal(false)}
        edit={edit}
        data={selected}
        save={(value) => {
          setData(
            data.map((e) =>
              e.id === selected.id
                ? {
                    ...e,
                    status: "P",
                    inTime: value.inTime,
                    outTime: value.outTime,
                    InOUtTime: `${value.inTime} ${value.outTime}`,
                    late: value.late,
                    early: value.early,
                  }
                : e,
            ),
          );

          setModal(false);
        }}
      />

      <ConfirmModal
        open={confirm}
        close={() => setConfirm(false)}
        confirm={() => {
          setData(
            data.map((e) =>
              e.id === selected.id
                ? {
                    ...e,
                    status: "A",
                    InOUtTime: "- -",
                  }
                : e,
            ),
          );

          setConfirm(false);
        }}
      />
    </div>
  );
}
