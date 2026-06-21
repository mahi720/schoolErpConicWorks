import React, { useState } from "react";
import { Search, Trash2, Pencil, Printer, FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OnlineAdmissionModal from "../../components/academics/studentAdmissionApplication/OnlineAdmissionModal";

export default function AdmissionApplications() {
  const navigate = useNavigate();
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [applications] = useState([
    {
      id: 1,
      name: "JEEVAN P",
      dob: "09-02-2013",
      admissionClass: "8",
      year: "2026-27",
      parentInHal: "Yes",
      siblingInHal: "No",
      paymentStatus: "Unpaid",
      amount: "0.00",
      applicationDate: "27-05-2026",
    },

    {
      id: 2,
      name: "Varundeep M",
      dob: "18-02-2013",
      admissionClass: "8",
      year: "2026-27",
      parentInHal: "Yes",
      siblingInHal: "No",
      paymentStatus: "Paid",
      amount: "100.00",
      applicationDate: "27-05-2026",
    },

    {
      id: 3,
      name: "Bindushree.R",
      dob: "10-01-2013",
      admissionClass: "8",
      year: "2026-27",
      parentInHal: "No",
      siblingInHal: "No",
      paymentStatus: "Paid",
      amount: "100.00",
      applicationDate: "27-05-2026",
    },
  ]);

  const dashboardCards = [
    {
      title: "TOTAL APPLICATION",
      value: "7324",
      bg: "bg-gray-800",
    },

    {
      title: "TOTAL PAID APPLICATION",
      value: "5098",
      bg: "bg-green-500/30",
    },

    {
      title: "TOTAL UNPAID APPLICATION",
      value: "40498",
      bg: "bg-yellow-500/30",
    },

    {
      title: "TOTAL ACTIVE APPLICATION",
      value: "3039",
      bg: "bg-sky-500/30",
    },

    {
      title: "DELETED APPLICATION",
      value: "230",
      bg: "bg-red-500/30",
    },

    {
      title: "TOTAL FEE",
      value: "158911.00",
      bg: "bg-purple-500/30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">New Admission</h1>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-white cursor-pointer">
            <FileSpreadsheet size={18} />
            Excel Export
          </button>

          <button
            onClick={() => setShowAdmissionModal(true)}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white cursor-pointer"
          >
            Start Online Admission
          </button>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="grid grid-cols-6 gap-3">
          <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 cursor-pointer text-white min-w-[120px]">
            <option>Select Fees</option>
            <option>All</option>
            <option>Paid</option>
            <option>Unpaid</option>
            <option>Partial Paid</option>
          </select>

          <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 cursor-pointer text-white min-w-[140px]">
            <option>Select Session Year</option>
            <option>All</option>
            <option>2023-24</option>
            <option>2024-25</option>
            <option>2026-27</option>
            <option>2027-28</option>
          </select>

          <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 cursor-pointer text-white min-w-[140px]">
            <option>Select Class</option>
            <option>All</option>
            <option>Nursery</option>
            <option>LKG</option>
            <option>UKG</option>
            <option>I</option>
            <option>II</option>
            <option>III</option>
          </select>

          <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 cursor-pointer text-white min-w-[140px]">
            <option>Select Section</option>
            <option>All</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>

          <div className="relative">
            <Search size={18} className="absolute left-3 top-4 text-gray-400" />

            <input
              placeholder="Search Name, Contact"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 p-3 text-white"
            />
          </div>

          <div className="flex gap-2">
            <button className="w-12 rounded-xl bg-yellow-500 text-white flex items-center justify-center cursor-pointer">
              <Search size={18} />
            </button>

            <button className="flex-1 rounded-xl bg-emerald-500 text-white cursor-pointer">
              Clear Filter
            </button>
          </div>
        </div>
      </div>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-6 gap-4">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bg} rounded-xl p-5 border border-gray-800`}
          >
            <p className="text-gray-300 text-sm">{card.title}</p>

            <h2 className="text-3xl font-bold text-white mt-4">{card.value}</h2>
          </div>
        ))}
      </div>
      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 text-left text-gray-300">SN</th>

                <th className="p-4 text-left text-gray-300">Student Name</th>

                <th className="p-4 text-left text-gray-300">DOB</th>

                <th className="p-4 text-left text-gray-300">Admission Class</th>

                <th className="p-4 text-left text-gray-300">Academic Year</th>

                <th className="p-4 text-left text-gray-300">Parent in HAL</th>

                <th className="p-4 text-left text-gray-300">Sibling in HAL</th>

                <th className="p-4 text-left text-gray-300">Payment Status</th>

                <th className="p-4 text-left text-gray-300">Amount</th>

                <th className="p-4 text-left text-gray-300">
                  Application Date
                </th>

                <th className="p-4 text-center text-gray-300">Action</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-800 hover:bg-gray-800/40"
                >
                  <td className="p-4 text-white">{index + 1}</td>

                  <td className="p-4 text-white">{item.name}</td>

                  <td className="p-4 text-white">{item.dob}</td>

                  <td className="p-4 text-white">{item.admissionClass}</td>

                  <td className="p-4 text-white">{item.year}</td>

                  <td className="p-4 text-white">{item.parentInHal}</td>

                  <td className="p-4 text-white">{item.siblingInHal}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-2 rounded-xl text-xs font-medium
                      ${
                        item.paymentStatus === "Paid"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {item.paymentStatus}
                    </span>
                  </td>

                  <td className="p-4 text-white">₹{item.amount}</td>

                  <td className="p-4 text-white">{item.applicationDate}</td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 cursor-pointer">
                        <Pencil size={16} />
                      </button>

                      <button className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 cursor-pointer">
                        <Printer size={16} />
                      </button>

                      <button className="p-2 rounded-lg bg-red-500/20 text-red-400 cursor-pointer">
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
      <OnlineAdmissionModal
        isOpen={showAdmissionModal}
        onClose={() => setShowAdmissionModal(false)}
      />
      ;
    </div>
  );
}
