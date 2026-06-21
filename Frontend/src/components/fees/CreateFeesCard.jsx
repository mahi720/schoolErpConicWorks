import React, { useState } from "react";
import { Info, ChevronDown } from "lucide-react";

export default function CreateFeesCard() {
  const classes = [
    "Nursery",
    "LKG",
    "UKG",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ];

  const [selectedClasses, setSelectedClasses] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelectAll = () => {
    if (selectedClasses.length === classes.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(classes);
    }
  };

  const handleClassSelect = (cls) => {
    if (selectedClasses.includes(cls)) {
      setSelectedClasses(selectedClasses.filter((item) => item !== cls));
    } else {
      setSelectedClasses([...selectedClasses, cls]);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-800 pb-4">
        Create Fees
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Prefix */}

        <div>
          <label className="flex items-center gap-2 text-white mb-2">
            Prefix Name
            <span className="text-red-500">*</span>
            <div className="relative group">
              <Info size={15} className="cursor-pointer text-gray-400" />

              {/* Tooltip */}

              <div className="absolute left-6 top-0 w-72 p-3 rounded-lg bg-gray-800 text-sm text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-700">
                Fees Name will be created based on classes. Prefix will be
                appended before class name. Example:
                <span className="text-blue-400 block mt-2">
                  Prefix Name - Class Name
                </span>
              </div>
            </div>
          </label>

          <input
            type="text"
            placeholder="Prefix Name"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
          />
        </div>

        {/* Classes */}

        <div className="relative">
          <label className="text-white mb-2 block">
            Classes
            <span className="text-red-500">*</span>
          </label>

          {/* Dropdown */}

          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-gray-800 border border-gray-700 rounded-xl p-3 min-h-[52px] text-white flex justify-between items-center cursor-pointer"
          >
            <span className="truncate">
              {selectedClasses.length > 0
                ? selectedClasses.join(", ")
                : "Select Classes"}
            </span>

            <ChevronDown
              size={18}
              className={`transition ${showDropdown ? "rotate-180" : ""}`}
            />
          </div>

          {/* Dropdown content */}

          {showDropdown && (
            <div className="absolute mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl p-4 z-50 max-h-[300px] overflow-y-auto custom-scrollbar">
              {/* Select all */}

              <label className="flex items-center gap-2 text-white mb-3">
                <input
                  type="checkbox"
                  checked={selectedClasses.length === classes.length}
                  onChange={handleSelectAll}
                />
                Select All
              </label>

              <div className="space-y-2">
                {classes.map((cls) => (
                  <label
                    key={cls}
                    className="flex items-center gap-2 text-white"
                  >
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(cls)}
                      onChange={() => handleClassSelect(cls)}
                    />

                    {cls}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
