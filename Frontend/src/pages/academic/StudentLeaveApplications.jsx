import React, { useState } from "react";
import { Check, X, Search } from "lucide-react";

export default function StudentLeaveApplications() {
  const [modal, setModal] = useState({
    open: false,
    type: "",
  });

  const [remark, setRemark] = useState("");
  const [search, setSearch] = useState("");

  const leaves = [
    {
      id: 1,
      name: "AKSHAY V SAJAN",
      phone: "9473966541",
      class: "Grade 10",
      leave: "Multi Day",
      date: "02/06/2026 to 04/06/2026",
      reason: "Family emergency : Uncle on life-support",
      applicationDate: "01/06/2026",
      status: "Pending",
    },

    {
      id: 2,
      name: "HONALU Y GOWDA",
      phone: "9886178668",
      class: "Grade 8",
      leave: "Multi Day",
      date: "01/06/2026 to 05/06/2026",
      reason: "Grandfather passed away",
      applicationDate: "31/05/2026",
      status: "Pending",
    },
    {
      id: 3,
      name: "HONALU Y GOWDA",
      phone: "9886178668",
      class: "Grade 8",
      leave: "Multi Day",
      date: "01/06/2026 to 05/06/2026",
      reason: "Grandfather passed away",
      applicationDate: "31/05/2026",
      status: "Pending",
    },
    {
      id: 4,
      name: "HONALU Y GOWDA",
      phone: "9886178668",
      class: "Grade 8",
      leave: "Multi Day",
      date: "01/06/2026 to 05/06/2026",
      reason: "Grandfather passed away",
      applicationDate: "31/05/2026",
      status: "Pending",
    },
    {
      id: 5,
      name: "HONALU Y GOWDA",
      phone: "9886178668",
      class: "Grade 8",
      leave: "Multi Day",
      date: "01/06/2026 to 05/06/2026",
      reason: "Grandfather passed away",
      applicationDate: "31/05/2026",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}

      {/* <div className="flex justify-between items-start"> */}
      <h1 className="text-3xl font-bold text-white">
        Student Leave Applications
      </h1>

      <div className="flex justify-between items-end gap-4">
        <div className="flex gap-4 items-end">
          <div>
            <label className="text-gray-400 font-normal text-sm">
              By Status
            </label>

            <select className="block mt-2 bg-gray-800 border border-gray-700 cursor-pointer rounded-xl p-3 text-white">
              <option>All Application</option>
              <option>Pending Application</option>
              <option>Approved Application</option>
              <option>Rejected Application</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 font-normal text-sm">
              From Date
            </label>

            <input
              type="date"
              className="block mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
          </div>

          <div>
            <label className="text-gray-400 font-normal text-sm">
              Till Date
            </label>

            <input
              type="date"
              className="block mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
          </div>

          <button className="p-3 bg-indigo-600 rounded-xl text-white cursor-pointer">
            <Search />
          </button>
        </div>

        <div className="flex justify-end">
          <div className="relative w-80 ">
            {/* <label className="text-gray-400">
              Search By Student Name / Admission No.
            </label> */}

            <div className="relative mt-2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="By Student Name / Admission No."
                className="w-full bg-gray-800 
                border border-gray-700 rounded-xl
                pl-10 p-3 text-white"
              />
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800 whitespace-nowrap">
            <tr>
              {[
                "SN.",
                "Student Name",
                "Class",
                "Leave Info",
                "Reason",
                "Application Date",
                "Application Status",
                "Remark",
                "Actions",
              ].map((item) => (
                <th key={item} className="p-4 text-left text-gray-300">
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {leaves.map((item, index) => (
              <tr key={item.id} className="border-t border-gray-800">
                <td className="p-4 text-white">{index + 1}.</td>

                <td className="p-4 text-white">
                  <b>{item.name}</b>

                  <p className="text-gray-400">{item.phone}</p>
                </td>

                <td className="p-4 text-white">{item.class}</td>

                <td className="p-4 text-white">
                  <p className="text-indigo-400">{item.leave}</p>

                  <b>{item.date}</b>
                </td>

                <td className="p-4 text-gray-300">{item.reason}</td>

                <td className="p-4 text-gray-300 whitespace-nowrap">
                  {item.applicationDate}
                </td>

                <td className="p-4">
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm">
                    {item.status}
                  </span>
                </td>

                <td className="p-4 text-gray-300">NA</td>

                <td className="p-7">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() =>
                        setModal({
                          open: true,
                          type: "Approve",
                        })
                      }
                      className="p-2 bg-emerald-500 rounded-lg text-white cursor-pointer"
                    >
                      <Check />
                    </button>

                    <button
                      onClick={() =>
                        setModal({
                          open: true,
                          type: "Reject",
                        })
                      }
                      className="p-2 bg-red-500 rounded-lg text-white cursor-pointer"
                    >
                      <X />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approve Reject Modal */}

      {modal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-gray-900 rounded-xl w-full max-w-2xl">
            <div className="flex justify-between p-6 border-b border-gray-800">
              <h2 className="text-3xl text-white">{modal.type} Application</h2>

              <button
                onClick={() =>
                  setModal({
                    open: false,
                    type: "",
                  })
                }
              >
                <X className="text-white cursor-pointer" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <h2 className="text-2xl text-white">
                Are you sure to {modal.type} selected application ?
              </h2>

              <div>
                <label className="text-gray-400">
                  Please enter remark to <b>{modal.type}</b> the application.
                </label>

                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="mt-3 w-full h-24 bg-gray-800 border border-gray-700 rounded-xl text-white p-3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
              <button
                className={`px-5 py-3 rounded-xl text-white
              ${modal.type === "Approve" ? "bg-emerald-500 cursor-pointer" : "bg-red-500 cursor-pointer"}`}
              >
                {modal.type}
              </button>

              <button
                onClick={() =>
                  setModal({
                    open: false,
                    type: "",
                  })
                }
                className="px-5 py-3 bg-yellow-500 rounded-xl text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
