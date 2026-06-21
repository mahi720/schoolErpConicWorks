import React, { useState } from "react";
import {
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import SearchDropdown from "../../../components/common/SearchDropdown";

const IssuedItemsList = () => {
  const [search, setSearch] = useState("");

  const issuedItems = [
    {
      id: 1,
      itemName: "Product Test 1",
      itemId: "123",
      code: "CAT001SUBCAT001BR001P0011",
      issueTo: "Student (Conic Works)",
      name: "Abhishek Ambasta (2314)",
      date: "01-Aug-2022",
    },
    {
      id: 2,
      itemName: "Product Test 1",
      itemId: "",
      code: "CAT001SUBCAT001BR001P0015",
      issueTo: "Staff (Conic Works)",
      name: "Admin (Admin001)",
      date: "24-Aug-2022",
    },
    {
      id: 3,
      itemName: "Product Test 1",
      itemId: "",
      code: "CAT001SUBCAT001BR0016",
      issueTo: "Staff (Conic Works)",
      name: "Admin (Admin001)",
      date: "12-Sep-2022",
    },
    {
      id: 4,
      itemName: "Product Test 1",
      itemId: "",
      code: "CAT001SUBCAT001BR0018",
      issueTo: "Staff (Conic Works)",
      name: "Admin (Admin001)",
      date: "30-Sep-2022",
    },
  ];

  return (
    <div className="space-y-6">
      {/* header */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex justify-between items-center gap-5">
          <h1 className="text-2xl font-semibold text-white">Issued Items</h1>

          <div className="flex items-center gap-4">
            <SearchDropdown
              placeholder="Select Employee"
              width="w-60"
              options={["Auth 1", "Auth 2", "R D Sharma", "S Chand"]}
            />

            <button className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg text-white cursor-pointer">
              Report
            </button>

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

            <button className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-lg text-white flex items-center gap-2 cursor-pointer">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* table */}

        <div className="overflow-auto custom-scrollbar mt-8">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-800">
              <tr>
                {[
                  "SNo.",
                  "Item Name",
                  "Item Id",
                  "Item Code",
                  "Issued To",
                  "Issued To Name",
                  "Issue Date",
                ].map((h) => (
                  <th key={h} className="text-left text-gray-300 px-5 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {issuedItems.map((item, index) => (
                <tr key={item.id} className="border-t border-gray-800">
                  <td className="px-5 py-4 text-gray-300">{index + 1}.</td>

                  <td className="px-5 py-4 text-gray-300">{item.itemName}</td>

                  <td className="px-5 py-4 text-gray-300">
                    {item.itemId || "-"}
                  </td>

                  <td className="px-5 py-4 text-gray-300">{item.code}</td>

                  <td className="px-5 py-4 text-gray-300">{item.issueTo}</td>

                  <td className="px-5 py-4 text-gray-300">{item.name}</td>

                  <td className="px-5 py-4 text-gray-300">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination */}
      </div>
    </div>
  );
};

export default IssuedItemsList;
