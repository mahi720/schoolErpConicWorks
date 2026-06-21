import React, { useState } from "react";
import { Search } from "lucide-react";

const IssueReturnLogs = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const logs = [
    {
      id: 1,
      itemName: "Product Test 1",
      itemId: "123",
      code: "CAT001SUBCAT001BR001P0011",
      issuedTo: "Staff",
      name: "Admin (Admin001)",
      issueDate: "02-Aug-2022",
      returnDate: "05-Aug-2022",
      status: "Returned",
    },
    {
      id: 2,
      itemName: "Product Test 1",
      itemId: "",
      code: "CAT001SUBCAT001BR001P0012",
      issuedTo: "Student",
      name: "Lokesh Kumar Verma (2313/CONIC)",
      issueDate: "03-Aug-2022",
      returnDate: "26-Feb-2024",
      status: "Returned",
    },
    {
      id: 3,
      itemName: "Product Test 1",
      itemId: "123",
      code: "CAT001SUBCAT001BR001P0011",
      issuedTo: "Student",
      name: "Abhishek Ambasta (2314)",
      issueDate: "01-Aug-2022",
      returnDate: "",
      status: "Issued",
    },
    {
      id: 4,
      itemName: "Product Test 1",
      itemId: "",
      code: "CAT001SUBCAT001BR001P0015",
      issuedTo: "Staff",
      name: "Admin (Admin001)",
      issueDate: "24-Aug-2022",
      returnDate: "",
      status: "Issued",
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      {/* header */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-white font-semibold">Issue/Return Logs</h1>

        <div className="flex gap-5">
          <div className="relative w-72">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              placeholder="Search by Name or ID"
              className="bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white w-full outline-none"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 w-56 cursor-pointer"
          >
            <option value="">Filter By Status</option>

            <option>Issued</option>

            <option>Returned</option>
          </select>

          {/* <button
            onClick={() => {
              setSearch("");
              setStatus("");
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg cursor-pointer"
          >
            Clear Filter
          </button> */}
        </div>
      </div>

      {/* table */}

      <div className="overflow-auto custom-scrollbar">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-gray-800 whitespace-nowrap">
            <tr>
              {[
                "SNo.",
                "Item Name",
                "Item Id",
                "Item Code",
                "Issued To",
                "Issued To Name",
                "Issue Date",
                "Return Date",
                "Status",
              ].map((h) => (
                <th key={h} className="px-5 py-4 text-left text-gray-300">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {logs.map((item, index) => (
              <tr
                key={item.id}
                className="border-t border-gray-800 whitespace-nowrap"
              >
                <td className="px-5 py-4 text-gray-300">{index + 1}.</td>

                <td className="px-5 py-4 text-gray-300">{item.itemName}</td>

                <td className="px-5 py-4 text-gray-300">
                  {item.itemId || "-"}
                </td>

                <td className="px-5 py-4 text-gray-300">{item.code}</td>

                <td className="px-5 py-4 text-gray-300">{item.issuedTo}</td>

                <td className="px-5 py-4 text-gray-300">{item.name}</td>

                <td className="px-5 py-4 text-gray-300">{item.issueDate}</td>

                <td className="px-5 py-4 text-gray-300">
                  {item.returnDate || "-"}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs text-white ${
                      item.status === "Returned"
                        ? "bg-emerald-700"
                        : "bg-indigo-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueReturnLogs;
