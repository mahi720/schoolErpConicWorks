import React, { useState } from "react";
import { User, AlertCircle, ChevronDown } from "lucide-react";

export default function PayCompulsoryFees() {
  const [paymentMode, setPaymentMode] = useState("installment");
  const [paymentType, setPaymentType] = useState("cash");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [chequeNumber, setChequeNumber] = useState("");

  const installments = [
    {
      id: 1,
      title: "Installment 1",
      dueDate: "31-01-2024",
      total: "2040",
      dueCharge: "40",
      status: "OVERDUE",
    },

    {
      id: 2,
      title: "Installment 2",
      dueDate: "29-02-2024",
      total: "2040",
      dueCharge: "40",
      status: "OVERDUE",
    },

    {
      id: 3,
      title: "Installment 3",
      dueDate: "29-03-2024",
      total: "2040",
      dueCharge: "40",
      status: "OVERDUE",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-white">Pay Compulsory Fees</h1>

      {/* Student card */}

      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
        <div className="grid grid-cols-2 gap-10">
          <div className="flex gap-5">
            <div className="w-18 h-18 rounded-full bg-gray-800 flex items-center justify-center">
              <User size={35} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl font-medium text-white">Carlos Azevedo</h1>

              <p className="text-gray-400 mt-2">XI - A | 26-05-2026</p>
            </div>
          </div>

          <div>
            <p className="text-gray-400">#XI - A</p>

            <h1 className="text-xl font-bold text-white mt-2">₹6,000</h1>

            <p className="text-gray-400 mt-3">Paid : ₹0</p>

            <div className="h-3 rounded-full bg-gray-800 mt-3">
              <div className="w-0 h-full bg-blue-500 rounded-full" />
            </div>

            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="flex items-center gap-2 text-blue-400 cursor-pointer mt-4"
            >
              {showBreakdown ? "Hide fees breakdown" : "View fees breakdown"}

              <ChevronDown
                size={18}
                className={`transition duration-300 ${
                  showBreakdown ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
        {showBreakdown && (
          <div className="mt-10 bg-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 mb-6">Fee Details</h3>

            <div className="space-y-5">
              <div className="flex justify-between border-b border-gray-700 pb-4">
                <span className="text-white">Education Fees</span>

                <span className="text-white font-bold">₹5000</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white">Library Fees</span>

                <span className="text-white font-bold">₹1000</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Installment cards */}

      {installments.map((item) => (
        <div
          key={item.id}
          className="border border-red-500 rounded-2xl p-5 bg-red-500/5"
        >
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <AlertCircle size={15} className="text-red-400" />

                <h1 className="text-red-400 text-xl font-semibold">
                  {item.title}
                </h1>
              </div>

              <p className="text-gray-400">Due : {item.dueDate}</p>
            </div>

            <div>
              <span className="bg-red-500/20 px-2 py-2 rounded-full text-red-400 text-sm">
                {item.status}
              </span>
            </div>

            <div className="text-right">
              <p className="text-gray-400">Total : ₹{item.total}</p>

              <p className="text-red-400">Due Charges : +₹{item.dueCharge}</p>

              <h1 className="text-white text-xl font-semibold mt-2">
                Due : ₹{item.total}
              </h1>
            </div>
          </div>
        </div>
      ))}

      {/* Payment section */}

      <div className="bg-gray-900 rounded-2xl border-t-[6px] border-blue-600 p-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl text-white">Mode:</h1>

          <button
            onClick={() => setPaymentMode("installment")}
            className={`px-6 py-3 rounded-xl cursor-pointer
            ${
              paymentMode === "installment"
                ? "bg-blue-600 text-white"
                : "border border-blue-600 text-blue-400"
            }`}
          >
            Installment
          </button>

          <button
            onClick={() => setPaymentMode("full")}
            className={`px-6 py-3 rounded-xl cursor-pointer
            ${
              paymentMode === "full"
                ? "bg-blue-600 text-white"
                : "border border-blue-600 text-blue-400"
            }`}
          >
            Full Amount
          </button>
        </div>

        <div className="flex gap-6 mt-10">
          <label className="flex gap-2 text-white">
            <input
              type="radio"
              checked={paymentType === "cash"}
              onChange={() => setPaymentType("cash")}
            />
            Cash
          </label>

          <label className="flex gap-2 text-white">
            <input
              type="radio"
              checked={paymentType === "cheque"}
              onChange={() => setPaymentType("cheque")}
            />
            Cheque
          </label>
        </div>

        <div
          className={`grid ${
            paymentType === "cheque" ? "grid-cols-4" : "grid-cols-3"
          } gap-8 mt-8`}
        >
          <div>
            <label className="text-white">Date</label>

            <input
              type="date"
              className="w-full mt-2 bg-gray-800 rounded-xl p-3 text-white"
            />
          </div>

          <div>
            <label className="text-white">Enter Amount</label>

            <input
              placeholder="6120"
              className="w-full mt-2 bg-gray-800 rounded-xl p-3 text-white"
            />
          </div>

          {paymentType === "cheque" && (
            <div>
              <label className="text-white">Cheque Number</label>

              <input
                value={chequeNumber}
                onChange={(e) => setChequeNumber(e.target.value)}
                placeholder="Enter cheque number"
                className="w-full mt-2 bg-gray-800 rounded-xl p-3 text-white"
              />
            </div>
          )}

          <div className="flex items-end">
            <button className="w-full bg-blue-600 py-4 rounded-xl cursor-pointer text-white font-semibold">
              Collect Fees
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
