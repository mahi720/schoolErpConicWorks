import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeesSalaryComponentReport = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState("July");
  const [year, setYear] = useState(String(currentYear));
  const [selectedType, setSelectedType] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

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

  const salaryTypes = [
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
    {
      value: "DRF",
      label: "DRF",
      componentType: "DEDUCTION",
    },
    {
      value: "FEST_ADV",
      label: "FEST ADV",
      componentType: "DEDUCTION",
    },
    {
      value: "VOLUNTARY_CONTRIBUTION",
      label: "VOLUNTARY CONTRIBUTION",
      componentType: "DEDUCTION",
    },
    {
      value: "MISC_DEDUCTION",
      label: "MISC. DEDUCTION",
      componentType: "DEDUCTION",
    },
  ];

  const reportData = [
    {
      id: 1,
      name: "K PRATHIBHA AJITH",
      panNumber: "BQAPP7107G",
      address: "ELM-A14, TATASHEREWOOD, BASAVANAGAR",
      amount: 32160,
    },
    {
      id: 2,
      name: "SUMATHY K",
      panNumber: "AWDPS4651G",
      address:
        "NO.9A, OLD 1ST B CROSS, NEW 3RD A CROSS, NAGAPPA REDDY LAYOUT, KAGADASAPURA, BANGALORE-560093",
      amount: 38460,
    },
    {
      id: 3,
      name: "SHOBA NARAYANAN",
      panNumber: "AFTPN7318E",
      address: "G4 Mathapathi Paradise Abbaiah Reddy Layout Kagadasapura",
      amount: 34140,
    },
    {
      id: 4,
      name: "GANGA S NAIR",
      panNumber: "AEAPN5427Q",
      address:
        "NO.301, SREE DURGA APARTMENTS, 3RD MAIN, 3RD CROSS, MALLESHPALAYA, BANGALORE-560075",
      amount: 35160,
    },
    {
      id: 5,
      name: "RAJESWARI RAMESH",
      panNumber: "AQCPR7426F",
      address:
        "NO.216, JYOTHI CLIQUE, 4TH CROSS, ABBAIAH REDDY LAYOUT, KAGADASAPURA, BANGALORE-560093",
      amount: 35160,
    },
    {
      id: 6,
      name: "MITU ROY",
      panNumber: "AYXPM4871A",
      address:
        "NO. 5063, SOBHA CARNATION, GREEN GLEN LAYOUT, BELLANDUR, BANGALORE-560103",
      amount: 35160,
    },
    {
      id: 7,
      name: "RANJINI VARMA K",
      panNumber: "ADNPV1869J",
      address:
        "B1, RAMA RESIDENCY II, 6TH MAIN, NEW TIPPASANDRA, BANGALORE-560075",
      amount: 30300,
    },
    {
      id: 8,
      name: "JASMINE HARTLEY PEREIRA",
      panNumber: "AWXPP8168P",
      address: "NO.18, 3RD MAIN, HRBR LAYOUT, KAMANAHALLI, BANGALORE-560084",
      amount: 30300,
    },
    {
      id: 9,
      name: "SUJATHA VP",
      panNumber: "BPHPS8127P",
      address: "NO.19, LOTUS, KUSHAL LAYOUT, KAGGADASAPURA, BANGALORE-560093",
      amount: 30300,
    },
    {
      id: 10,
      name: "POOJA SHARMA",
      panNumber: "CZPPS0025P",
      address:
        "SARANYA SOHAM APARTMENTS, BLOCK-A3, H.NO.209, SURVEY NO.63/1, MUNNEKOLALA, THUBARAHALLI, BANGALORE-560037",
      amount: 26160,
    },
    {
      id: 11,
      name: "SHILPA",
      panNumber: "EJZPS6395Q",
      address:
        "NO-44, 2ND MAIN, 4TH CROSS, DMR LAYOUT, MARGONDANAHALLI, BANGALORE-560036",
      amount: 26160,
    },
    {
      id: 12,
      name: "MAMATHA E",
      panNumber: "DVMPM7240C",
      address:
        "NO 42, KAYAKA NILAYA, 9TH MAIN, 4TH CROSS, HAMPI NAGAR, RPC LAYOUT, BANGALORE-560004",
      amount: 11997,
    },
    {
      id: 13,
      name: "DEEPA R V",
      panNumber: "BLZPD0267R",
      address:
        "NO 347, 5TH MAIN, 3RD CROSS, NEAR GG MANSION, JAGADISHNAGAR, BANGALORE-560075",
      amount: 11997,
    },
    {
      id: 14,
      name: "ADITI SHOME",
      panNumber: "ARRPS0452J",
      address: "1 D, SHARDA REGENCY, G M PALYA, II MAIN BANGALORE-560075",
      amount: 37320,
    },
    {
      id: 15,
      name: "SURABHI K M K",
      panNumber: "CGXPK6786N",
      address: "NO. 200/D, 6TH CROSS, HAL 3RD STAGE, BANGALORE-560075",
      amount: 37320,
    },
    {
      id: 16,
      name: "ANTARA CHOUDHARY",
      panNumber: "AHSPC6445J",
      address:
        "FLAT NUMBER 405, 4TH FLOOR, ARYAV GREENFIELDS KODIEGAHALLI MAIN ROAD NEAR RAJDEEP HARDWARE K R PURAM BANGALORE-560036",
      amount: 36240,
    },
    {
      id: 17,
      name: "KAMAYANI",
      panNumber: "ARFPV4964N",
      address: "S-2, FIRMS LANDMARK, KAGGADASAPURA, BANGALORE-560093",
      amount: 0,
    },
    {
      id: 18,
      name: "GEETHA R",
      panNumber: "AKZPR8166M",
      address:
        "NO. 713, 9TH CROSS, 10TH A MAIN, INDIRANAGAR, II STAGE, BANGALORE-560038",
      amount: 37320,
    },
    {
      id: 19,
      name: "PRAMELA K",
      panNumber: "AYVPK1017G",
      address:
        "NO.204, GANGA PARADISE, ABBAYA REDDY LAYOUT, KAGGADASAPURA, BANGALORE-560093",
      amount: 37320,
    },
    {
      id: 20,
      name: "CHARLOTTE ANTONY",
      panNumber: "APYPC2970A",
      address: "NO. 124, 1ST MAIN, 3 D CROSS, MALLESHPALYA, BANGALORE-560075",
      amount: 35160,
    },
  ];

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return reportData;
    }

    return reportData.filter((item) => {
      return (
        item.name.toLowerCase().includes(keyword) ||
        item.panNumber.toLowerCase().includes(keyword) ||
        item.address.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const selectedTypeDetails = useMemo(() => {
    return salaryTypes.find((item) => item.value === selectedType) || null;
  }, [selectedType]);

  const totalAmount = useMemo(() => {
    return filteredData.reduce((total, item) => {
      return total + Number(item.amount || 0);
    }, 0);
  }, [filteredData]);

  const handleGo = async () => {
    if (!selectedType) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        month: months.indexOf(month) + 1,
        year: Number(year),

        component: selectedType,

        componentType: selectedTypeDetails?.componentType,
      };

      console.log("Salary Component Report Filter", payload);

      // Yahan report API call karna hai.
      // await fetchSalaryComponentReport(payload);
    } finally {
      setLoading(false);
    }
  };

  const handlePdf = () => {
    console.log("Export PDF", {
      month,
      year,
      selectedType,
    });
  };

  const handleExcel = () => {
    console.log("Export Excel", {
      month,
      year,
      selectedType,
    });
  };

  const formatAmount = (value) => {
    return Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const selectedMonthNumber = String(months.indexOf(month) + 1).padStart(
    2,
    "0",
  );

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none cursor-pointer focus:border-indigo-500";

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
              <h1 className="text-2xl font-semibold text-white">
                Employees Salary Report
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                View employee earning and deduction component report
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-end gap-3">
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

            <div className="w-72">
              <select
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
                className={inputClass}
              >
                <option value="">Select Type</option>

                <optgroup label="Earnings">
                  {salaryTypes
                    .filter((item) => item.componentType === "EARNING")
                    .map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label} (Earning)
                      </option>
                    ))}
                </optgroup>

                <optgroup label="Deductions">
                  {salaryTypes
                    .filter((item) => item.componentType === "DEDUCTION")
                    .map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label} (Deduction)
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            <button
              type="button"
              onClick={handleGo}
              disabled={loading || !selectedType}
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg text-white text-sm font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              GO
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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

          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
              <p className="text-gray-200 text-sm font-medium">
                <span className="text-gray-500 text-xs">Month - </span>{" "}
                {selectedMonthNumber}/{year}
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
              <p className="text-gray-200 text-sm font-medium">
                <span className="text-gray-500 text-xs">Report Type - </span>{" "}
                {selectedTypeDetails
                  ? `${selectedTypeDetails.label} (${selectedTypeDetails.componentType === "EARNING" ? "Earning" : "Deduction"})`
                  : "-"}
              </p>
            </div>

            <button
              type="button"
              onClick={handlePdf}
              disabled={!selectedType}
              className="bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText size={16} />
              PDF
            </button>

            <button
              type="button"
              onClick={handleExcel}
              disabled={!selectedType}
              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet size={16} />
              Excel
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-white font-semibold">
                {selectedTypeDetails
                  ? `${selectedTypeDetails.label} Report`
                  : "Salary Component Report"}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Employee-wise salary component details
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
              <p className="text-white font-semibold">
                <span className="text-gray-500 text-xs">
                  Total Employees -{" "}
                </span>{" "}
                {filteredData.length}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 w-20">
                  SNo.
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 min-w-[220px]">
                  Name
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 min-w-[160px]">
                  PAN Number
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 min-w-[550px]">
                  Address
                </th>

                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 min-w-[150px]">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16">
                    <div className="flex justify-center">
                      <Loader2
                        size={28}
                        className="animate-spin text-indigo-500"
                      />
                    </div>
                  </td>
                </tr>
              ) : !selectedType ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <p className="text-gray-400 text-sm">
                      Select month, year and salary type to view report
                    </p>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-gray-500">
                    No salary report records found
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

                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-200 font-medium">
                        {item.name}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">
                      {item.panNumber || "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-400 leading-relaxed">
                      {item.address || "-"}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-sm font-semibold ${
                          Number(item.amount) > 0
                            ? selectedTypeDetails?.componentType === "DEDUCTION"
                              ? "text-rose-400"
                              : "text-emerald-400"
                            : "text-gray-500"
                        }`}
                      >
                        ₹ {formatAmount(item.amount)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedType && (
          <div className="px-4 py-3 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="text-gray-300 font-medium">
                  {filteredData.length}
                </span>{" "}
                employee records
              </p>

              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">Total Amount:</span>

                <span
                  className={`font-semibold ${
                    selectedTypeDetails?.componentType === "DEDUCTION"
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }`}
                >
                  ₹ {formatAmount(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesSalaryComponentReport;
