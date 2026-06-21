import React, { useState } from "react";
import { Search, Printer, Trash2 } from "lucide-react";
import ApplicationDetailModal from "./ApplicationDetailModal";

export default function Applications() {
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const stats = [
    {
      title: "TOTAL APPLICATION",
      value: "98",
      color: "bg-indigo-500/20 text-indigo-400 rounded-lg",
    },
    {
      title: "TOTAL PAID APPLICATION",
      value: "75",
      color: "bg-green-500/20 text-green-400 rounded-lg",
    },
    {
      title: "TOTAL UNPAID APPLICATION",
      value: "23",
      color: "bg-orange-500/20 text-orange-400 rounded-lg",
    },
    {
      title: "TOTAL ACTIVE",
      value: "98",
      color: "bg-purple-500/20 rounded-lg text-purple-400",
    },
    {
      title: "DELETED",
      value: "0",
      color: "bg-yellow-500/20 text-yellow-400 rounded-lg",
    },
    {
      title: "REGISTERED",
      value: "408",
      color: "bg-yellow-500/20 text-yellow-400 rounded-lg",
    },
    {
      title: "TOTAL FEE",
      value: "0.00",
      color: "bg-red-500/20 text-red-400 rounded-lg",
    },
  ];

  const data = [
    {
      id: 1,
      name: "Rohan Thakur",
      phone: "9074970329",
      email: "rohan.thakur@gmail.com",
      status: "Active",
      payment: "Unpaid",
      app: "0",
      subject: "",
    },
    {
      id: 2,
      name: "SINJA",
      phone: "8861270099",
      email: "sinja.hero@gmail.com",
      status: "Unactive",
      payment: "Paid",
      app: "1240",
      subject: "PRT-Maths",
    },
    {
      id: 3,
      name: "SINJA",
      phone: "8861270099",
      email: "sinja.hero@gmail.com",
      status: "Unactive",
      payment: "Paid",
      app: "1240",
      subject: "PRT-Maths",
    },
    {
      id: 4,
      name: "SINJA",
      phone: "8861270099",
      email: "sinja.hero@gmail.com",
      status: "Unactive",
      payment: "Paid",
      app: "1240",
      subject: "PRT-Maths",
    },
    {
      id: 5,
      name: "SINJA",
      phone: "8861270099",
      email: "sinja.hero@gmail.com",
      status: "Unactive",
      payment: "Paid",
      app: "1240",
      subject: "PRT-Maths",
    },
  ];

  // select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(data.map((item) => item.id));
    } else {
      setSelected([]);
    }
  };

  // single select
  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div className="space-y-8">
      {/* header */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl text-white">Applications</h1>

        <div className="flex gap-3">
          <button className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer px-5 py-2 rounded-lg text-white">
            Quick Report
          </button>

          <button className="bg-green-500 hover:bg-green-600 cursor-pointer px-5 py-2 rounded-lg text-white">
            Export in Excel
          </button>
        </div>
      </div>

      <hr className="border-gray-800" />

      {/* filters */}

      <div className="space-y-5">
        {/* First Row */}

        <div className="flex items-end gap-5">
          {/* Board */}
          <div className="w-50">
            <label className="text-gray-400">Board</label>

            <select className="mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white w-full cursor-pointer">
              <option>Select Board</option>
              <option>CBSE</option>
              <option>CGBSE</option>
              <option>State Board</option>
            </select>
          </div>

          {/* Vacancy */}
          <div className="w-50">
            <label className="text-gray-400">Vacancy</label>

            <select className="mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white w-full cursor-pointer">
              <option>Select Vacancy</option>
              <option>PRT Counsellor</option>
              <option>TGT Teacher</option>
              <option>Lab Attender</option>
            </select>
          </div>

          {/* Subject */}
          <div className="w-50">
            <label className="text-gray-400 font-normal text-sm">Subject</label>

            <select className="mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white w-full cursor-pointer">
              <option>Select Subject</option>
              <option>Hindi</option>
              <option>English</option>
              <option>Maths</option>
            </select>
          </div>

          {/* Payment Status */}
          <div className="w-50">
            <label className="text-gray-400 font-normal text-sm">
              Payment Status
            </label>

            <select className="mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white w-full cursor-pointer">
              <option>Payment Status</option>
              <option>Paid</option>
              <option>Unpaid</option>
            </select>
          </div>

          {/* Search */}

          <button className="bg-yellow-500 hover:bg-yellow-600 px-5 py-3 rounded-lg text-white cursor-pointer">
            <Search size={18} />
          </button>
        </div>

        {/* Second Row */}

        <div className="flex justify-end gap-5">
          {/* All Vacancy */}

          <div className="w-50">
            <label className="text-gray-400 font-normal text-sm">
              All Vacancy
            </label>

            <select className="mt-0.5 bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white w-full cursor-pointer">
              <option>Select All Vacancy</option>
              <option>Active Vacancy</option>
              <option>Closed Vacancy</option>
              <option>Deleted Vacancy</option>
            </select>
          </div>

          {/* Date */}

          <div className="w-50">
            <label className="text-gray-400 font-normal text-sm">Date</label>

            <input
              type="date"
              className="mt-0.5 bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white w-full cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* cards */}

      <div className="grid grid-cols-7 gap-5">
        {stats.map((item) => (
          <div className={`${item.color} p-5 rounded`}>
            <h3 className="font-semibold">{item.title}</h3>

            <p className="text-3xl mt-4">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="bg-purple-500/50 cursor-pointer hover:bg-purple-500/20 px-5 py-2 rounded-lg text-white">
          Send Mail
        </button>
      </div>

      {/* table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-auto custom-scrollbar">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-gray-300 text-left">
                <input
                  type="checkbox"
                  checked={selected.length === data.length}
                  onChange={handleSelectAll}
                  className="cursor-pointer"
                />
              </th>

              {[
                "SNo.",
                "Name",
                "Phone",
                "Email",
                "Designation(Subject)",
                "Batch",
                "Status",
                "Application no.",
                "Payment Status",
                "Actions",
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
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-800 hover:bg-gray-800/50"
              >
                {/* checkbox */}

                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => handleSelect(item.id)}
                    className="cursor-pointer"
                  />
                </td>

                <td className="p-3 text-gray-300">{item.id}.</td>

                <td className="p-3 text-gray-300 whitespace-nowrap">
                  {item.name}
                </td>

                <td className="p-3 text-gray-300">{item.phone}</td>

                <td className="p-3 text-gray-300">{item.email}</td>

                <td className="p-3 text-gray-300">{item.subject}</td>

                <td className="p-3 text-gray-300">-</td>

                {/* status */}

                <td className="p-3">
                  <span
                    className={`text-gray-300 px-3 py-1 text-xs rounded-lg ${
                      item.status === "Active" ? "bg-green-700" : "bg-red-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="p-3 text-gray-300">{item.app}</td>

                {/* payment */}

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-xs text-white ${
                      item.payment === "Paid" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {item.payment}
                  </span>
                </td>

                {/* action */}

                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditData(item);
                        setOpen(true);
                      }}
                      className="bg-cyan-600 rounded-lg hover:bg-cyan-700 px-4 py-1 text-white cursor-pointer"
                    >
                      Update
                    </button>

                    <button className="bg-purple-500 rounded-lg hover:bg-purple-600 p-2 text-white cursor-pointer">
                      <Printer size={16} />
                    </button>

                    <button className="bg-red-500 hover:bg-red-700 p-2 rounded-lg text-white cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ApplicationDetailModal
        open={open}
        close={() => setOpen(false)}
        editData={editData}
      />
    </div>
  );
}
