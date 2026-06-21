import React, { useState } from "react";
import { Download, Pencil, Trash2 } from "lucide-react";
import CreateAcademicEventModal from "../../components/academics/AcademicCalendarModal/CreateAcademicEventModal";

export default function AcademicCalendar() {
  const [activeTab, setActiveTab] = useState("Academic Calendar");
  const [showEventModal, setShowEventModal] = useState(false);

  const [calendarData, setCalendarData] = useState([
    {
      id: 1,
      date: "11/05/2026 - 11/05/2026",
      title: "Re-Opening",
      description: "Re-Opening for all staff and students of classes 9,10 & 12",
      category: "Other",
    },
    {
      id: 2,
      date: "28/05/2026 - 28/05/2026",
      title: "Holiday",
      description: "Bakrid- Holiday",
      category: "Holiday",
    },
    {
      id: 3,
      date: "29/06/2026 - 06/07/2026",
      title: "Periodic Test 1",
      description: "Periodic Test 1 - Classes 3 to 10",
      category: "Theory Exam",
    },
    {
      id: 4,
      date: "15/08/2026 - 15/08/2026",
      title: "Independence Day",
      description: "Independence Day/Bag-less day",
      category: "Holiday",
    },
  ]);

  const [holidayData, setHolidayData] = useState([
    {
      id: 1,
      date: "28/05/2026 - 28/05/2026",
      title: "Bakrid Holiday",
      description: "School closed due to Bakrid",
    },
    {
      id: 2,
      date: "15/08/2026 - 15/08/2026",
      title: "Independence Day",
      description: "Independence Day Holiday",
    },
  ]);

  const handleDelete = (id) => {
    setCalendarData(calendarData.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">Academic Calendar</h1>

        <div className="flex gap-3 flex-wrap">
          <select
            className="bg-gray-800 border border-gray-700 
            rounded-xl px-6 py-3 text-white cursor-pointer"
          >
            <option>Select Acd. Year</option>
            <option>2023-24</option>
            <option>2024-25</option>
            <option>2025-26</option>
            <option>2026-27</option>
          </select>

          <button
            className="flex items-center gap-2 px-4 py-3 
            border border-blue-500 text-gray-300 rounded-xl cursor-pointer hover:bg-blue-700"
          >
            <Download size={17} />
            Download Holidays List
          </button>

          <button
            onClick={() => setShowEventModal(true)}
            className="px-5 py-3 border border-indigo-500 text-gray-300 rounded-xl cursor-pointer hover:bg-indigo-700"
          >
            Create Academic Calendar
          </button>

          <button
            className="px-4 py-3 bg-indigo-600 
            rounded-xl text-white  cursor-pointer hover:bg-indigo-700"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}

      <div className="bg-gray-800 p-2 rounded-xl grid grid-cols-2 gap-2">
        {["Academic Calendar", "Holidays"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`p-3 rounded-lg transition
            ${activeTab === tab ? "bg-gray-700 text-white cursor-pointer" : "text-gray-400 cursor-pointer"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}

      <div
        className="bg-gray-900 border border-gray-800 
        rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 text-left text-gray-300">SN.</th>

                <th className="p-4 text-left text-gray-300">Date</th>

                <th className="p-4 text-left text-gray-300">Title</th>

                <th className="p-4 text-left text-gray-300">Description</th>

                {activeTab === "Academic Calendar" && (
                  <>
                    <th className="p-4 text-left text-gray-300">Category</th>

                    <th className="p-4 text-center text-gray-300">Actions</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {(activeTab === "Academic Calendar"
                ? calendarData
                : holidayData
              ).map((item, index) => (
                <tr key={item.id} className="border-t border-gray-800">
                  <td className="p-4 text-gray-300">{index + 1}.</td>
                  <td className="p-4 text-gray-300">{item.date}</td>

                  <td className="p-4 text-gray-300">{item.title}</td>

                  <td className="p-4 text-gray-300">{item.description}</td>

                  {activeTab === "Academic Calendar" && (
                    <>
                      <td className="p-4 text-gray-300">{item.category}</td>

                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            className="p-2 bg-indigo-600 
                            rounded-lg text-white"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="p-2 bg-red-500 
                             rounded-lg text-white"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CreateAcademicEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onCreate={(data) => console.log(data)}
      />
    </div>
  );
}
