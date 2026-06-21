import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageTransportationFees = () => {
  const navigate = useNavigate();
  const [fees, setFees] = useState([
    {
      duration: "30",
      amount: "1000.00",
    },
    {
      duration: "365",
      amount: "12000.00",
    },
    {
      duration: "90",
      amount: "3000.00",
    },
  ]);

  const addDuration = () => {
    setFees([
      ...fees,
      {
        duration: "",
        amount: "",
      },
    ]);
  };

  const removeDuration = (index) => {
    setFees(fees.filter((_, i) => i !== index));
  };

  const handleChange = (index, e) => {
    const data = [...fees];

    data[index][e.target.name] = e.target.value;

    setFees(data);
  };

  const submitFees = () => {
    console.log(fees);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      {/* Header */}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl text-white font-semibold">
          Manage Transportation Fees
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg cursor-pointer"
        >
          Back
        </button>
      </div>

      {/* Pickup */}

      <div className="mb-6 flex flex-col">
        <label className="text-gray-400 text-sm">
          Pickup Point
          <span className="text-red-500"> *</span>
        </label>

        <input
          value="sector 7"
          disabled
          className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 w-143"
        />
      </div>

      {/* Dynamic rows */}

      {fees.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_1fr_60px] gap-5 mb-5 items-end"
        >
          <div>
            <label className="text-gray-400 text-sm">
              Duration
              <span className="text-xs"> (Days)</span>
              <span className="text-red-500"> *</span>
            </label>

            <input
              name="duration"
              value={item.duration}
              onChange={(e) => handleChange(index, e)}
              placeholder="Enter Duration"
              className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">
              Amount
              <span className="text-red-500"> *</span>
            </label>

            <input
              name="amount"
              value={item.amount}
              onChange={(e) => handleChange(index, e)}
              placeholder="Enter Amount"
              className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
            />
          </div>

          <button
            onClick={() => removeDuration(index)}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 h-12 rounded-lg flex justify-center items-center cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>
      ))}

      {/* Add */}

      <button
        onClick={addDuration}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 cursor-pointer"
      >
        <Plus size={18} />
        Add Duration
      </button>

      {/* Submit */}

      <div className="flex justify-end mt-10">
        <button
          onClick={submitFees}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-10 py-3 rounded-lg cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ManageTransportationFees;
