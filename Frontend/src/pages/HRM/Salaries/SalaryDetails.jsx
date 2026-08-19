import React, { useState } from "react";
import {
  Save,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  HelpCircle,
  Edit3,
  CheckCircle,
  X,
  Edit,
  IndianRupee,
  StopCircle,
  PlusCircle,
  User,
  PlayCircle,
} from "lucide-react";
import SalaryOverviewCards from "../../../components/HRM/Salary/SalaryOverviewCards";

export default function SalaryDetails() {
  const [earnings, setEarnings] = useState([
    {
      id: 1,
      name: "BASIC PAY",
      type: "Fixed",
      value: 1000,
      amount: 1000,
      editable: false,
    },
    {
      id: 2,
      name: "DA",
      type: "Percent",
      value: 58,
      amount: 580,
      editable: false,
    },
    {
      id: 3,
      name: "HRA",
      type: "Percent",
      value: 30,
      amount: 300,
      editable: false,
    },
    { id: 4, name: "TA", type: "Fixed", value: 0, amount: 0, editable: false },
  ]);

  const [deductions, setDeductions] = useState([
    {
      id: 1,
      name: "PF",
      type: "Percent",
      value: 12,
      amount: 1872,
      editable: false,
    },
    {
      id: 2,
      name: "VPF",
      type: "Percent",
      value: 0,
      amount: 0,
      editable: false,
    },
    {
      id: 3,
      name: "PT",
      type: "Fixed",
      value: 200,
      amount: 200,
      editable: false,
    },
    {
      id: 4,
      name: "ESI",
      type: "Percent",
      value: 0.75,
      amount: 117,
      editable: false,
    },
  ]);

  const [saved, setSaved] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [salaryStopped, setSalaryStopped] = useState(false);
  const [showPaybandModal, setShowPaybandModal] = useState(false);
  const [showIncrementModal, setShowIncrementModal] = useState(false);

  // Employee Data
  const [employee, setEmployee] = useState({
    name: "OM SINGH CHUNDAWAT",
    role: "TEACHING | PRINCIPAL | Regular",
    payband: "92500",
    basicSalary: "58600",
  });

  // Increment Form State
  const [incrementData, setIncrementData] = useState({
    type: "Percent",
    value: "",
    valueType: "Value",
  });

  // Change Payband Form State
  const [paybandData, setPaybandData] = useState({
    payband: "",
    type: "Percent",
    valueType: "Value",
  });

  const paybandOptions = [
    "92500",
    "78800",
    "53600",
    "52000",
    "47600",
    "46300",
    "46200",
  ];

  const totalEarnings = earnings.reduce((a, b) => a + b.amount, 0);
  const totalDeductions = deductions.reduce((a, b) => a + b.amount, 0);
  const netSalary = totalEarnings - totalDeductions;

  const handleValueChange = (section, id, field, value) => {
    const updateSection = section === "earnings" ? setEarnings : setDeductions;
    const currentData = section === "earnings" ? earnings : deductions;

    const updated = currentData.map((item) => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          [field]: field === "value" ? parseFloat(value) || 0 : value,
        };

        if (field === "type" || field === "value") {
          const basicPay =
            earnings.find((e) => e.name === "BASIC PAY")?.amount || 1000;
          if (updatedItem.type === "Percent") {
            updatedItem.amount = (updatedItem.value / 100) * basicPay;
          } else {
            updatedItem.amount = updatedItem.value;
          }
        }
        return updatedItem;
      }
      return item;
    });

    updateSection(updated);
  };

  const toggleEdit = (section, id) => {
    const updateSection = section === "earnings" ? setEarnings : setDeductions;
    const currentData = section === "earnings" ? earnings : deductions;

    updateSection(
      currentData.map((item) =>
        item.id === id ? { ...item, editable: !item.editable } : item,
      ),
    );
  };

  const saveChanges = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    console.log("Saved:", { earnings, deductions });
  };

  const handleStopSalary = () => {
    setSalaryStopped(true);
    setShowStopConfirm(false);
    console.log("Salary generation stopped");
  };

  const handleResumeSalary = () => {
    setSalaryStopped(false);
    console.log("Salary generation resumed");
  };

  const handleIncrementSubmit = () => {
    console.log("Increment submitted:", incrementData);
    // Add your increment logic here
    setShowIncrementModal(false);
    setIncrementData({ type: "Percent", value: "", valueType: "Value" });
  };

  const handlePaybandSubmit = () => {
    console.log("Payband changed:", paybandData);
    setEmployee({
      ...employee,
      payband: paybandData.payband,
    });
    setShowPaybandModal(false);
    setPaybandData({ payband: "", type: "Percent", valueType: "Value" });
  };

  const TableCard = ({
    title,
    data,
    section,
    icon: Icon,
    colorFrom,
    colorTo,
  }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex-1 transition-all duration-300 hover:border-gray-700">
      <div
        className={`bg-gradient-to-r ${colorFrom} ${colorTo} px-6 py-4 flex justify-between items-center`}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
            <Icon size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="text-white text-sm font-semibold">
            Total: ₹ {data.reduce((a, b) => a + b.amount, 0).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto scroll-smooth custom-scrollbar">
        <table className="w-full">
          <thead className="bg-gray-800/50 border-b border-gray-800">
            <tr>
              {["Sno.", "Component", "Type", "Value", "Amount (₹)", ""].map(
                (h, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {data.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-gray-800/50 transition-colors group"
              >
                <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                  {index + 1}.
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm whitespace-nowrap font-semibold text-gray-200">
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={item.type}
                    onChange={(e) =>
                      handleValueChange(
                        section,
                        item.id,
                        "type",
                        e.target.value,
                      )
                    }
                    disabled={!item.editable && item.name !== "BASIC PAY"}
                    className={`bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${!item.editable && item.name !== "BASIC PAY" ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-gray-600"}`}
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="Percent">Percent</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="relative">
                    {item.type === "Percent" ? (
                      <div className="relative">
                        <input
                          type="number"
                          value={item.value}
                          onChange={(e) =>
                            handleValueChange(
                              section,
                              item.id,
                              "value",
                              e.target.value,
                            )
                          }
                          disabled={!item.editable && item.name !== "BASIC PAY"}
                          className={`w-28 bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-1.5 text-sm text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${!item.editable && item.name !== "BASIC PAY" ? "opacity-60 cursor-not-allowed" : "hover:border-gray-600"}`}
                        />
                        <Percent
                          size={14}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="number"
                          value={item.value}
                          onChange={(e) =>
                            handleValueChange(
                              section,
                              item.id,
                              "value",
                              e.target.value,
                            )
                          }
                          disabled={!item.editable && item.name !== "BASIC PAY"}
                          className={`w-28 bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-1.5 text-sm text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${!item.editable && item.name !== "BASIC PAY" ? "opacity-60 cursor-not-allowed" : "hover:border-gray-600"}`}
                        />
                        <IndianRupee
                          size={14}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                        />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-sm font-bold whitespace-nowrap ${section === "earnings" ? "text-green-400" : "text-red-400"}`}
                  >
                    ₹{" "}
                    {item.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleEdit(section, item.id)}
                    className={`p-1.5 rounded-lg transition-all ${item.editable ? "bg-indigo-500/20 text-indigo-400" : "text-gray-600 hover:text-indigo-400 hover:bg-indigo-500/10 cursor-pointer"}`}
                    title={item.editable ? "Editing mode" : "Edit component"}
                  >
                    <Edit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Employee Profile Header */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Salary Details</h2>
          <div className="flex items-center justify-between flex-wrap gap-6">
            {/* Left Section - Employee Info */}
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-300 mb-1">
                  {employee.name}
                </h2>
                <p className="text-gray-400 text-sm mb-2">{employee.role}</p>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex flex-col items-end gap-4">
              <div className="flex gap-3">
                <select
                  className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-40 cursor-pointer"
                  name=""
                  id=""
                >
                  <option value="">Select Year</option>
                  <option value="">2026</option>
                  <option value="">2025</option>
                  <option value="">2024</option>
                </select>
                <select
                  className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-40 cursor-pointer"
                  name=""
                  id=""
                >
                  <option>Select Month</option>
                  <option>Sep</option>
                  <option>Aug</option>
                  <option>July</option>
                  <option>June</option>
                  <option>May</option>
                  <option>April</option>
                  <option>March</option>
                  <option>Feb</option>
                  <option>Jan</option>
                </select>

                <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg cursor-pointer">
                  <span>Go</span>
                </button>
              </div>

              {/* Second Row Save Button */}
              <button
                onClick={saveChanges}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg cursor-pointer"
              >
                <Save size={18} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
        <SalaryOverviewCards />;{/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          <TableCard
            title="Earnings"
            data={earnings}
            section="earnings"
            icon={TrendingUp}
            colorFrom="from-emerald-600"
            colorTo="to-green-700"
          />

          <TableCard
            title="Deductions"
            data={deductions}
            section="deductions"
            icon={TrendingDown}
            colorFrom="from-red-600"
            colorTo="to-red-700"
          />
        </div>
        {/* Salary Summary Card */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-900 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1 text-center md:text-left">
                <p className="text-gray-400 text-sm mb-1">Gross Earnings</p>
                <p className="text-2xl font-bold text-emerald-400">
                  ₹{" "}
                  {totalEarnings.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="hidden md:block w-px h-12 bg-gray-800"></div>

              <div className="flex-1 text-center md:text-left">
                <p className="text-gray-400 text-sm mb-1">Total Deductions</p>
                <p className="text-2xl font-bold text-red-400">
                  ₹{" "}
                  {totalDeductions.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="hidden md:block w-px h-12 bg-gray-800"></div>

              <div className="flex-1 text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end gap-2 mb-1">
                  <p className="text-gray-400 text-sm">Net Payable Salary</p>
                  <HelpCircle
                    size={14}
                    className="text-gray-600 cursor-help"
                    title="Amount after all deductions"
                  />
                </div>
                <p
                  className={`text-3xl font-bold ${netSalary >= 0 ? "text-emerald-400" : "text-red-400"}`}
                >
                  ₹{" "}
                  {netSalary.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                {netSalary < 0 && (
                  <p className="text-xs text-red-400 mt-1">
                    ⚠️ Deductions exceed earnings
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Deduction Rate</span>
                <span>
                  {((totalDeductions / totalEarnings) * 100).toFixed(1)}% of
                  gross
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((totalDeductions / totalEarnings) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
