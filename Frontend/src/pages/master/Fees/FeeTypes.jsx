import React, { useState } from "react";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";

export default function FeesType() {
  const [showModal, setShowModal] = useState(false);

  const [fees, setFees] = useState([
    {
      id: 1,
      feeType: "Tuition Fee",
      description: "Monthly tuition fee",
    },
    {
      id: 2,
      feeType: "Transport Fee",
      description: "Bus transportation fee",
    },
  ]);

  const [formData, setFormData] = useState({
    feeType: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!formData.feeType.trim()) return;

    setFees([
      ...fees,
      {
        id: Date.now(),
        feeType: formData.feeType,
        description: formData.description,
      },
    ]);

    setFormData({
      feeType: "",
      description: "",
    });

    setShowModal(false);
  };

  const handleDelete = (id) => {
    setFees(fees.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Fees Type</h1>

          <p className="text-gray-400 mt-1">Manage fees types</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-xl text-white cursor-pointer"
        >
          <Plus size={18} />
          Add Fees
        </button>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {/* Header */}

        <div className="p-5 flex justify-between items-center flex-wrap border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Fees Type</h2>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-4 text-gray-400" />

            <input
              placeholder="Search"
              className="w-[300px] bg-gray-800 border border-gray-700 pl-10 p-3 rounded-xl text-white"
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-800">
              <tr>
                <th className="w-24 p-4 text-left text-gray-300">SN</th>

                <th className="p-4 text-left text-gray-300">Fee Type</th>

                <th className="p-4 text-left text-gray-300">Description</th>

                <th className="w-40 p-4 text-center text-gray-300">Action</th>
              </tr>
            </thead>

            <tbody>
              {fees.map((item, index) => (
                <tr key={item.id} className="border-t border-gray-800">
                  <td className="p-4 text-white">{index + 1}</td>

                  <td className="p-4 text-white">{item.feeType}</td>

                  <td className="p-4 text-white">{item.description}</td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 rounded-lg cursor-pointer bg-blue-500/20 text-blue-400">
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg cursor-pointer bg-red-500/20 text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-white">Add Fees Type</h2>

              <button onClick={() => setShowModal(false)}>
                <X className="text-white cursor-pointer" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-300">Fee Type</label>

                <input
                  type="text"
                  name="feeType"
                  value={formData.feeType}
                  onChange={handleChange}
                  placeholder="Enter Fee Type"
                  className="w-full mt-2 p-3 bg-gray-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-gray-300">Description</label>

                <textarea
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter Description"
                  className="w-full mt-2 p-3 bg-gray-800 rounded-xl text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-700 cursor-pointer rounded-xl text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 rounded-xl cursor-pointer text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
