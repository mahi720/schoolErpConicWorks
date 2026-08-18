import React, { useMemo, useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  Loader2,
  Printer,
  Search,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BankStatement = () => {
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState("June");
  const [year, setYear] = useState(String(currentYear));
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

  const salaryData = [
    {
      id: 1,
      employeeId: "811273",
      name: "K PRATHIBHA AJITH",
      department: "TEACHING",
      designation: "PRT",
      bank: "State Bank of India",
      accountNo: "20080447546",
      ifsc: "SBIN0001114",
      amount: 93389,
    },
    {
      id: 2,
      employeeId: "812025",
      name: "SUMATHY K",
      department: "TEACHING",
      designation: "PRT",
      bank: "State Bank of India",
      accountNo: "10918045403",
      ifsc: "SBIN0001114",
      amount: 98631,
    },
    {
      id: 3,
      employeeId: "812034",
      name: "SHOBA NARAYANAN",
      department: "TEACHING",
      designation: "PRT",
      bank: "State Bank of India",
      accountNo: "10918045334",
      ifsc: "SBIN0001114",
      amount: 96798,
    },
    {
      id: 4,
      employeeId: "812198",
      name: "GANGA S NAIR",
      department: "TEACHING",
      designation: "PRT",
      bank: "State Bank of India",
      accountNo: "20004306220",
      ifsc: "SBIN0001114",
      amount: 93672,
    },
    {
      id: 5,
      employeeId: "812199",
      name: "RAJESWARI RAMESH",
      department: "TEACHING",
      designation: "PRT",
      bank: "State Bank of India",
      accountNo: "20012474195",
      ifsc: "SBIN0001114",
      amount: 93672,
    },
    {
      id: 6,
      employeeId: "812200",
      name: "MITU ROY",
      department: "TEACHING",
      designation: "PRT",
      bank: "State Bank of India",
      accountNo: "30425739207",
      ifsc: "SBIN0001114",
      amount: 91672,
    },
    {
      id: 7,
      employeeId: "812290",
      name: "RANJINI VARMA K",
      department: "TEACHING",
      designation: "PRT",
      bank: "State Bank of India",
      accountNo: "32368251234",
      ifsc: "SBIN0001114",
      amount: 88318,
    },
    {
      id: 8,
      employeeId: "812291",
      name: "JASMINE HARTLEY PEREIRA",
      department: "TEACHING",
      designation: "PRT",
      bank: "State Bank of India",
      accountNo: "32614278349",
      ifsc: "SBIN0001114",
      amount: 88318,
    },
    {
      id: 9,
      employeeId: "812293",
      name: "SUJATHA VP",
      department: "TEACHING",
      designation: "PRT",
      bank: "State Bank of India",
      accountNo: "33072592533",
      ifsc: "SBIN0001114",
      amount: 88318,
    },
    {
      id: 10,
      employeeId: "812305",
      name: "POOJA SHARMA",
      department: "TEACHING",
      designation: "PRT",
      bank: "State Bank of India",
      accountNo: "20129653467",
      ifsc: "SBIN0001114",
      amount: 76992,
    },
    {
      id: 11,
      employeeId: "812306",
      name: "SHILPA",
      department: "TEACHING",
      designation: "PRT",
      bank: "State Bank of India",
      accountNo: "20472066362",
      ifsc: "SBIN0001114",
      amount: 76992,
    },
    {
      id: 12,
      employeeId: "202122",
      name: "MAMATHA E",
      department: "TEACHING",
      designation: "PRT",
      bank: "State Bank of India",
      accountNo: "40988747165",
      ifsc: "SBIN0001114",
      amount: 62124,
    },
    {
      id: 13,
      employeeId: "202129",
      name: "DEEPA R V",
      department: "TEACHING",
      designation: "PRT",
      bank: "State Bank of India",
      accountNo: "38412698289",
      ifsc: "SBIN0001114",
      amount: 62124,
    },
    {
      id: 14,
      employeeId: "811271",
      name: "ADITI SHOME",
      department: "TEACHING",
      designation: "TGT",
      bank: "State Bank of India",
      accountNo: "31765558465",
      ifsc: "SBIN0001114",
      amount: 98588,
    },
    {
      id: 15,
      employeeId: "811272",
      name: "SURABHI K M K",
      department: "TEACHING",
      designation: "TGT",
      bank: "State Bank of India",
      accountNo: "20080447502",
      ifsc: "SBIN0001114",
      amount: 98588,
    },
    {
      id: 16,
      employeeId: "811283",
      name: "ANTARA CHOUDHARY",
      department: "TEACHING",
      designation: "TGT",
      bank: "State Bank of India",
      accountNo: "32368193825",
      ifsc: "SBIN0001114",
      amount: 96545,
    },
    {
      id: 17,
      employeeId: "811292",
      name: "KAMAYANI",
      department: "TEACHING",
      designation: "TGT",
      bank: "State Bank of India",
      accountNo: "33079621773",
      ifsc: "SBIN0001114",
      amount: 0,
    },
    {
      id: 18,
      employeeId: "811295",
      name: "GEETHA R",
      department: "TEACHING",
      designation: "TGT",
      bank: "State Bank of India",
      accountNo: "20224448461",
      ifsc: "SBIN0001114",
      amount: 98588,
    },
    {
      id: 19,
      employeeId: "812197",
      name: "PRAMELA K",
      department: "TEACHING",
      designation: "TGT",
      bank: "State Bank of India",
      accountNo: "30198248862",
      ifsc: "SBIN0001114",
      amount: 97588,
    },
    {
      id: 20,
      employeeId: "812269",
      name: "CHARLOTTE ANTONY",
      department: "TEACHING",
      designation: "TGT",
      bank: "State Bank of India",
      accountNo: "31197325092",
      ifsc: "SBIN0001114",
      amount: 93672,
    },
  ];

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return salaryData;
    }

    return salaryData.filter((item) => {
      return (
        item.employeeId.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword) ||
        item.department.toLowerCase().includes(keyword) ||
        item.designation.toLowerCase().includes(keyword) ||
        item.bank.toLowerCase().includes(keyword) ||
        item.accountNo.toLowerCase().includes(keyword) ||
        item.ifsc.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const totalSalary = useMemo(() => {
    return filteredData.reduce((total, item) => {
      return total + Number(item.amount || 0);
    }, 0);
  }, [filteredData]);

  const handleGo = async () => {
    try {
      setLoading(true);

      console.log({
        month,
        year,
      });

      // Yahan salary list fetch API call karna hai.
      // await fetchEmployeeSalary({
      //   month: months.indexOf(month) + 1,
      //   year: Number(year),
      // });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExcel = () => {
    console.log("Export salary Excel", {
      month,
      year,
    });
  };

  const handlePdf = () => {
    console.log("Export salary PDF", {
      month,
      year,
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
                Salary Statements
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                View and export monthly employee salary details
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-end gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <Printer size={16} />
              Print
            </button>

            <button
              type="button"
              onClick={handleExcel}
              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet size={16} />
              Excel
            </button>

            <button
              type="button"
              onClick={handlePdf}
              className="bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-lg text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <FileText size={16} />
              PDF
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
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2.5 rounded-lg text-white text-sm font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              GO
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

          <div className="flex items-center gap-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
              {/* <p className="text-gray-500 text-xs">Month</p> */}

              <p className="text-gray-200 text-sm font-medium mt-1">
                <span className="text-gray-500 text-md">Month - </span>{" "}
                {selectedMonthNumber}/{year}
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
              {/* <p className="text-gray-500 text-xs">Employees</p> */}

              <p className="text-gray-200 text-sm font-medium mt-1">
                <span className="text-gray-500 text-md">Employees - </span>{" "}
                {filteredData.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
          <table className="w-full min-w-[1350px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 w-20">
                  SNo.
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Id
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Name
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Department
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Designation
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Bank
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Account No.
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  IFSC
                </th>

                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-16">
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
                  <td colSpan={9} className="py-14 text-center text-gray-500">
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
                      {index + 1}.
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.employeeId}
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-200 font-medium">
                        {item.name}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-400">
                      {item.department}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-400">
                      {item.designation}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">
                      {item.bank || "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.accountNo || "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.ifsc || "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-right">
                      <span
                        className={`font-medium ${
                          Number(item.amount) > 0
                            ? "text-emerald-400"
                            : "text-red-400"
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

        <div className="px-4 py-3 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="text-gray-300 font-medium">
                {filteredData.length}
              </span>{" "}
              employee salary records
            </p>

            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">Total Salary:</span>

              <span className="text-emerald-400 font-semibold">
                ₹ {formatAmount(totalSalary)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankStatement;
