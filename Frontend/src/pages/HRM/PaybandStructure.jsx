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
} from "lucide-react";

export default function PaybandStructure() {
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
    {
      id: 4,
      name: "	HONORARIUM",
      type: "Fixed",
      value: 0,
      amount: 0,
      editable: false,
    },
    { id: 5, name: "CCA", type: "Fixed", value: 0, amount: 0, editable: false },
    {
      id: 6,
      name: "ARREARS",
      type: "Fixed",
      value: 0,
      amount: 0,
      editable: false,
    },
    {
      id: 7,
      name: "MISC. INCOME",
      type: "Fixed",
      value: 0,
      amount: 0,
      editable: false,
    },
    {
      id: 8,
      name: "TELEPHONE ALLOWANCE",
      type: "Fixed",
      value: 0,
      amount: 0,
      editable: false,
    },
    {
      id: 9,
      name: "INTERIM RELIEF",
      type: "Fixed",
      value: 0,
      amount: 0,
      editable: false,
    },
    {
      id: 10,
      name: "FESTIVAL ADVANCE",
      type: "Fixed",
      value: 0,
      amount: 0,
      editable: false,
    },
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
      name: "QUARTERS RENT",
      type: "Percent",
      value: 0.75,
      amount: 117,
      editable: false,
    },
    {
      id: 5,
      name: "INCOME TAX",
      type: "Percent",
      value: 0.75,
      amount: 117,
      editable: false,
    },
    {
      id: 6,
      name: "DRF",
      type: "Percent",
      value: 0.75,
      amount: 117,
      editable: false,
    },
    {
      id: 7,
      name: "FEST ADV",
      type: "Percent",
      value: 0.75,
      amount: 117,
      editable: false,
    },
    {
      id: 8,
      name: "VOLUNTARY CONTRIBUTiON",
      type: "Percent",
      value: 0.75,
      amount: 117,
      editable: false,
    },
    {
      id: 9,
      name: "MISC. DEDUCTION",
      type: "Percent",
      value: 0.75,
      amount: 117,
      editable: false,
    },
    {
      id: 10,
      name: "ESI",
      type: "Percent",
      value: 0.75,
      amount: 117,
      editable: false,
    },
  ]);

  const [saved, setSaved] = useState(false);

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

        // Recalculate amount based on type and value
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

  const TableCard = ({
    title,
    data,
    section,
    icon: Icon,
    colorFrom,
    colorTo,
  }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex-1 transition-all duration-300 hover:border-gray-700">
      {/* Card Header */}
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

      {/* Table */}
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
        {/* Header Section */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 shadow-xl">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg">
                  <DollarSign size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Payband Structure
                </h1>
              </div>
              <p className="text-gray-400 ml-12">
                Configure salary components for{" "}
                <span className="text-indigo-400 font-semibold">92500</span>{" "}
                payband
              </p>
            </div>

            <button
              onClick={saveChanges}
              className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg cursor-pointer"
            >
              {saved ? (
                <>
                  <CheckCircle size={18} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
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
              {/* Gross Earnings */}
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

              {/* Divider */}
              <div className="hidden md:block w-px h-12 bg-gray-800"></div>

              {/* Total Deductions */}
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

              {/* Divider */}
              <div className="hidden md:block w-px h-12 bg-gray-800"></div>

              {/* Net Salary */}
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

            {/* Progress Bar */}
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

        {/* Info Note */}
        {/* <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="bg-indigo-500/20 p-1.5 rounded-lg">
                <Percent size={16} className="text-indigo-400" />
              </div>
            </div>
            <div>
              <p className="text-sm text-indigo-300">
                <span className="font-semibold">Note:</span> Percentage-based
                components are calculated on the Basic Pay amount. Click the
                edit icon (<Edit3 size={12} className="inline" />) to modify any
                component. Changes will affect the final salary calculation.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
