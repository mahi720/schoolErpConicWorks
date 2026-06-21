import React, { useState } from "react";
import { X } from "lucide-react";

export default function PayOtherFees() {
  const [paymentMode, setPaymentMode] = useState("cash");

  const [chequeNo, setChequeNo] = useState("");

  const fees = [
    {
      id: 1,
      title: "Sports Fees",
      amount: 3000,
    },

    {
      id: 2,
      title: "Gym Fees",
      amount: 5000,
    },

    {
      id: 3,
      title: "Computer Fees",
      amount: 3000,
    },
  ];

  const [selectedFees, setSelectedFees] = useState([]);

  const handleSelect = (fee) => {
    if (selectedFees.some((item) => item.id === fee.id)) {
      setSelectedFees(selectedFees.filter((item) => item.id !== fee.id));
    } else {
      setSelectedFees([...selectedFees, fee]);
    }
  };

  const totalAmount = selectedFees.reduce(
    (total, item) => total + item.amount,
    0,
  );

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-3xl bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
        {/* Header */}

        <div className="bg-blue-900 p-6 relative">
          <button className="absolute top-5 right-5">
            <X className="text-white cursor-pointer" />
          </button>

          <h1 className="text-center text-2xl text-white font-semibold">
            Carlos Azevedo
          </h1>

          <p className="text-center text-gray-300 mt-2">VI-A | Student</p>
        </div>

        {/* Content */}

        <div className="p-8 space-y-8">
          {/* Date */}

          <div>
            <label className="text-gray-300">
              DATE
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              className="w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
          </div>

          {/* Optional fees */}

          <div>
            <h1 className="text-gray-300 mb-4">
              OPTIONAL FEES <span className="text-red-500"> *</span>
            </h1>

            <div className="space-y-4">
              {fees.map((fee) => {
                const checked = selectedFees.some((item) => item.id === fee.id);

                return (
                  <div
                    key={fee.id}
                    onClick={() => handleSelect(fee)}
                    className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition
                    ${
                      checked
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 bg-gray-800"
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <input type="checkbox" checked={checked} readOnly />

                      <span className="text-white font-sm">{fee.title}</span>
                    </div>

                    <span className="text-white font-bold">₹{fee.amount}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total hidden until select */}

          {selectedFees.length > 0 && (
            <div className="bg-gray-800 border-l-4 border-blue-500 rounded-xl p-3 flex justify-between">
              <span className="text-gray-300 font-medium">
                Total Amount To Pay
              </span>

              <span className="text-blue-400 text-xl font-bold">
                ₹{totalAmount}
              </span>
            </div>
          )}

          <hr className="border-gray-700" />

          {/* Payment mode */}

          <div>
            <label className="text-gray-300">
              PAYMENT MODE
              <span className="text-red-500"> *</span>
            </label>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                onClick={() => setPaymentMode("cash")}
                className={`p-2 rounded-xl font-medium cursor-pointer
                ${
                  paymentMode === "cash"
                    ? "bg-blue-700 text-white"
                    : "border border-gray-700 text-gray-300"
                }`}
              >
                Cash
              </button>

              <button
                onClick={() => setPaymentMode("cheque")}
                className={`p-4 rounded-xl font-medium cursor-pointer
                ${
                  paymentMode === "cheque"
                    ? "bg-blue-700 text-white"
                    : "border border-gray-700 text-gray-300"
                }`}
              >
                Cheque
              </button>
            </div>
          </div>

          {/* cheque field */}

          {paymentMode === "cheque" && (
            <div>
              <label className="text-gray-300">
                Cheque Number <span className="text-red-500"> *</span>
              </label>

              <input
                value={chequeNo}
                onChange={(e) => setChequeNo(e.target.value)}
                placeholder="Enter cheque number"
                className="w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>
          )}

          <button className="w-full bg-blue-700 hover:bg-blue-800 rounded-xl py-4 cursor-pointer text-white font-semibold">
            PAY NOW
          </button>
        </div>
      </div>
    </div>
  );
}
