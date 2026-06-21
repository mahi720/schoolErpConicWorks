import React from "react";

export default function SalaryOverviewCards() {
  const cards = [
    {
      title: "Attendance",
      value: "1.5",
      line1: "Total Holidays: 5",
      line2: "Total Deduction Days: 0",
      bar: "bg-indigo-500",
      width: "25%",
    },
    {
      title: "Leave",
      value: "0",
      line1: "Pending Leaves: 1",
      line2: "Declined Leaves: 0",
      bar: "bg-yellow-500",
      width: "75%",
    },
    {
      title: "Overtime",
      value: "₹ 0.00",
      line1: "Total Hours: 0",
      line2: "Amt/Hour: ₹681.63",
      bar: "bg-red-500",
      width: "50%",
    },
    {
      title: "Advance",
      value: "₹ 0",
      line1: "Request Amt: ₹0",
      line2: "Approved Requests: 0",
      bar: "bg-cyan-500",
      width: "20%",
    },
    {
      title: "Loan",
      value: "₹ 0",
      line1: "Total Amt: ₹0",
      line2: "Remaining Amt: ₹0",
      extra: "Approved Loans 0",
      bar: "bg-orange-500",
      width: "50%",
    },
    {
      title: "Salary To Be Claimed For (Days) :",
      value: "6.5",
      line1: "",
      line2: "Change Salary Days",
      bar: "bg-green-500",
      width: "75%",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {cards.map((item, index) => (
        <div
          key={index}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-white">{item.title}</h2>

            <h3 className="text-2xl text-white">{item.value}</h3>
          </div>

          <div className="space-y-2">
            <p className="text-gray-400">{item.line1}</p>

            <div className="flex justify-between">
              <p className="text-gray-400">{item.line2}</p>

              {item.extra && (
                <p className="text-gray-400 text-sm">{item.extra}</p>
              )}
            </div>
          </div>

          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              style={{ width: item.width }}
              className={`${item.bar} h-full rounded-full`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
