import React, { useState } from "react";
import { Plus, CircleX, Info } from "lucide-react";

export default function FeesInstallmentCard() {
  const [enabled, setEnabled] = useState(true);

  const [installments, setInstallments] = useState([
    {
      id: 1,
      name: "",
      amount: "0.00",
      dueDate: "",
      dueCharges: "",
      dueType: "fixed",
    },
  ]);

  const addInstallment = () => {
    setInstallments([
      ...installments,
      {
        id: Date.now(),
        name: "",
        amount: "0.00",
        dueDate: "",
        dueCharges: "",
        dueType: "fixed",
      },
    ]);
  };

  const removeInstallment = (id) => {
    setInstallments(installments.filter((item) => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    setInstallments(
      installments.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      {/* Header */}

      <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-800 pb-4">
        Fees Installment
      </h2>

      {/* Include */}

      <div className="mb-8">
        <label className="text-white text-lg">
          Include Fees Installment
          <span className="text-red-500"> *</span>
        </label>

        <div className="flex gap-6 mt-4">
          <label className="flex items-center gap-2 text-white cursor-pointer">
            <input
              type="radio"
              checked={enabled}
              onChange={() => setEnabled(true)}
            />
            Enable
          </label>

          <label className="flex items-center gap-2 text-white cursor-pointer">
            <input
              type="radio"
              checked={!enabled}
              onChange={() => setEnabled(false)}
            />
            Disable
          </label>
        </div>
      </div>

      {enabled && (
        <>
          <div className="space-y-8">
            {installments.map((item) => (
              <div key={item.id}>
                <div className="grid grid-cols-4 gap-6">
                  {/* Installment */}

                  <div>
                    <label className="text-white block mb-2">
                      Installment Name
                      <span className="text-red-500"> *</span>
                    </label>

                    <input
                      placeholder="Installment Name"
                      value={item.name}
                      onChange={(e) =>
                        handleChange(item.id, "name", e.target.value)
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
                    />
                  </div>

                  {/* Amount */}

                  <div>
                    <label className="text-white block mb-2">
                      Amount
                      <span className="text-red-500"> *</span>
                    </label>

                    <input
                      value={item.amount}
                      onChange={(e) =>
                        handleChange(item.id, "amount", e.target.value)
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
                    />
                  </div>

                  {/* Due date */}

                  <div>
                    <label className="text-white block mb-2">
                      Due Date
                      <span className="text-red-500"> *</span>
                    </label>

                    <input
                      type="date"
                      value={item.dueDate}
                      onChange={(e) =>
                        handleChange(item.id, "dueDate", e.target.value)
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
                    />
                  </div>

                  {/* Due type */}

                  <div>
                    <label className="text-white block mb-2">
                      Due Charges Type
                      <span className="text-red-500"> *</span>
                    </label>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer text-white">
                        <input
                          type="radio"
                          checked={item.dueType === "fixed"}
                          onChange={() =>
                            handleChange(item.id, "dueType", "fixed")
                          }
                        />
                        Fixed Amount
                        <div className="relative group">
                          <Info
                            size={15}
                            className="text-gray-400 cursor-pointer"
                          />
                          <div className="absolute right-6 top-0 w-72 p-3 rounded-lg bg-gray-800 text-sm text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-700">
                            Due Charges will be in fixed amount once the due
                            date is crossed.
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-white">
                        <input
                          type="radio"
                          checked={item.dueType === "percentage"}
                          onChange={() =>
                            handleChange(item.id, "dueType", "percentage")
                          }
                        />
                        Percentage
                        <div className="relative group">
                          <Info
                            size={14}
                            className="text-gray-400 cursor-pointer"
                          />
                          <div className="absolute right-6 top-0 w-72 p-3 rounded-lg bg-gray-800 text-sm text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-700">
                            Due Charges will be calculated in percentage (%) on
                            minimum installment amount.
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Due charge */}

                <div className="flex gap-6 mt-6">
                  <div className="w-[25%]">
                    <label className="text-white block mb-2">
                      Due Charges
                      <span className="text-red-500"> *</span>
                    </label>

                    <input
                      placeholder="Due Charges"
                      value={item.dueCharges}
                      onChange={(e) =>
                        handleChange(item.id, "dueCharges", e.target.value)
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
                    />
                  </div>

                  <button
                    onClick={() => removeInstallment(item.id)}
                    className="mt-8 bg-red-500/20 h-fit p-3 rounded-xl text-red-400"
                  >
                    <CircleX className="cursor-pointer" size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Button */}

          <button
            onClick={addInstallment}
            className="mt-8 flex items-center gap-2 bg-slate-700 hover:bg-slate-600 cursor-pointer text-white px-5 py-3 rounded-xl"
          >
            <Plus size={16} />
            Add New Data
          </button>
        </>
      )}
    </div>
  );
}
