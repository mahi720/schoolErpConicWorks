import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeesSalaryMultiComponentReport = () => {
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState("June");
  const [year, setYear] = useState(String(currentYear));
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [selectedComponents, setSelectedComponents] = useState([
    "BASIC_PAY",
    "HRA",
    "HONORARIUM",
    "ARREARS",
  ]);

  const [componentDropdownOpen, setComponentDropdownOpen] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 7 }, (_, index) =>
    String(currentYear - 3 + index),
  );

  const salaryComponents = [
    {
      value: "BASIC_PAY",
      label: "BASIC PAY",
      componentType: "EARNING",
    },
    {
      value: "DA",
      label: "DA",
      componentType: "EARNING",
    },
    {
      value: "HRA",
      label: "HRA",
      componentType: "EARNING",
    },
    {
      value: "TA",
      label: "TA",
      componentType: "EARNING",
    },
    {
      value: "HONORARIUM",
      label: "HONORARIUM",
      componentType: "EARNING",
    },
    {
      value: "CCA",
      label: "CCA",
      componentType: "EARNING",
    },
    {
      value: "ARREARS",
      label: "ARREARS",
      componentType: "EARNING",
    },
    {
      value: "MISC_INCOME",
      label: "MISC. INCOME",
      componentType: "EARNING",
    },
    {
      value: "TELEPHONE_ALLOWANCE",
      label: "TELEPHONE ALLOWANCE",
      componentType: "EARNING",
    },
    {
      value: "INTERIM_RELIEF",
      label: "INTERIM RELIEF",
      componentType: "EARNING",
    },
    {
      value: "FESTIVAL_ADVANCE",
      label: "FESTIVAL ADVANCE",
      componentType: "EARNING",
    },
    {
      value: "PF",
      label: "PF",
      componentType: "DEDUCTION",
    },
    {
      value: "VPF",
      label: "VPF",
      componentType: "DEDUCTION",
    },
    {
      value: "PT",
      label: "PT",
      componentType: "DEDUCTION",
    },
    {
      value: "ESI",
      label: "ESI",
      componentType: "DEDUCTION",
    },
    {
      value: "QUARTERS_RENT",
      label: "QUARTERS RENT",
      componentType: "DEDUCTION",
    },
    {
      value: "INCOME_TAX",
      label: "INCOME TAX",
      componentType: "DEDUCTION",
    },
  ];

  const reportData = [
    {
      id: 1,
      uanNumber: "100285767549",
      name: "K PRATHIBHA AJITH",
      components: {
        BASIC_PAY: 52000,
        DA: 31200,
        HRA: 15600,
        TA: 5760,
        HONORARIUM: 0,
        CCA: 0,
        ARREARS: 0,
        MISC_INCOME: 0,
        TELEPHONE_ALLOWANCE: 0,
        INTERIM_RELIEF: 0,
        FESTIVAL_ADVANCE: 0,
        PF: 6240,
        VPF: 0,
        PT: 200,
        ESI: 0,
        QUARTERS_RENT: 0,
        INCOME_TAX: 0,
      },
    },
    {
      id: 2,
      uanNumber: "100385452650",
      name: "SUMATHY K",
      components: {
        BASIC_PAY: 62200,
        DA: 37320,
        HRA: 18660,
        TA: 5760,
        HONORARIUM: 0,
        CCA: 0,
        ARREARS: 0,
        MISC_INCOME: 0,
        TELEPHONE_ALLOWANCE: 0,
        INTERIM_RELIEF: 0,
        FESTIVAL_ADVANCE: 0,
        PF: 7464,
        VPF: 0,
        PT: 200,
        ESI: 0,
        QUARTERS_RENT: 0,
        INCOME_TAX: 0,
      },
    },
    {
      id: 3,
      uanNumber: "100382247047",
      name: "SHOBA NARAYANAN",
      components: {
        BASIC_PAY: 55200,
        DA: 33120,
        HRA: 16560,
        TA: 5760,
        HONORARIUM: 0,
        CCA: 0,
        ARREARS: 0,
        MISC_INCOME: 0,
        TELEPHONE_ALLOWANCE: 0,
        INTERIM_RELIEF: 0,
        FESTIVAL_ADVANCE: 0,
        PF: 6624,
        VPF: 0,
        PT: 200,
        ESI: 0,
        QUARTERS_RENT: 0,
        INCOME_TAX: 0,
      },
    },
    {
      id: 4,
      uanNumber: "100158579586",
      name: "GANGA S NAIR",
      components: {
        BASIC_PAY: 56900,
        DA: 34140,
        HRA: 17070,
        TA: 5760,
        HONORARIUM: 0,
        CCA: 0,
        ARREARS: 0,
        MISC_INCOME: 0,
        TELEPHONE_ALLOWANCE: 0,
        INTERIM_RELIEF: 0,
        FESTIVAL_ADVANCE: 0,
        PF: 6828,
        VPF: 0,
        PT: 200,
        ESI: 0,
        QUARTERS_RENT: 0,
        INCOME_TAX: 0,
      },
    },
    {
      id: 5,
      uanNumber: "100318277057",
      name: "RAJESWARI RAMESH",
      components: {
        BASIC_PAY: 56900,
        DA: 34140,
        HRA: 17070,
        TA: 5760,
        HONORARIUM: 0,
        CCA: 0,
        ARREARS: 0,
        MISC_INCOME: 0,
        TELEPHONE_ALLOWANCE: 0,
        INTERIM_RELIEF: 0,
        FESTIVAL_ADVANCE: 0,
        PF: 6828,
        VPF: 0,
        PT: 200,
        ESI: 0,
        QUARTERS_RENT: 0,
        INCOME_TAX: 0,
      },
    },
  ];

  const selectedComponentDetails = useMemo(() => {
    return selectedComponents
      .map((value) => salaryComponents.find((item) => item.value === value))
      .filter(Boolean);
  }, [selectedComponents]);

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return reportData;
    }

    return reportData.filter((item) => {
      return (
        item.name.toLowerCase().includes(keyword) ||
        item.uanNumber.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const handleToggleComponent = (value) => {
    setSelectedComponents((previous) => {
      if (previous.includes(value)) {
        return previous.filter((item) => item !== value);
      }

      return [...previous, value];
    });
  };

  const handleRemoveComponent = (value) => {
    setSelectedComponents((previous) =>
      previous.filter((item) => item !== value),
    );
  };

  const handleClearComponents = () => {
    setSelectedComponents([]);
  };

  const handleGo = async () => {
    if (selectedComponents.length === 0) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        month: months.indexOf(month) + 1,
        year: Number(year),
        components: selectedComponents,
      };

      console.log("Multi Component Salary Report", payload);

      // Yahan API call karna hai.
      // await fetchSalaryMultiComponentReport(payload);
    } finally {
      setLoading(false);
    }
  };

  const handlePdf = () => {
    console.log("Export PDF", {
      month,
      year,
      components: selectedComponents,
    });
  };

  const handleExcel = () => {
    console.log("Export Excel", {
      month,
      year,
      components: selectedComponents,
    });
  };

  const formatAmount = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString("en-IN", {
      minimumFractionDigits: Number.isInteger(number) ? 0 : 2,
      maximumFractionDigits: 2,
    });
  };

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500";

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-11 h-11 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl flex items-center justify-center text-white cursor-pointer"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">
                Employees Salary Report
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                Select multiple salary types for report
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-end gap-3">
            <div className="relative w-80">
              <button
                type="button"
                onClick={() =>
                  setComponentDropdownOpen((previous) => !previous)
                }
                className="w-full min-h-[44px] bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-left cursor-pointer"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {selectedComponentDetails.length === 0 ? (
                    <span className="text-gray-500 text-sm">Select Type</span>
                  ) : (
                    selectedComponentDetails.map((item) => (
                      <span
                        key={item.value}
                        className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-md px-2 py-1 text-xs"
                      >
                        {item.label}

                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation();

                            handleRemoveComponent(item.value);
                          }}
                          onKeyDown={() => {}}
                          className="text-gray-400 hover:text-white cursor-pointer"
                        >
                          <X size={12} />
                        </span>
                      </span>
                    ))
                  )}
                </div>
              </button>

              {componentDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-800 flex items-center justify-between">
                    <p className="text-gray-400 text-xs">Select Components</p>

                    {selectedComponents.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearComponents}
                        className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    <div className="p-2">
                      <p className="px-2 py-2 text-xs text-gray-500 uppercase">
                        Earnings
                      </p>

                      {salaryComponents
                        .filter((item) => item.componentType === "EARNING")
                        .map((item) => (
                          <label
                            key={item.value}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedComponents.includes(item.value)}
                              onChange={() => handleToggleComponent(item.value)}
                              className="w-4 h-4 accent-indigo-600 cursor-pointer"
                            />

                            <span className="text-gray-300 text-sm">
                              {item.label}
                            </span>

                            <span className="ml-auto text-[10px] text-emerald-400">
                              Earning
                            </span>
                          </label>
                        ))}

                      <div className="my-2 border-t border-gray-800" />

                      <p className="px-2 py-2 text-xs text-gray-500 uppercase">
                        Deductions
                      </p>

                      {salaryComponents
                        .filter((item) => item.componentType === "DEDUCTION")
                        .map((item) => (
                          <label
                            key={item.value}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedComponents.includes(item.value)}
                              onChange={() => handleToggleComponent(item.value)}
                              className="w-4 h-4 accent-indigo-600 cursor-pointer"
                            />

                            <span className="text-gray-300 text-sm">
                              {item.label}
                            </span>

                            <span className="ml-auto text-[10px] text-rose-400">
                              Deduction
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-40">
              <select
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className={inputClass}
              >
                {months.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-36">
              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className={inputClass}
              >
                {years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleGo}
              disabled={loading || selectedComponents.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg text-white text-sm font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              GO
            </button>

            <button
              type="button"
              onClick={handlePdf}
              disabled={selectedComponents.length === 0}
              className="bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText size={16} />
              PDF
            </button>

            <button
              type="button"
              onClick={handleExcel}
              disabled={selectedComponents.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet size={16} />
              Excel
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employee..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
            <p className="text-white font-semibold">
              <span className="text-gray-500 text-xs">Selected Types -</span>{" "}
              {selectedComponents.length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar">
          <table
            className="w-full"
            style={{
              minWidth: `${Math.max(
                1000,
                500 + selectedComponents.length * 170,
              )}px`,
            }}
          >
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 w-20">
                  S No
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 min-w-[200px]">
                  UAN Number
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 min-w-[250px]">
                  Name
                </th>

                {selectedComponentDetails.map((component) => (
                  <th
                    key={component.value}
                    className={`px-4 py-3 text-left text-xs font-medium whitespace-nowrap ${
                      component.componentType === "DEDUCTION"
                        ? "text-rose-400"
                        : "text-gray-400"
                    }`}
                  >
                    {component.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={3 + selectedComponentDetails.length}
                    className="py-16"
                  >
                    <div className="flex justify-center">
                      <Loader2
                        size={28}
                        className="animate-spin text-indigo-500"
                      />
                    </div>
                  </td>
                </tr>
              ) : selectedComponents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-16 text-center text-gray-500">
                    Please select salary components
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={3 + selectedComponentDetails.length}
                    className="py-14 text-center text-gray-500"
                  >
                    No salary records found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">
                      {item.uanNumber || "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-200 font-medium whitespace-nowrap">
                      {item.name}
                    </td>

                    {selectedComponentDetails.map((component) => (
                      <td
                        key={component.value}
                        className={`px-4 py-3 text-sm whitespace-nowrap ${
                          component.componentType === "DEDUCTION"
                            ? "text-rose-400"
                            : "text-gray-300"
                        }`}
                      >
                        {formatAmount(item.components?.[component.value])}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              Total Employees:{" "}
              <span className="text-gray-300 font-medium">
                {filteredData.length}
              </span>
            </p>

            <p className="text-xs text-gray-500">
              Components:{" "}
              <span className="text-gray-300 font-medium">
                {selectedComponents.length}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesSalaryMultiComponentReport;
