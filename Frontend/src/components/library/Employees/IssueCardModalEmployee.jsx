import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";

export default function IssueCardModalEmployee({ open, close }) {
  const [quantity, setQuantity] = useState("");

  const [cards, setCards] = useState([
    {
      id: 1,
      cardId: "971",
      status: "Inactive",
    },
    {
      id: 2,
      cardId: "972",
      status: "Inactive",
    },
    {
      id: 3,
      cardId: "973",
      status: "Inactive",
    },
    {
      id: 4,
      cardId: "974",
      status: "Inactive",
    },
    {
      id: 5,
      cardId: "975",
      status: "Active",
    },
    {
      id: 6,
      cardId: "976",
      status: "Active",
    },
    {
      id: 7,
      cardId: "977",
      status: "Active",
    },
    {
      id: 8,
      cardId: "978",
      status: "Active",
    },
  ]);

  if (!open) return null;

  const deleteCard = (id) => {
    setCards(cards.filter((item) => item.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[520px]">
        {/* header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Issue Card</h2>

          <X
            onClick={close}
            className="text-gray-300 cursor-pointer hover:text-gray-400"
          />
        </div>

        {/* body */}

        <div className="p-5 space-y-8">
          {/* create card */}

          <div>
            <label className="text-gray-300">
              Quantity :<span className="text-red-500"> *</span>
            </label>

            <div className="flex gap-5 mt-2">
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter Quantity"
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-48"
              />

              <button className="bg-indigo-600 hover:bg-indigo-700 px-6 rounded-lg text-white cursor-pointer">
                Create
              </button>
            </div>
          </div>

          {/* table */}

          <div className="overflow-auto custom-scrollbar max-h-[250px]">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  {["SNo.", "Card Id", "Status", "Action"].map((h) => (
                    <th key={h} className="p-3 text-left text-gray-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {cards.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-800 hover:bg-gray-800/50"
                  >
                    <td className="p-3 text-gray-300">{item.id}.</td>

                    <td className="p-3 text-gray-300">{item.cardId}</td>

                    <td className="p-3 text-gray-300">{item.status}</td>

                    <td className="p-3">
                      {item.status === "Active" && (
                        <button
                          onClick={() => deleteCard(item.id)}
                          className="text-red-500 cursor-pointer"
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* footer */}

        <div className="border-t border-gray-800 p-5 flex justify-end">
          <button
            onClick={close}
            className="bg-gray-800 hover:bg-gray-700 px-5 py-3 rounded-lg text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
