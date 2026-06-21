import React, { useState } from "react";
import { Search } from "lucide-react";

export default function OtherFees() {
  const [classValue, setClassValue] = useState("");
  const [section, setSection] = useState("");
  const [optionalFee, setOptionalFee] = useState("");

  const feesData = [
    {
      id: 1,
      studentName: "Carlos Azevedo",
      optionalFees: "Transport Fees",
      paymentMethod: "Cash",
      date: "26-05-2026",
    },

    {
      id: 2,
      studentName: "John Doe",
      optionalFees: "Library Fees",
      paymentMethod: "UPI",
      date: "27-05-2026",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Optional Fees</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        {/* Filters */}

        <div className="flex justify-between flex-wrap gap-6">
          <div className="flex gap-6 flex-wrap">
            {/* Class */}

            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Class
                <span className="text-red-500"> *</span>
              </label>

              <select
                value={classValue}
                onChange={(e) => setClassValue(e.target.value)}
                className="w-[200px] bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              >
                <option value="">Select</option>

                <option>I</option>
                <option>II</option>
                <option>III</option>
                <option>IV</option>
              </select>
            </div>

            {/* Section */}

            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Section
                <span className="text-red-500"> *</span>
              </label>

              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-[200px] bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              >
                <option value="">Select</option>

                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>

            {/* Optional fees */}

            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Optional Fees
                <span className="text-red-500"> *</span>
              </label>

              <select
                value={optionalFee}
                onChange={(e) => setOptionalFee(e.target.value)}
                className="w-[200px] bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              >
                <option value="">Select</option>

                <option>Transport Fees</option>

                <option>Library Fees</option>

                <option>Computer Fees</option>
              </select>
            </div>
          </div>

          {/* Search */}

          <div className="relative mt-8">
            <Search size={18} className="absolute left-3 top-4 text-gray-400" />

            <input
              placeholder="Search"
              className="w-[260px] pl-10 p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
            />
          </div>
        </div>

        {/* Table */}

        <div className="mt-10 rounded-xl overflow-hidden border border-gray-800">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full table-fixed">
              <thead className="bg-gray-800">
                <tr>
                  <th className="w-[80px] p-4 text-center text-gray-300 font-semibold">
                    No.
                  </th>

                  <th className="w-[300px] p-4 text-left text-gray-300 font-semibold">
                    Student Name
                  </th>

                  <th className="w-[250px] p-4 text-left text-gray-300 font-semibold">
                    Optional Fees
                  </th>

                  <th className="w-[220px] p-4 text-center text-gray-300 font-semibold">
                    Payment Method
                  </th>

                  <th className="w-[180px] p-4 text-center text-gray-300 font-semibold">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {feesData.length > 0 ? (
                  feesData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-t border-gray-800 hover:bg-gray-800/40 transition"
                    >
                      <td className="p-4 text-center text-white">
                        {index + 1}
                      </td>

                      <td className="p-4 text-white">{item.studentName}</td>

                      <td className="p-4 text-white">{item.optionalFees}</td>

                      <td className="p-4 text-center text-white">
                        {item.paymentMethod}
                      </td>

                      <td className="p-4 text-center text-white">
                        {item.date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400">
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
