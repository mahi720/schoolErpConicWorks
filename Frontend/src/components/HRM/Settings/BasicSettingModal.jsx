import React, { useState } from "react";
import { X } from "lucide-react";

export default function BasicSettingModal({ open, close, editData }) {
  const [showDays, setShowDays] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);

  const isEdit = !!editData;

  if (!open) return null;

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Saturday",
    "2nd Saturday",
    "4th Saturday",
    "Sunday",
  ];

  const addDay = (day) => {
    if (!selectedDays.includes(day)) {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const removeDay = (day) => {
    setSelectedDays(selectedDays.filter((d) => d !== day));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-[80%] max-w-5xl rounded-xl border border-gray-700">
        {/* header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-2xl text-white">
            {isEdit ? "Edit Data" : "Add New"}
          </h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        {/* body */}

        <div
          className={`p-8 grid gap-8 ${isEdit ? "grid-cols-2" : "grid-cols-3"}`}
        >
          {/* CREATE MODE DEPARTMENT */}

          {!isEdit && (
            <div>
              <label className="text-gray-400">
                Department<span className="text-red-500">*</span>
              </label>

              <select className="mt-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-full cursor-pointer">
                <option>TEACHING</option>
                <option>NON-TEACHING</option>
              </select>
            </div>
          )}

          {/* CREATE MODE WEEK DAY */}

          {!isEdit && (
            <div className="relative">
              <label className="text-gray-400">
                Week Day<span className="text-red-500">*</span>
              </label>

              <div
                onClick={() => setShowDays(!showDays)}
                className="mt-2 bg-gray-800 border border-gray-700 rounded-xl min-h-[50px] px-3 py-2 cursor-pointer flex flex-wrap gap-2"
              >
                {selectedDays.length === 0 && (
                  <span className="text-gray-500">Select Days</span>
                )}

                {selectedDays.map((day) => (
                  <span
                    key={day}
                    className="bg-gray-700 text-white px-2 py-1 rounded flex gap-2 items-center"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDay(day);
                      }}
                    >
                      ×
                    </button>

                    {day}
                  </span>
                ))}
              </div>

              {showDays && (
                <div className="absolute top-[85px] left-0 bg-gray-800 border border-indigo-500 rounded-lg w-full z-20 p-2">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white w-full mb-2"
                  />

                  <div className="max-h-48 overflow-y-auto custom-scrollbar">
                    {days
                      .filter((d) =>
                        d.toLowerCase().includes(search.toLowerCase()),
                      )
                      .map((day) => (
                        <p
                          key={day}
                          onClick={() => addDay(day)}
                          className={`px-3 py-2 rounded cursor-pointer ${selectedDays.includes(day) ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-700"}`}
                        >
                          {day}
                        </p>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TYPE CREATE + EDIT BOTH */}

          <div>
            <label className="text-gray-400">
              Type<span className="text-red-500"> *</span>
            </label>

            <select
              defaultValue={editData?.type}
              className="mt-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-full cursor-pointer"
            >
              <option>Working</option>

              <option>Holiday</option>
            </select>
          </div>

          {/* EDIT MODE SHIFT ONLY */}

          {isEdit && (
            <div>
              <label className="text-gray-400">
                Shift<span className="text-red-500">*</span>
              </label>

              <select
                defaultValue={editData?.shift}
                className="mt-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-full cursor-pointer"
              >
                <option>Select Shift</option>

                <option>GENERAL SHIFT (GS)</option>

                <option>Morning Shift</option>
              </select>
            </div>
          )}
        </div>

        {/* footer */}

        <div className="border-t border-gray-800 p-5 flex justify-end gap-3">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg cursor-pointer">
            {isEdit ? "Update Changes" : "Add"}
          </button>

          <button
            onClick={close}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
