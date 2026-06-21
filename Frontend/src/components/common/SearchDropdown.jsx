import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const SearchDropdown = ({
  label,
  options,
  placeholder = "Select",
  width = "w-full",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState("");

  const filterData = options.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={`relative ${width}`}>
      {label && <label className="text-gray-400">{label}</label>}

      <button
        onClick={() => setOpen(!open)}
        className={`${label ? "mt-1" : ""} bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 w-full flex justify-between items-center cursor-pointer`}
      >
        {value || placeholder}

        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 bg-gray-900 border border-gray-700 rounded-lg w-full p-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full outline-none mb-2"
          />

          <div className="max-h-40 overflow-auto custom-scrollbar">
            {filterData.length > 0 ? (
              filterData.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setValue(item);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="px-3 py-2 hover:bg-gray-800 text-gray-300 rounded cursor-pointer"
                >
                  {item}
                </div>
              ))
            ) : (
              <p className="text-gray-500 p-2">No Data</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
