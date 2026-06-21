import React, { useState } from "react";
import { Trash2 } from "lucide-react";

export default function BookRack() {
  const [rackName, setRackName] = useState("");

  const [racks, setRacks] = useState([
    { id: 1, name: "A 1" },
    { id: 2, name: "A 2" },
    { id: 3, name: "A 3" },
    { id: 4, name: "A 4" },
    { id: 5, name: "A 5" },
    { id: 6, name: "A 6" },
    { id: 7, name: "Test Rack" },
  ]);

  // add rack

  const handleSave = () => {
    if (!rackName) return;

    const newRack = {
      id: racks.length + 1,
      name: rackName,
    };

    setRacks([...racks, newRack]);

    setRackName("");
  };

  // delete rack

  const deleteRack = (id) => {
    setRacks(racks.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-10">
      {/* create section */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl text-white font-semibold">Create Book Rack</h2>

        <hr className="border-gray-800 my-5" />

        <div className="flex items-end gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-gray-300">
              Book Rack Name
              <span className="text-red-500"> *</span>
            </label>

            <input
              value={rackName}
              onChange={(e) => setRackName(e.target.value)}
              placeholder="type here....."
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-96"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>

      {/* list section */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl text-white font-semibold mb-5">
          Book Rack List
        </h2>

        <table className="w-full">
          <thead className="border-y border-gray-800">
            <tr>
              <th className="p-3 text-gray-300 text-center">SNo.</th>

              <th className="p-3 text-gray-300 text-center">Rack Name</th>

              <th className="p-3 text-gray-300 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {racks.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-800">
                <td className="p-3 text-gray-300 text-center">{index + 1}</td>

                <td className="p-3 text-gray-300 text-center">{item.name}</td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => deleteRack(item.id)}
                    className="text-red-500 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
