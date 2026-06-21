import React, { useState } from "react";
import { Search, RotateCw, Table2, Download, ChevronDown } from "lucide-react";

export default function TransactionLogs() {
  const [status, setStatus] = useState("All");
  const [month, setMonth] = useState("All");

  const logs = [
    {
      id: 1,
      user: "Kauan Sousa",
      studentId: "2022-2312509",
      amount: "1500",
      gateway: "Cash",
      paymentStatus: "Success",
      orderId: "-",
      paymentId: "-",
      date: "04-11-2025 10:04 PM",
      //   image: "https://i.pravatar.cc/40",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Heading */}

      <h1 className="text-3xl font-bold text-white">
        Online Fees Transactions Logs
      </h1>

      {/* Main Card */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        {/* Filters */}

        <div className="flex justify-between flex-wrap gap-6">
          <div className="flex gap-6 flex-wrap">
            {/* Payment Status */}

            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Payment Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-[220px] bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              >
                <option>All</option>
                <option>Success</option>
                <option>Failed</option>
                <option>Pending</option>
              </select>
            </div>

            {/* Month */}

            <div>
              <label className="block text-gray-300 mb-2 text-sm">Months</label>

              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-[180px] bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              >
                <option>All</option>
                <option>January</option>
                <option>February</option>
                <option>March</option>
              </select>
            </div>
          </div>

          {/* Actions */}

          {/* <div className="space-y-4">
            <div className="flex">
              <button className="bg-gray-800 border border-gray-700 px-10 py-4">
                <RotateCw size={20} className="text-blue-400" />
              </button>

              <button className="bg-gray-800 border border-gray-700 px-10 py-4 flex items-center gap-2">
                <Table2 size={18} className="text-blue-400" />

                <ChevronDown size={15} className="text-blue-400" />
              </button>

              <button className="bg-gray-800 border border-gray-700 px-10 py-4 flex items-center gap-2">
                <Download size={18} className="text-blue-400" />

                <ChevronDown size={15} className="text-blue-400" />
              </button>
            </div>

            {/* Search */}

          <div className="relative">
            <Search size={18} className="absolute left-3 top-4 text-gray-400" />

            <input
              placeholder="Search"
              className="w-[280px] bg-gray-800 border border-gray-700 pl-10 p-3 rounded-xl text-white"
            />
          </div>
          {/* </div> */}
        </div>

        {/* Table */}

        <div className="mt-10 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-4 text-gray-300 text-left">No.</th>

                  <th className="p-4 text-gray-300 text-left">User</th>

                  <th className="p-4 text-gray-300 text-center">Amount</th>

                  <th className="p-4 text-gray-300 text-center">
                    Payment Gateway
                  </th>

                  <th className="p-4 text-gray-300 text-center">
                    Payment Status
                  </th>

                  <th className="p-4 text-gray-300 text-center">Order ID</th>

                  <th className="p-4 text-gray-300 text-center">Payment ID</th>

                  <th className="p-4 text-gray-300 text-center">Date</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-800 hover:bg-gray-800/50"
                  >
                    <td className="p-4 text-white">{index + 1}</td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* <img
                          src={item.image}
                          alt=""
                          className="w-10 h-10 rounded-full"
                        /> */}

                        <div>
                          <h4 className="text-white font-semibold">
                            {item.user}
                          </h4>

                          <p className="text-gray-400 text-sm">
                            {item.studentId}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center text-white">
                      ₹{item.amount}
                    </td>

                    <td className="p-4 text-center">
                      <span className="bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-sm">
                        {item.gateway}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className="bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-sm">
                        {item.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4 text-center text-white">
                      {item.orderId}
                    </td>

                    <td className="p-4 text-center text-white">
                      {item.paymentId}
                    </td>

                    <td className="p-4 text-center text-white">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}

        <div className="mt-6 text-gray-400">
          Showing 1 to {logs.length} of {logs.length} rows
        </div>
      </div>
    </div>
  );
}
