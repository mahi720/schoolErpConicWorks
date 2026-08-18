import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeesSalaryReport = () => {
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState("July");
  const [year, setYear] = useState(String(currentYear));
  const [reportType, setReportType] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const reportTypes = [
    {
      value: "TEACHING",
      label: "Teaching",
    },
    {
      value: "NON_TEACHING",
      label: "Non Teaching",
    },
    {
      value: "ALL",
      label: "All Employees",
    },
  ];

  const salaryData = [
    {
      id: 1,
      name: "S KANCHANA",
      employeeCode: "770232",
      department: "NON TEACHING",
      basicPay: 35300,
      da: 21180,
      hra: 10590,
      ta: 5760,
      honorarium: 0,
      cca: 0,
      arrears: 4116,
      miscIncome: 432,
      telephoneAllowance: 0,
      interimRelief: 0,
      festivalAdvance: 0,
      grossPay: 77378,
      pf: 7271.52,
      vpf: 6777.6,
      pt: 200,
      esi: 0,
      quartersRent: 0,
      incomeTax: 0,
      drf: 680,
      festAdv: 0,
      voluntaryContribution: 200,
      miscDeduction: 0,
      advance: 0,
      loan: 0,
      totalDeduction: 15129.12,
      netSalary: 62249,
    },
    {
      id: 2,
      name: "ANITHA V.",
      employeeCode: "16212",
      department: "NON TEACHING",
      basicPay: 44425,
      da: 6996.94,
      hra: 8885,
      ta: 0,
      honorarium: 0,
      cca: 750,
      arrears: 26462,
      miscIncome: 0,
      telephoneAllowance: 0,
      interimRelief: 0,
      festivalAdvance: 0,
      grossPay: 87518.94,
      pf: 9346.07,
      vpf: 0,
      pt: 200,
      esi: 0,
      quartersRent: 12045,
      incomeTax: 0,
      drf: 680,
      festAdv: 2500,
      voluntaryContribution: 100,
      miscDeduction: 0,
      advance: 0,
      loan: 0,
      totalDeduction: 24871.07,
      netSalary: 62648,
    },
    {
      id: 3,
      name: "DEVENDRA SINGH",
      employeeCode: "812308",
      department: "TEACHING",
      basicPay: 78800,
      da: 47280,
      hra: 23640,
      ta: 11520,
      honorarium: 0,
      cca: 0,
      arrears: 9456,
      miscIncome: 864,
      telephoneAllowance: 500,
      interimRelief: 0,
      festivalAdvance: 0,
      grossPay: 172060,
      pf: 16264.32,
      vpf: 15129.6,
      pt: 200,
      esi: 0,
      quartersRent: 26004,
      incomeTax: 17000,
      drf: 680,
      festAdv: 0,
      voluntaryContribution: 0,
      miscDeduction: 0,
      advance: 0,
      loan: 0,
      totalDeduction: 75277.92,
      netSalary: 96782,
    },
    {
      id: 4,
      name: "SAVAREENA ILANGO",
      employeeCode: "811193",
      department: "TEACHING",
      basicPay: 78800,
      da: 47280,
      hra: 23640,
      ta: 5760,
      honorarium: 0,
      cca: 0,
      arrears: 9180,
      miscIncome: 350,
      telephoneAllowance: 0,
      interimRelief: 0,
      festivalAdvance: 0,
      grossPay: 165010,
      pf: 16231.2,
      vpf: 0,
      pt: 200,
      esi: 0,
      quartersRent: 0,
      incomeTax: 17000,
      drf: 680,
      festAdv: 0,
      voluntaryContribution: 1000,
      miscDeduction: 0,
      advance: 0,
      loan: 0,
      totalDeduction: 35111.2,
      netSalary: 129899,
    },
    {
      id: 5,
      name: "RICHA KAUL",
      employeeCode: "811194",
      department: "TEACHING",
      basicPay: 74300,
      da: 44580,
      hra: 22290,
      ta: 5760,
      honorarium: 0,
      cca: 0,
      arrears: 8652,
      miscIncome: 338,
      telephoneAllowance: 0,
      interimRelief: 0,
      festivalAdvance: 0,
      grossPay: 155920,
      pf: 15303.84,
      vpf: 0,
      pt: 200,
      esi: 0,
      quartersRent: 0,
      incomeTax: 14000,
      drf: 0,
      festAdv: 0,
      voluntaryContribution: 0,
      miscDeduction: 0,
      advance: 0,
      loan: 0,
      totalDeduction: 29503.84,
      netSalary: 126416,
    },
  ];

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return salaryData.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.employeeCode.toLowerCase().includes(keyword) ||
        item.department.toLowerCase().includes(keyword);

      const matchesType =
        !reportType ||
        reportType === "ALL" ||
        (reportType === "TEACHING" && item.department === "TEACHING") ||
        (reportType === "NON_TEACHING" && item.department === "NON TEACHING");

      return matchesSearch && matchesType;
    });
  }, [search, reportType]);

  const handleGo = async () => {
    try {
      setLoading(true);

      const payload = {
        month: months.indexOf(month) + 1,
        year: Number(year),
        type: reportType || undefined,
      };

      console.log("Salary Report Filters", payload);

      // Yahan salary report fetch API call karna hai.
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    console.log("Download Excel", {
      month,
      year,
      reportType,
    });
  };

  const handleReport = () => {
    console.log("Salary Report", {
      month,
      year,
      reportType,
    });
  };

  const handleDetailedReport = () => {
    console.log("Detailed Salary Report", {
      month,
      year,
      reportType,
    });
    navigate("/hrm/salaries/salary-component-report");
  };

  const formatAmount = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString("en-IN", {
      minimumFractionDigits: Number.isInteger(number) ? 0 : 2,
      maximumFractionDigits: 2,
    });
  };

  const selectedMonthNumber = String(months.indexOf(month) + 1).padStart(
    2,
    "0",
  );

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none cursor-pointer focus:border-indigo-500";

  const tableHeaderClass =
    "px-3 py-3 text-left text-[11px] font-medium text-gray-400 whitespace-nowrap";

  const tableCellClass = "px-3 py-3 text-xs text-gray-300 whitespace-nowrap";

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-5">
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
                Employees Salary
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                View complete monthly salary breakup of employees
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-5">
              <button
                type="button"
                onClick={handleDownloadExcel}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet size={16} />
                Download Excel
              </button>

              <div className="w-44">
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

              <div className="w-40">
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
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Go
              </button>

              <button
                type="button"
                onClick={handleReport}
                className="bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer"
              >
                <FileText size={16} />
                Report
              </button>
            </div>

            {/* <div className="flex flex-wrap items-end justify-end gap-3">
              <div className="w-96 max-w-full">
                <select
                  value={reportType}
                  onChange={(event) => setReportType(event.target.value)}
                  className={inputClass}
                >
                  <option value="">Select Type</option>

                  {reportTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleDetailedReport}
                className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer"
              >
                <FileText size={16} />
                Report
              </button>
            </div> */}

            {/* <p className="text-sm text-gray-400">
              Month:{" "}
              <span className="text-white font-medium">
                {selectedMonthNumber}/{year}
              </span>
            </p> */}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-800">
          <div className="flex flex-wrap items-end justify-end gap-3">
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
            <button
              type="button"
              onClick={handleDetailedReport}
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer"
            >
              <FileText size={16} />
              Salary Type Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
          <table className="w-full min-w-[3300px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className={tableHeaderClass}>SNo.</th>
                <th className={tableHeaderClass}>Name</th>

                <th className={tableHeaderClass}>Emp. Code</th>

                <th className={tableHeaderClass}>Dept</th>

                <th className={tableHeaderClass}>BASIC PAY</th>

                <th className={tableHeaderClass}>DA</th>

                <th className={tableHeaderClass}>HRA</th>

                <th className={tableHeaderClass}>TA</th>

                <th className={tableHeaderClass}>HONORARIUM</th>

                <th className={tableHeaderClass}>CCA</th>

                <th className={tableHeaderClass}>ARREARS</th>

                <th className={tableHeaderClass}>MISC. INCOME</th>

                <th className={tableHeaderClass}>TELEPHONE ALLOWANCE</th>

                <th className={tableHeaderClass}>INTERIM RELIEF</th>

                <th className={tableHeaderClass}>FESTIVAL ADVANCE</th>

                <th className="px-3 py-3 text-left text-[11px] font-semibold text-emerald-400 whitespace-nowrap">
                  Gross Pay
                </th>

                <th className={tableHeaderClass}>PF</th>

                <th className={tableHeaderClass}>VPF</th>

                <th className={tableHeaderClass}>PT</th>

                <th className={tableHeaderClass}>ESI</th>

                <th className={tableHeaderClass}>QUARTERS RENT</th>

                <th className={tableHeaderClass}>INCOME TAX</th>

                <th className={tableHeaderClass}>DRF</th>

                <th className={tableHeaderClass}>FEST ADV</th>

                <th className={tableHeaderClass}>VOLUNTARY CONTRIBUTION</th>

                <th className={tableHeaderClass}>MISC. DEDUCTION</th>

                <th className={tableHeaderClass}>Advance</th>

                <th className={tableHeaderClass}>Loan</th>

                <th className="px-3 py-3 text-left text-[11px] font-semibold text-rose-400 whitespace-nowrap">
                  Total Deduction
                </th>

                <th className="px-3 py-3 text-left text-[11px] font-semibold text-indigo-400 whitespace-nowrap">
                  Net Salary
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={29} className="py-16">
                    <div className="flex justify-center">
                      <Loader2
                        size={28}
                        className="animate-spin text-indigo-500"
                      />
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={29} className="py-14 text-center text-gray-500">
                    No salary records found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className={tableCellClass}>{index + 1}.</td>

                    <td
                      className={`${tableCellClass} font-medium text-gray-200`}
                    >
                      {item.name}
                    </td>

                    <td className={tableCellClass}>{item.employeeCode}</td>

                    <td className={tableCellClass}>{item.department}</td>

                    <td className={tableCellClass}>
                      {formatAmount(item.basicPay)}
                    </td>

                    <td className={tableCellClass}>{formatAmount(item.da)}</td>

                    <td className={tableCellClass}>{formatAmount(item.hra)}</td>

                    <td className={tableCellClass}>{formatAmount(item.ta)}</td>

                    <td className={tableCellClass}>
                      {formatAmount(item.honorarium)}
                    </td>

                    <td className={tableCellClass}>{formatAmount(item.cca)}</td>

                    <td className={tableCellClass}>
                      {formatAmount(item.arrears)}
                    </td>

                    <td className={tableCellClass}>
                      {formatAmount(item.miscIncome)}
                    </td>

                    <td className={tableCellClass}>
                      {formatAmount(item.telephoneAllowance)}
                    </td>

                    <td className={tableCellClass}>
                      {formatAmount(item.interimRelief)}
                    </td>

                    <td className={tableCellClass}>
                      {formatAmount(item.festivalAdvance)}
                    </td>

                    <td className="px-3 py-3 text-xs text-emerald-400 font-medium whitespace-nowrap">
                      ₹ {formatAmount(item.grossPay)}
                    </td>

                    <td className={tableCellClass}>{formatAmount(item.pf)}</td>

                    <td className={tableCellClass}>{formatAmount(item.vpf)}</td>

                    <td className={tableCellClass}>{formatAmount(item.pt)}</td>

                    <td className={tableCellClass}>{formatAmount(item.esi)}</td>

                    <td className={tableCellClass}>
                      {formatAmount(item.quartersRent)}
                    </td>

                    <td className={tableCellClass}>
                      {formatAmount(item.incomeTax)}
                    </td>

                    <td className={tableCellClass}>{formatAmount(item.drf)}</td>

                    <td className={tableCellClass}>
                      {formatAmount(item.festAdv)}
                    </td>

                    <td className={tableCellClass}>
                      {formatAmount(item.voluntaryContribution)}
                    </td>

                    <td className={tableCellClass}>
                      {formatAmount(item.miscDeduction)}
                    </td>

                    <td className={tableCellClass}>
                      {formatAmount(item.advance)}
                    </td>

                    <td className={tableCellClass}>
                      {formatAmount(item.loan)}
                    </td>

                    <td className="px-3 py-3 text-xs text-rose-400 font-medium whitespace-nowrap">
                      ₹ {formatAmount(item.totalDeduction)}
                    </td>

                    <td className="px-3 py-3 text-xs text-indigo-400 font-semibold whitespace-nowrap">
                      ₹ {formatAmount(item.netSalary)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Total Employees:{" "}
            <span className="text-gray-300 font-medium">
              {filteredData.length}
            </span>
          </p>

          <p className="text-xs text-gray-500">
            Salary Month:{" "}
            <span className="text-gray-300 font-medium">
              {selectedMonthNumber}/{year}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeesSalaryReport;
