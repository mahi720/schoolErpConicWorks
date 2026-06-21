import React, { useState } from "react";
import { Search, Filter, FileText, ChevronDown, Download } from "lucide-react";

const PastIssues = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const data = [
    {
      id: 1,
      bookId: "123456",
      title: "ghjbn jhvbjj jnj faj;ljafalkf;jkfla",
      sid: "TESTCONIC",
      name: "TESTCONIC (Student)",
      card: "TESTCONIC3",
      status: "Lost",
      issue: "15-06-2026",
      till: "22-06-2026",
      returned: "16-06-2026",
      fine: "₹599",
      payment: "Pending",
    },
    {
      id: 2,
      bookId: "12345",
      title: "Test Title 1",
      sid: "97",
      name: "HPSSDR-269/20 (Student)",
      card: "976",
      status: "Returned",
      issue: "11-06-2026",
      till: "18-06-2026",
      returned: "15-06-2026",
      fine: "₹0",
      payment: "NA",
    },
  ];

  return (
    <div className="space-y-6">
      {/* TOP */}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-white font-semibold">All Issues</h1>

        <div className="flex gap-5">
          <select className="bg-gray-800 border cursor-pointer border-gray-700 text-white px-4 py-3 rounded-lg w-52">
            <option>Select Status</option>
            <option>Issued</option>
            <option>Returned</option>
            <option>Lost</option>
          </select>

          <select className="bg-gray-800 border cursor-pointer border-gray-700 text-white px-4 py-3 rounded-lg w-64">
            <option>Select Payment Status</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>

          <div className="flex">
            <input
              placeholder="Book Id / Title"
              className="bg-gray-800 border border-gray-700 px-4 text-white rounded-l-lg"
            />

            <button className="bg-gray-600 hover:bg-gray-700 text-white cursor-pointer px-3 rounded-r-lg">
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* buttons */}

      <div className="flex justify-end gap-3 relative">
        <div className="flex">
          <input
            placeholder="Student Id / Name"
            className="bg-gray-800 border border-gray-700 px-4 text-white rounded-l-lg"
          />

          <button className="bg-gray-600 hover:bg-gray-700 text-white cursor-pointer px-3 rounded-r-lg">
            <Search size={18} />
          </button>
        </div>

        <div className="flex">
          <input
            placeholder="Employee Id / Name"
            className="bg-gray-800 border border-gray-700 px-4 text-white rounded-l-lg"
          />

          <button className="bg-gray-600 hover:bg-gray-700 text-white cursor-pointer px-3 rounded-r-lg">
            <Search size={18} />
          </button>
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="bg-indigo-500/30 cursor-pointer hover:bg-indigo-500/20 text-indigo-400 px-8 py-3 rounded-lg flex gap-2"
        >
          <Filter size={18} className="mt-1" />
          Filter
        </button>

        <div>
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="bg-cyan-500 hover:bg-cyan-600 cursor-pointer text-white px-8 py-3 rounded-lg flex gap-2"
          >
            <FileText size={18} className="mt-1" />
            Export
            <ChevronDown size={18} className="mt-1" />
          </button>

          {exportOpen && (
            <div className="absolute cursor-pointer right-28 top-14 bg-gray-800 border border-gray-700 rounded-lg w-40">
              <button className="flex gap-3 text-white px-5 py-3 hover:bg-gray-700 w-full">
                <Download size={17} />
                Excel
              </button>

              <button className="flex cursor-pointer gap-3 text-white px-5 py-3 hover:bg-gray-700 w-full">
                <Download size={17} />
                PDF
              </button>
            </div>
          )}
        </div>

        <button className="bg-green-500 hover:bg-green-600 cursor-pointer px-8 py-3 rounded-lg text-white">
          Clear Filter
        </button>
      </div>

      {/* FILTER AREA */}

      {showFilter && (
        <div className="grid grid-cols-6 gap-5 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex flex-col">
            <label className="text-gray-400 font-normal text-sm">Board</label>
            <select className="input mt-1">
              <option>Select Board</option>
              <option>CBSE</option>
              <option>BSEB</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-400 font-normal text-sm">Class</label>
            <select className="input mt-1">
              <option>Select Class</option>
              <option>Nursery</option>
              <option>I</option>
              <option>II</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-400 font-normal text-sm">Section</label>
            <select className="input mt-1">
              <option>Select Section</option>
              <option>A</option>
              <option>D</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-400 font-normal text-sm">
              Academic Year
            </label>
            <select className="input mt-1">
              <option>Select Acad. Year</option>
              <option>2025-26</option>
              <option>2026-27</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-400 font-normal text-sm">
              From Date
            </label>
            <input type="date" className="input mt-1" />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-400 font-normal text-sm">To Date</label>
            <input type="date" className="input mt-1" />
          </div>
          <div className="col-span-6 flex justify-end">
            <button className="bg-indigo-600 px-4 py-2 hover:bg-indigo-700 cursor-pointer text-white rounded-lg">
              Filter
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}

      <div className="overflow-auto bg-gray-900 border border-gray-800 rounded-xl custom-scrollbar">
        <table className="w-full min-w-[1400px] border-spacing-x-5">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SNo.",
                "Book Id",
                "Title",
                "Id",
                "Name",
                "Card Id",
                "Status",
                "Issued On",
                "Return Till",
                "Returned On",
                "Fine",
                "Payment Status",
              ].map((h) => (
                <th className="px-6 py-3 text-left text-gray-300 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr className="border-t border-gray-800">
                <td className="px-6 py-3 text-gray-300">{item.id}.</td>

                <td className="px-6 py-3 text-gray-300">{item.bookId}</td>

                <td className="px-6 py-3 text-indigo-400">{item.title}</td>

                <td className="px-6 py-3 text-gray-300">{item.sid}</td>

                <td className="px-6 py-3 text-indigo-400 whitespace-nowrap">
                  {item.name}
                </td>

                <td className="px-6 py-3 text-gray-300">{item.card}</td>

                <td className="px-6 py-3 text-gray-300">{item.status}</td>

                <td className="px-6 py-3 text-gray-300 whitespace-nowrap">
                  {item.issue}
                </td>

                <td className="px-6 py-3 text-gray-300 whitespace-nowrap">
                  {item.till}
                </td>

                <td className="px-6 py-3 text-gray-300">{item.returned}</td>

                <td className="px-6 py-3 text-gray-300">{item.fine}</td>

                <td className="px-6 py-3 text-gray-300">{item.payment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PastIssues;
