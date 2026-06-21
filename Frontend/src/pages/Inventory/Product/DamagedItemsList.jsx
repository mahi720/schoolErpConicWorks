import React, { useState } from "react";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

const DamagedItemsList = () => {
  const [search, setSearch] = useState("");

  const damagedItems = [
    {
      id: 1,
      itemName: "Product Test 1",
      itemId: "",
      code: "CAT001SUBCAT001BR001P0013",
      date: "05-Aug-2022",
    },
    {
      id: 2,
      itemName: "Product Test 1",
      itemId: "",
      code: "CAT001SUBCAT001BR001P0012",
      date: "03-Apr-2024",
    },
    {
      id: 3,
      itemName: "Computer System (CPU, Monitor, Mouse and Keyboard)",
      itemId: "",
      code: "CAT006SUBCAT001BR001P0011",
      date: "03-Apr-2024",
    },
    {
      id: 4,
      itemName: "Computer System (CPU, Monitor, Mouse and Keyboard)",
      itemId: "",
      code: "CAT006SUBCAT001BR001P0012",
      date: "03-Apr-2024",
    },
    {
      id: 5,
      itemName: "Product Test 1",
      itemId: "",
      code: "CAT001SUBCAT001BR001P0014",
      date: "18-Jun-2026",
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      {/* header */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-white font-semibold">Damaged Items</h1>

        <div className="flex items-center gap-5">
          {/* Search */}

          <div className="relative w-72">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              placeholder="Search by Name or ID"
              className="bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white w-full outline-none"
            />
          </div>

          <button className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-lg text-white flex gap-2 items-center cursor-pointer">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-auto custom-scrollbar">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-gray-800">
            <tr>
              {["SNo.", "Item Name", "Item Id", "Item Code", "Entry Date"].map(
                (h) => (
                  <th key={h} className="text-left text-gray-300 px-5 py-4">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {damagedItems.map((item, index) => (
              <tr key={item.id} className="border-t border-gray-800">
                <td className="px-5 py-4 text-gray-300">{index + 1}.</td>

                <td className="px-5 py-4 text-gray-300">{item.itemName}</td>

                <td className="px-5 py-4 text-gray-300">
                  {item.itemId || "-"}
                </td>

                <td className="px-5 py-4 text-gray-300">{item.code}</td>

                <td className="px-5 py-4 text-gray-300">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
    </div>
  );
};

export default DamagedItemsList;
