import React, { useState } from "react";
import { X, Plus } from "lucide-react";

const RouteModal = ({ close, editData }) => {
  const [form, setForm] = useState({
    name: editData?.name || "",
    distance: editData?.distance || "",
    shift: editData?.shift || "",
    status: editData?.status || "Active",
  });

  const [points, setPoints] = useState([
    {
      point: "",
      pickupTime: "",
      dropTime: "",
    },
  ]);

  const addPoint = () => {
    setPoints([
      ...points,
      {
        point: "",
        pickupTime: "",
        dropTime: "",
      },
    ]);
  };

  const removePoint = (index) => {
    setPoints(points.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[80%] max-h-[90vh] flex flex-col">
        {/* Header */}

        <div className="flex justify-between p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">
            {editData ? "Edit Route" : "Create Route"}
          </h2>

          <X
            onClick={close}
            className="text-gray-400 hover:text-white cursor-pointer"
          />
        </div>

        {/* Body */}

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-gray-400 text-sm">
                Name
                <span className="text-red-500"> *</span>
              </label>

              <input
                value={form.name}
                placeholder="Name"
                className="mt-2 bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg w-full"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm">Distance (km)</label>

              <input
                value={form.distance}
                placeholder="Distance"
                className="mt-2 bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg w-full"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm">Shift</label>

              <select className="mt-2 bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg w-full">
                <option>Select Shift</option>

                <option>Morning Shift</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm">Status</label>

              <select className="mt-2 bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg w-full">
                <option>Active</option>

                <option>Inactive</option>
              </select>
            </div>
          </div>

          {/* Pickup */}

          <div className="mt-8">
            <h3 className="text-gray-300">Pickup points with time</h3>

            <div className="border-t border-gray-800 mt-5 pt-5">
              {points.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-5 mb-5 items-end"
                >
                  <div>
                    <label className="text-gray-400 text-sm">
                      Pickup point
                    </label>

                    <select className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full">
                      <option>Select pickup point</option>

                      <option>Sector 7</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm">Pickup time</label>

                    <input
                      type="time"
                      className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm">Drop time</label>

                    <input
                      type="time"
                      className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
                    />
                  </div>

                  <button
                    onClick={() => removePoint(index)}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/40 cursor-pointer px-5 py-3 rounded-xl"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}

              <button
                onClick={addPoint}
                className="mt-3 bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg text-white flex gap-2 cursor-pointer"
              >
                <Plus size={18} className="mt-1" />
                Add pickup point
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="border-t border-gray-800 p-5 flex justify-end gap-3">
          <button className="bg-cyan-600 cursor-pointer hover:bg-cyan-700 px-8 py-3 rounded-lg text-white">
            {editData ? "Update" : "Submit"}
          </button>

          <button
            onClick={close}
            className="bg-red-500 cursor-pointer hover:bg-red-600 px-8 py-3 rounded-lg text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteModal;
