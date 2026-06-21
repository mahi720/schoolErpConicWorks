import React, { useState } from "react";
import { MoreVertical, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentFees() {
  const [openAction, setOpenAction] = useState(null);
  const navigate = useNavigate();

  const students = [
    {
      id: 1,
      name: "Carlos Azevedo",
      roll: "2312202",
      class: "1-A",
      fees: "English",
      compulsory: "6000",
      optional: "6000",
      paymentMethod: "-",
      status: "Unpaid",
      date: "-",
      paidAmount: "0",
      dueCharges: "-",
    },

    {
      id: 3,
      name: "John Doe",
      roll: "2112205",
      class: "II-B",
      fees: "Math",
      compulsory: "5000",
      optional: "3000",
      paymentMethod: "UPI",
      status: "Paid",
      date: "20/06/2026",
      paidAmount: "8000",
      dueCharges: "0",
    },
    {
      id: 4,
      name: "John Doe",
      roll: "2112205",
      class: "II-B",
      fees: "Math",
      compulsory: "5000",
      optional: "3000",
      paymentMethod: "UPI",
      status: "Paid",
      date: "20/06/2026",
      paidAmount: "8000",
      dueCharges: "0",
    },
    {
      id: 5,
      name: "John Doe",
      roll: "2112205",
      class: "II-B",
      fees: "Math",
      compulsory: "5000",
      optional: "3000",
      paymentMethod: "UPI",
      status: "Paid",
      date: "20/06/2026",
      paidAmount: "8000",
      dueCharges: "0",
    },
    {
      id: 6,
      name: "John Doe",
      roll: "2112205",
      class: "II-B",
      fees: "Math",
      compulsory: "5000",
      optional: "3000",
      paymentMethod: "UPI",
      status: "Paid",
      date: "20/06/2026",
      paidAmount: "8000",
      dueCharges: "0",
    },
    {
      id: 7,
      name: "John Doe",
      roll: "2112205",
      class: "II-B",
      fees: "Math",
      compulsory: "5000",
      optional: "3000",
      paymentMethod: "UPI",
      status: "Paid",
      date: "20/06/2026",
      paidAmount: "8000",
      dueCharges: "0",
    },
    {
      id: 8,
      name: "John Doe",
      roll: "2112205",
      class: "II-B",
      fees: "Math",
      compulsory: "5000",
      optional: "3000",
      paymentMethod: "UPI",
      status: "Paid",
      date: "20/06/2026",
      paidAmount: "8000",
      dueCharges: "0",
    },
    {
      id: 9,
      name: "John Doe",
      roll: "2112205",
      class: "II-B",
      fees: "Math",
      compulsory: "5000",
      optional: "3000",
      paymentMethod: "UPI",
      status: "Paid",
      date: "20/06/2026",
      paidAmount: "8000",
      dueCharges: "0",
    },
    {
      id: 10,
      name: "John Doe",
      roll: "2112205",
      class: "II-B",
      fees: "Math",
      compulsory: "5000",
      optional: "3000",
      paymentMethod: "UPI",
      status: "Paid",
      date: "20/06/2026",
      paidAmount: "8000",
      dueCharges: "0",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Manage Student Fees</h1>

      {/* Dashboard */}

      <div className="grid grid-cols-3 gap-6">
        <Card title="Total Fees" amount="₹528,000" />

        <Card title="Collected Fees" amount="₹61,500" />

        <Card title="Pending Fees" amount="₹466,500" />
      </div>

      {/* Filters */}

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex justify-between flex-wrap gap-6">
          <div className="flex gap-6 flex-wrap">
            {/* Fees */}

            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm">Fees</label>

              <select className="w-[150px] bg-gray-800 border border-gray-700 p-3 rounded-xl text-white">
                <option>English</option>
                <option>Math</option>
              </select>
            </div>

            {/* Class */}

            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm">Class</label>

              <select className="w-[150px] bg-gray-800 border border-gray-700 p-3 rounded-xl text-white">
                <option>I</option>
                <option>II</option>
              </select>
            </div>

            {/* Section */}

            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm">Section</label>

              <select className="w-[150px] bg-gray-800 border border-gray-700 p-3 rounded-xl text-white">
                <option>A</option>
                <option>B</option>
              </select>
            </div>

            {/* Status */}

            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm">Status</label>

              <select className="w-[150px] bg-gray-800 border border-gray-700 p-3 rounded-xl text-white">
                <option>Paid</option>
                <option>Unpaid</option>
                <option>Partial Paid</option>
              </select>
            </div>
          </div>

          <div className="relative mt-7">
            <Search size={18} className="absolute left-3 top-4 text-gray-400" />

            <input
              placeholder="Search"
              className="w-[240px] bg-gray-800 border border-gray-700 pl-10 p-3 rounded-xl text-white"
            />
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto mt-6">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 text-gray-300">SN</th>

                <th className="p-4 text-gray-300">Student Name</th>

                <th className="p-4 text-gray-300">Class</th>

                <th className="p-4 text-gray-300">Compulsory Fees</th>

                <th className="p-4 text-gray-300">Other Fees</th>

                <th className="p-4 text-gray-300">Payment Method</th>

                <th className="p-4 text-gray-300">Fees Status</th>

                <th className="p-4 text-gray-300">Date</th>

                <th className="p-4 text-gray-300">Paid Amount</th>

                <th className="p-4 text-gray-300">Due Charges</th>

                <th className="p-4 text-gray-300">Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((item, index) => (
                <tr key={item.id} className="border-t border-gray-800">
                  <td className="p-4 text-white">{index + 1}</td>

                  <td className="p-4">
                    <div>
                      <p className="text-white">{item.name}</p>

                      <p className="text-gray-400">{item.roll}</p>
                    </div>
                  </td>

                  <td className="p-4 text-white">{item.class}</td>

                  <td className="p-4 text-white">₹{item.compulsory}</td>

                  <td className="p-4 text-white">₹{item.optional}</td>

                  <td className="p-4 text-white">{item.paymentMethod}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs
                      ${
                        item.status === "Paid"
                          ? "bg-green-500/20 text-green-400"
                          : item.status === "Partial Paid"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-4 text-white">{item.date}</td>

                  <td className="p-4 text-white">₹{item.paidAmount}</td>

                  <td className="p-4 text-white">{item.dueCharges}</td>

                  <td className="p-4 relative">
                    <button
                      onClick={() =>
                        setOpenAction(openAction === item.id ? null : item.id)
                      }
                      className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg cursor-pointer"
                    >
                      <MoreVertical size={18} className="text-white" />
                    </button>

                    {openAction === item.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl border border-gray-700 z-50 overflow-y-auto custom-scrollbar max-h-[120px]">
                        <button
                          onClick={() => {
                            navigate("/master/fees/compulsory-fees");
                            setOpenAction(null);
                          }}
                          className="block px-5 py-3 text-white hover:bg-gray-700 w-full text-left cursor-pointer"
                        >
                          Compulsory Fee
                        </button>

                        <button
                          onClick={() => {
                            navigate("/master/fees/pay-other-fees");
                          }}
                          className="block px-5 py-3 text-white hover:bg-gray-700 w-full text-left cursor-pointer"
                        >
                          Other Fee
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, amount }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <p className="text-gray-400">{title}</p>

      <h2 className="text-white text-3xl font-bold mt-3">{amount}</h2>
    </div>
  );
}
