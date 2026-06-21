import { Search } from "lucide-react";
import React, { useState } from "react";

const ProductIssue = () => {
  const [selected, setSelected] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const [items, setItems] = useState([
    {
      id: 1,
      code: "CAT001SUBCAT001BR001P0011",
      itemId: "123",
      status: "Issued",
      issuedBy: "Admin",
      issuedTo: "Student (Conic Works)",
      name: "Abhishek Ambasta",
      date: "01-Aug-2022",
    },
    {
      id: 2,
      code: "CAT001SUBCAT001BR001P0012",
      status: "Damaged",
    },
    {
      id: 3,
      code: "CAT001SUBCAT001BR001P0013",
      status: "Damaged",
    },
    {
      id: 4,
      code: "CAT001SUBCAT001BR001P0014",
      status: "Damaged",
    },
    {
      id: 5,
      code: "CAT001SUBCAT001BR001P0015",
      status: "Available",
    },
    {
      id: 6,
      code: "CAT001SUBCAT001BR001P0016",
      status: "Issued",
      issuedBy: "Admin",
      issuedTo: "Staff (Conic Works)",
      name: "Admin",
      date: "12-Sep-2022",
    },
  ]);

  const [issueForm, setIssueForm] = useState({
    school: "",
    issueTo: "",
    date: "",
  });

  const handleIssueItem = () => {
    if (!issueForm.school) {
      alert("Please select school");
      return;
    }

    if (!issueForm.issueTo) {
      alert("Please select issue to");
      return;
    }

    if (!issueForm.date) {
      alert("Please select issue date");
      return;
    }

    if (selected.length === 0) {
      alert("Please select item");
      return;
    }

    setItems(
      items.map((item) =>
        selected.includes(item.id)
          ? {
              ...item,
              status: "Issued",
              issuedBy: "Admin",
              issuedTo: issueForm.issueTo,
              date: issueForm.date,
            }
          : item,
      ),
    );

    setSelected([]);
  };

  const openConfirm = (type) => {
    setConfirmText(type);
    setConfirmModal(true);
  };

  const handleConfirm = () => {
    console.log(confirmText);
    setConfirmModal(false);
  };

  const selectAll = (e) => {
    if (e.target.checked) {
      setSelected(
        items.filter((i) => i.status === "Available").map((i) => i.id),
      );
    } else {
      setSelected([]);
    }
  };

  const selectSingle = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Product Details */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h1 className="text-2xl text-white font-semibold mb-6">
          Product Details
        </h1>

        <div className="grid grid-cols-3 gap-6 text-sm">
          <Detail title="Product Name" value="Product Test 1" />

          <Detail title="Product ID" value="CAT001SUBCAT001BR001P001" />

          <Detail title="Category" value="Cat Test 1" />

          <Detail title="Quantity" value="85 (in piece)" />

          <Detail title="Description" value="Product Test 1 Description" />

          <Detail title="Available" value="80" />

          <Detail title="Issued" value="2" />

          <Detail title="Damaged" value="3" />
        </div>
      </div>

      {/* Issue */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl text-white mb-5">Item Issue</h2>

          <div className="flex items-center gap-4">
            <button className="text-white font-semibold bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-md cursor-pointer">
              Issue Items
            </button>

            <div className="relative w-75">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                placeholder="Search by Name or ID"
                className="bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-white w-full outline-none"
              />
            </div>
          </div>
        </div>
        {/* form */}

        <div className="grid grid-cols-3 gap-5 mb-6">
          <Select
            title="Select School"
            placeholder="Select School"
            value={issueForm.school}
            change={(e) =>
              setIssueForm({
                ...issueForm,
                school: e.target.value,
              })
            }
          />

          <Select
            title="Issue to"
            placeholder="Select Issue"
            value={issueForm.issueTo}
            change={(e) =>
              setIssueForm({
                ...issueForm,
                issueTo: e.target.value,
              })
            }
          />

          <div>
            <label className="text-gray-400 text-sm">
              Issue Date
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              value={issueForm.date}
              onChange={(e) =>
                setIssueForm({
                  ...issueForm,
                  date: e.target.value,
                })
              }
              className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
            />
          </div>
        </div>

        {/* table */}

        <div className="overflow-auto custom-scrollbar">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-800 whitespace-nowrap">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={
                      selected.length ===
                      items.filter((i) => i.status === "Available").length
                    }
                    onChange={selectAll}
                  />
                </th>

                {[
                  "SNo.",
                  "Item Code",
                  "Item Id",
                  "Issue Status",
                  "Issued By",
                  "Issued to",
                  "Issued to Name",
                  "Issued On",
                  "Action",
                ].map((h) => (
                  <th key={h} className="text-left text-gray-300 px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-800 whitespace-nowrap"
                >
                  <td className="px-4 py-3">
                    {item.status === "Available" ? (
                      <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => selectSingle(item.id)}
                      />
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-gray-300">{index + 1}.</td>

                  <td className="px-4 py-3 text-gray-300">{item.code}</td>

                  <td className="px-4 py-3 text-gray-300">
                    {item.itemId || "-"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs text-white ${
                        item.status === "Available"
                          ? "bg-emerald-700"
                          : item.status === "Issued"
                            ? "bg-indigo-700"
                            : "bg-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-300">
                    {item.issuedBy || "-"}
                  </td>

                  <td className="px-4 py-3 text-gray-300">
                    {item.issuedTo || "-"}
                  </td>

                  <td className="px-4 py-3 text-gray-300">
                    {item.name || "-"}
                  </td>

                  <td className="px-4 py-3 text-gray-300">
                    {item.date || "-"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {item.status === "Available" && (
                        <>
                          <button
                            onClick={handleIssueItem}
                            className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg text-white text-sm cursor-pointer"
                          >
                            Issue Item
                          </button>

                          <button
                            onClick={() =>
                              openConfirm("You want to mark damaged this!")
                            }
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-white text-sm cursor-pointer"
                          >
                            Mark Damaged
                          </button>
                        </>
                      )}

                      {item.status === "Damaged" && (
                        <button
                          onClick={() =>
                            openConfirm("You want to mark available this!")
                          }
                          className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-lg text-white text-sm cursor-pointer"
                        >
                          Mark Available
                        </button>
                      )}

                      {item.status === "Issued" && (
                        <>
                          <button
                            onClick={() =>
                              openConfirm("You want to return this!")
                            }
                            className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-lg text-white text-sm cursor-pointer"
                          >
                            Return
                          </button>

                          <button
                            onClick={() =>
                              openConfirm("You want to mark damaged this!")
                            }
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-white text-sm cursor-pointer"
                          >
                            Mark Damaged
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {confirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-[420px] p-8 shadow-2xl animate-scale">
            {/* Icon */}

            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-500 text-4xl font-bold">!</span>
              </div>
            </div>

            {/* Text */}

            <h2 className="text-2xl text-white font-semibold text-center mt-5">
              Are you sure?
            </h2>

            <p className="text-gray-400 text-center mt-3 text-sm">
              {confirmText}
            </p>

            {/* Buttons */}

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handleConfirm}
                className="bg-emerald-600 hover:bg-emerald-700 text-xl text-white px-12 py-2.5 rounded-xl cursor-pointer transition-all"
              >
                Yes
              </button>

              <button
                onClick={() => setConfirmModal(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white text-xl px-12 py-2.5 rounded-xl cursor-pointer transition-all"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Detail = ({ title, value }) => (
  <p className="text-gray-300">
    <span className="font-semibold text-gray-400">{title} :</span> {value}
  </p>
);

const Select = ({ title, placeholder, value, change }) => (
  <div>
    <label className="text-gray-400 text-sm">
      {title}
      <span className="text-red-500"> *</span>
    </label>

    <select
      value={value}
      onChange={change}
      className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full cursor-pointer"
    >
      <option value="">{placeholder}</option>

      <option value="Student">Student</option>

      <option value="Staff">Staff</option>
      <option value="Staff">Cleaner Staff</option>
    </select>
  </div>
);

export default ProductIssue;
