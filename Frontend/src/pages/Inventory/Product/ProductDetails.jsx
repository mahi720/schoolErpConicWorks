import React, { useState } from "react";
import { ClipboardList, Search, X } from "lucide-react";

const ProductDetails = () => {
  const [assignModal, setAssignModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemIdValue, setItemIdValue] = useState("");

  const [items, setItems] = useState([
    {
      id: 1,
      code: "CAT001SUBCAT001BR001P0011",
      itemId: "123",
      status: "Issued",
      issuedBy: "Admin",
      issuedTo: "Student (Abhishek Ambasta)",
      issuedOn: "01-Aug-2022",
    },
    {
      id: 2,
      code: "CAT001SUBCAT001BR001P0012",
      itemId: "",
      status: "Damaged",
      issuedBy: "",
      issuedTo: "",
      issuedOn: "",
    },
    {
      id: 3,
      code: "CAT001SUBCAT001BR001P0013",
      itemId: "",
      status: "Available",
      issuedBy: "",
      issuedTo: "",
      issuedOn: "",
    },
  ]);

  const assignItemId = (value) => {
    setItems(
      items.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              itemId: value,
            }
          : item,
      ),
    );

    setAssignModal(false);
  };

  const Detail = ({ label, value }) => {
    return (
      <div className="whitespace-nowrap">
        <span className="text-gray-400 font-semibold">{label} :</span>

        <span className="text-gray-300 ml-2">{value}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Product Details */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-white mb-5">
          Product Details
        </h1>

        <div className="grid grid-cols-3 gap-x-20 gap-y-5">
          <Detail label="Product Name" value="Product Test 1" />

          <Detail label="Product ID" value="CAT001SUBCAT001BR001P001" />

          <Detail label="Quantity" value="41 (in piece)" />

          <Detail label="Category" value="Cat Test 1" />

          <Detail label="Sub-Category" value="Sub Cat Test 1" />

          <Detail label="Brand" value="Brand Test 1" />

          <Detail label="Quantity" value="41 (in piece)" />

          <Detail label="Description" value="Product Test 1 Description" />

          <Detail label="Available" value="36" />

          <Detail label="Issued" value="2" />

          <Detail label="Damaged" value="3" />
        </div>
      </div>

      {/* Product List */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold text-white">Product List</h2>

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
        </div>

        <div className="overflow-auto custom-scrollbar">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-800">
              <tr>
                {[
                  "SNo.",
                  "Item Code",
                  "Item ID",
                  "Issue Status",
                  "Issued By",
                  "Issued to",
                  "Issued On",
                  "Action",
                ].map((h) => (
                  <th className="px-5 py-3 text-left text-gray-300 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr className="border-t border-gray-800">
                  <td className="px-5 py-3 text-gray-300">{index + 1}.</td>

                  <td className="px-5 py-3 text-gray-300 whitespace-nowrap">
                    {item.code}
                  </td>

                  <td className="px-5 py-3 text-gray-300">{item.itemId}</td>

                  <td className="px-5 py-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-white text-sm ${
                        item.status === "Available"
                          ? "bg-green-600"
                          : item.status === "Damaged"
                            ? "bg-red-600"
                            : "bg-indigo-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-gray-300 whitespace-nowrap">
                    {item.issuedBy}
                  </td>

                  <td className="px-5 py-3 text-gray-300 whitespace-nowrap">
                    {item.issuedTo}
                  </td>

                  <td className="px-5 py-3 text-gray-300 whitespace-nowrap">
                    {item.issuedOn}
                  </td>

                  <td className="px-5 py-1">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setAssignModal(true);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-lg cursor-pointer"
                    >
                      <ClipboardList size={18} className="text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}

      {assignModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-96">
            {/* header */}

            <div className="flex justify-between p-5 border-b border-gray-800">
              <h2 className="text-white text-lg">Assign Item ID</h2>

              <X
                onClick={() => setAssignModal(false)}
                className="text-gray-400 cursor-pointer"
              />
            </div>

            {/* body */}

            <div className="p-5">
              <label className="text-gray-300">
                Item ID
                <span className="text-red-500"> *</span>
              </label>

              <input
                value={itemIdValue}
                onChange={(e) => setItemIdValue(e.target.value)}
                placeholder="Enter Item ID"
                className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none"
              />
            </div>

            {/* footer */}

            <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => {
                  assignItemId(itemIdValue);
                  setItemIdValue("");
                }}
                className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white cursor-pointer"
              >
                Assign
              </button>

              <button
                onClick={() => setAssignModal(false)}
                className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
