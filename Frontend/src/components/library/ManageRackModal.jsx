import React, { useState } from "react";
import { X } from "lucide-react";
import SearchDropdown from "../common/SearchDropdown";

const ManageRackModal = ({ close }) => {
  const [selectedRack, setSelectedRack] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const books = [
    {
      id: 1,
      bookId: "123456",
      title: "ghbjbn",
      rack: "A 3",
      status: "Lost",
      issuedBy: "NA",
      issuedOn: "NA",
      returnTill: "NA",
    },
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(books.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((item) => item !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const assignRack = () => {
    console.log({
      rack: selectedRack,
      books: selectedRows,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[90%] max-h-[90vh] overflow-auto custom-scrollbar">
        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">Manage Racks</h2>

          <X
            onClick={close}
            className="text-gray-400 hover:text-white cursor-pointer"
          />
        </div>

        {/* Body */}

        <div className="p-6">
          {/* rack */}

          <div className="flex gap-5 items-end mb-10">
            <div className="w-80">
              {/* <label className="text-gray-300">Rack :</label>

              <select
                value={selectedRack}
                onChange={(e) => setSelectedRack(e.target.value)}
                className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
              >
                <option>Select Rack</option>

                <option>A 1</option>

                <option>A 2</option>

                <option>A 3</option>
              </select> */}
              <SearchDropdown
                value={selectedRack}
                onChange={(e) => setSelectedRack(e.target.value)}
                label="Rack"
                options={["A1", "A2", "A3"]}
              />
            </div>

            <button
              onClick={assignRack}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg cursor-pointer"
            >
              Assign Rack
            </button>
          </div>

          {/* table */}

          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === books.length}
                    onChange={handleSelectAll}
                  />
                </th>

                {[
                  "Sr no.",
                  "Book Id",
                  "Title",
                  "Rack",
                  "Status",
                  "Issued By",
                  "Issued On",
                  "Return Till",
                ].map((h) => (
                  <th className="p-3 text-left text-gray-300">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {books.map((item) => (
                <tr className="border-b border-gray-800">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                    />
                  </td>

                  <td className="p-3 text-gray-300">{item.id}</td>

                  <td className="p-3 text-gray-300">{item.bookId}</td>

                  <td className="p-3 text-gray-300">{item.title}</td>

                  <td className="p-3 text-gray-300">{item.rack}</td>

                  <td className="p-3 text-gray-300">{item.status}</td>

                  <td className="p-3 text-gray-300">{item.issuedBy}</td>

                  <td className="p-3 text-gray-300">{item.issuedOn}</td>

                  <td className="p-3 text-gray-300">{item.returnTill}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}

        <div className="p-5 border-t border-gray-800 flex justify-end">
          <button
            onClick={close}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageRackModal;
