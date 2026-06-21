import React from "react";
import { Pencil, Search, Trash2 } from "lucide-react";

export default function ManageFeesTable() {
  const feesData = [
    {
      id: 1,
      name: "Annual Fees - VI",
      class: "X",
      dueDate: "20/07/2026",
      dueCharges: "5%",
      installment: "N/A",
      feeType: "Tuition - 900",
      compulsoryAmount: "5000",
      totalAmount: "6000",
    },
    {
      id: 2,
      name: "Transport Fees - XI",
      class: "IX",
      dueDate: "25/07/2026",
      dueCharges: "2%",
      installment: "Installment-1 (2026-03-13), Installment-2 (2026-03-14)",
      feeType: "Transport - 500",
      compulsoryAmount: "3000",
      totalAmount: "3500",
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}

      <div className="p-5 flex justify-between items-center flex-wrap border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white">Fees List</h2>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-4 text-gray-400" />

          <input
            placeholder="Search"
            className="w-[300px] bg-gray-800 border border-gray-700 pl-10 p-3 rounded-xl text-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-4 text-left text-gray-300">SN</th>

              <th className="p-4 text-left text-gray-300">Name</th>

              <th className="p-4 text-left text-gray-300">Class</th>

              <th className="p-4 text-left text-gray-300">Due Date</th>

              <th className="p-4 text-left text-gray-300">Due Charges (%)</th>

              <th className="p-4 text-left text-gray-300">Fees Installment</th>

              <th className="p-4 text-left text-gray-300">Fees Type</th>

              <th className="p-4 text-left text-gray-300">Compulsory Amount</th>

              <th className="p-4 text-left text-gray-300">Total Amount</th>

              <th className="p-4 text-center text-gray-300">Action</th>
            </tr>
          </thead>

          <tbody>
            {feesData.map((item, index) => (
              <tr
                key={item.id}
                className="border-t border-gray-800 hover:bg-gray-800/50 transition"
              >
                <td className="p-4 text-white">{index + 1}</td>

                <td className="p-4 text-white">{item.name}</td>

                <td className="p-4 text-white">{item.class}</td>

                <td className="p-4 text-white">{item.dueDate}</td>

                <td className="p-4 text-yellow-400 font-medium">
                  {item.dueCharges}
                </td>

                {/* <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      item.installment === "Yes"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {item.installment}
                  </span>
                </td> */}

                <td className="p-4 text-white">
                  {item.installment
                    ? item.installment.split(",").map((inst, idx) => (
                        <div key={idx} className="mb-1">
                          {inst.trim()}
                        </div>
                      ))
                    : "N/A"}
                </td>

                <td className="p-4 text-white">{item.feeType}</td>

                <td className="p-4 text-cyan-400 font-medium">
                  ₹{item.compulsoryAmount}
                </td>

                <td className="p-4 text-green-400 font-semibold">
                  ₹{item.totalAmount}
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                      <Pencil size={16} />
                    </button>

                    <button className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
