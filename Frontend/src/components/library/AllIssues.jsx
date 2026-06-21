import React, { useState } from "react";
import {
  Search,
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AllIssues() {
  const [search, setSearch] = useState("");

  const issues = [
    {
      id: 1,
      bookId: "12345",
      title: "Test Title 1",
      publisher: "Test",
      year: "2000",
      cardId: "975",
      status: "Issued",
      issued: "11-06-2026",
      returnTill: "18-06-2026",
      returned: "NA",
      fine: "₹ 0",
      payment: "NA",
    },

    {
      id: 2,
      bookId: "12345",
      title: "Test Title 1",
      publisher: "Test",
      year: "2000",
      cardId: "975",
      status: "Returned",
      issued: "04-05-2026",
      returnTill: "11-05-2026",
      returned: "11-06-2026",
      fine: "₹ 0",
      payment: "NA",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">All Issues</h1>

        <div className="flex gap-5 items-center">
          <select className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 w-56 cursor-pointer">
            <option>Select Status</option>
            <option>Issued</option>
            <option>Returned</option>
            <option>Damaged</option>
            <option>Lost</option>
          </select>

          <select className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 w-62 cursor-pointer">
            <option>Select Payment Status</option>
            <option>Paid</option>
            <option>Unpaid</option>
            <option>Pending</option>
          </select>

          <div className="flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Book Id / Title"
              className="bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-3 text-white w-62"
            />

            <button className="bg-gray-600 hover:bg-gray-700 cursor-pointer px-4 rounded-r-lg text-white">
              <Search size={18} />
            </button>
          </div>

          {/* <button className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-lg text-white cursor-pointer">
            Clear Filter
          </button> */}
        </div>
      </div>

      {/* export */}

      <div className="flex justify-end">
        <button className="bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-lg text-white flex gap-2 cursor-pointer">
          <FileText size={18} className="mt-1" />
          Export
          <ChevronDown size={18} className="mt-1" />
        </button>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-auto custom-scrollbar">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SNo.",
                "Book Id",
                "Title",
                "Publisher",
                "Publishing Year",
                "Card Id",
                "Status",
                "Issued On",
                "Return Till",
                "Returned On",
                "Fine",
                "Payment Status",
              ].map((h) => (
                <th
                  key={h}
                  className="p-3 text-gray-300 text-left whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {issues.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-800 hover:bg-gray-800/50"
              >
                <td className="p-3 text-gray-300">{item.id}.</td>

                <td className="p-3 text-gray-300">{item.bookId}</td>

                <td className="p-3 text-indigo-400 whitespace-nowrap">
                  {item.title}
                </td>

                <td className="p-3 text-gray-300">{item.publisher}</td>

                <td className="p-3 text-gray-300">{item.year}</td>

                <td className="p-3 text-gray-300">{item.cardId}</td>

                <td className="p-3 text-gray-300">{item.status}</td>

                <td className="p-3 text-gray-300 whitespace-nowrap">
                  {item.issued}
                </td>

                <td className="p-3 text-gray-300 whitespace-nowrap">
                  {item.returnTill}
                </td>

                <td className="p-3 text-gray-300 whitespace-nowrap">
                  {item.returned}
                </td>

                <td className="p-3 text-gray-300">{item.fine}</td>

                <td className="p-3 text-gray-300">{item.payment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}

      {/* <div className="flex items-center gap-4">
        <button className="text-gray-400">
          <ChevronLeft size={20} />
        </button>

        <button className="bg-indigo-600 w-10 h-10 rounded-full text-white">
          1
        </button>

        <button className="text-gray-400">
          <ChevronRight size={20} />
        </button>
      </div> */}
    </div>
  );
}
