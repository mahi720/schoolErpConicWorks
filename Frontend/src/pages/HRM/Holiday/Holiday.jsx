import React, { useState } from "react";
import {
  Edit,
  Trash2,
  Plus,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import HolidayModal from "../../../components/HRM/HolidayModal/HolidayModal";

export default function Holiday() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);

  const [holidays, setHolidays] = useState([
    {
      id: 1,
      date: "08-05-2026",
      title: "Good Friday",
      type: "Department",
      dept: "Teaching",
    },
    {
      id: 2,
      date: "04-05-2026",
      title: "Holi",
      type: "Department",
      dept: "Admin",
    },
  ]);

  const saveHoliday = (data) => {
    if (editData) {
      setHolidays(
        holidays.map((item) =>
          item.id === editData.id ? { ...data, id: item.id } : item,
        ),
      );
    } else {
      setHolidays([
        ...holidays,
        {
          ...data,
          id: holidays.length + 1,
        },
      ]);
    }

    setOpen(false);
    setEditData(null);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl text-white font-bold">Holidays</h1>

      {/* top */}

      <div className="flex justify-between items-center">
        {/* left */}
        <div className="flex gap-3 ml-70">
          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="bg-gray-800 hover:bg-gray-700 px-5 py-3 rounded-lg text-white flex items-center gap-2 cursor-pointer"
            >
              <FileText size={18} />
              Export
              {exportOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {exportOpen && (
              <div className="absolute top-14 left-0 bg-gray-800 border border-gray-700 rounded-lg w-36 z-20">
                <button className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 cursor-pointer">
                  PDF
                </button>

                <button className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 cursor-pointer">
                  Excel
                </button>
              </div>
            )}
          </div>

          {/* Add Holiday */}

          <button
            onClick={() => {
              setEditData(null);
              setOpen(true);
            }}
            className="bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-lg text-white flex gap-2 cursor-pointer"
          >
            <Plus size={18} className="mt-1" />
            Add Holiday
          </button>
        </div>

        {/* right filter */}

        <div className="flex gap-5">
          <select className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 w-52 cursor-pointer">
            <option>Select Year</option>
            <option>2026</option>
            <option>2025</option>
            <option>2024</option>
          </select>

          <button className="bg-green-500 hover:bg-green-600 cursor-pointer px-10 rounded-lg text-white">
            GO
          </button>
        </div>
      </div>

      {/* table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SNo.",
                "Date",
                "Title",
                "Type",
                "Dept/Employee",
                "Actions",
              ].map((h) => (
                <th key={h} className="p-4 text-gray-300 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {holidays.map((item, index) => (
              <tr key={item.id} className="border-t border-gray-800">
                <td className="p-4 text-gray-300">{index + 1}.</td>

                <td className="p-4 text-gray-300">{item.date}</td>

                <td className="p-4 text-gray-300">{item.title}</td>

                <td className="p-4 text-gray-300">{item.type}</td>

                <td className="p-4 text-gray-300">{item.dept}</td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => {
                      setEditData(item);
                      setOpen(true);
                    }}
                    className="bg-cyan-500 hover:bg-cyan-600 cursor-pointer p-2 rounded-lg text-white"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() =>
                      setHolidays(holidays.filter((h) => h.id !== item.id))
                    }
                    className="bg-red-500 cursor-pointer hover:bg-red-600 p-2 rounded-lg text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HolidayModal
        open={open}
        close={() => {
          setOpen(false);
          setEditData(null);
        }}
        save={saveHoliday}
        editData={editData}
      />
    </div>
  );
}
