import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeesLeaveBalanceDetailed = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("2026-06-14");
  const [endDate, setEndDate] = useState("2026-08-19");
  const [loading, setLoading] = useState(false);

  const leaveTypes = [
    {
      key: "CL",
      label: "CL",
    },
    {
      key: "EL",
      label: "EL",
    },
    {
      key: "CPL",
      label: "CPL",
    },
    {
      key: "OOD",
      label: "OOD",
    },
    {
      key: "LWP",
      label: "LWP",
    },
    {
      key: "ML",
      label: "ML",
    },
  ];

  const employeeData = [
    {
      id: 1,
      employeeName: "K PRATHIBHA AJITH",
      employeeId: "811273",
      balances: {
        CL: {
          openingBalance: 3,
          availed: 1,
          closingBalance: 2,
        },
        EL: {
          openingBalance: 89.5,
          availed: 2,
          closingBalance: 92.5,
        },
        CPL: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        OOD: {
          openingBalance: 1,
          availed: 1,
          closingBalance: 0,
        },
        LWP: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        ML: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
      },
    },
    {
      id: 2,
      employeeName: "SUMATHY K",
      employeeId: "812025",
      balances: {
        CL: {
          openingBalance: 7,
          availed: 1,
          closingBalance: 6,
        },
        EL: {
          openingBalance: 148.5,
          availed: 18,
          closingBalance: 136.5,
        },
        CPL: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        OOD: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        LWP: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        ML: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
      },
    },
    {
      id: 3,
      employeeName: "SHOBA NARAYANAN",
      employeeId: "812034",
      balances: {
        CL: {
          openingBalance: 5,
          availed: 1,
          closingBalance: 4,
        },
        EL: {
          openingBalance: 147,
          availed: 50,
          closingBalance: 102,
        },
        CPL: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        OOD: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        LWP: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        ML: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
      },
    },
    {
      id: 4,
      employeeName: "GANGA S NAIR",
      employeeId: "812198",
      balances: {
        CL: {
          openingBalance: 7,
          availed: 3,
          closingBalance: 4,
        },
        EL: {
          openingBalance: 131.5,
          availed: 0,
          closingBalance: 136.5,
        },
        CPL: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        OOD: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        LWP: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        ML: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
      },
    },
    {
      id: 5,
      employeeName: "RAJESWARI RAMESH",
      employeeId: "812199",
      balances: {
        CL: {
          openingBalance: 7,
          availed: 1,
          closingBalance: 6,
        },
        EL: {
          openingBalance: 163,
          availed: 4,
          closingBalance: 164,
        },
        CPL: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        OOD: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        LWP: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        ML: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
      },
    },
    {
      id: 6,
      employeeName: "MITU ROY",
      employeeId: "812200",
      balances: {
        CL: {
          openingBalance: 7,
          availed: 3,
          closingBalance: 4,
        },
        EL: {
          openingBalance: 113,
          availed: 0,
          closingBalance: 118,
        },
        CPL: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        OOD: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        LWP: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        ML: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
      },
    },
    {
      id: 7,
      employeeName: "RANJINI VARMA K",
      employeeId: "812290",
      balances: {
        CL: {
          openingBalance: 6.5,
          availed: 2,
          closingBalance: 3.5,
        },
        EL: {
          openingBalance: 69.5,
          availed: 1,
          closingBalance: 73.5,
        },
        CPL: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        OOD: {
          openingBalance: 2,
          availed: 4,
          closingBalance: 0,
        },
        LWP: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        ML: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
      },
    },
    {
      id: 8,
      employeeName: "JASMINE HARTLEY PEREIRA",
      employeeId: "812291",
      balances: {
        CL: {
          openingBalance: 7,
          availed: 3,
          closingBalance: 4,
        },
        EL: {
          openingBalance: 17.5,
          availed: 2,
          closingBalance: 20.5,
        },
        CPL: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        OOD: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        LWP: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
        ML: {
          openingBalance: 0,
          availed: 0,
          closingBalance: 0,
        },
      },
    },
  ];

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return employeeData;
    }

    return employeeData.filter((item) => {
      return (
        item.employeeName.toLowerCase().includes(keyword) ||
        item.employeeId.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const handleSearch = async () => {
    try {
      setLoading(true);

      const payload = {
        search: search.trim() || undefined,
        startDate,
        endDate,
      };

      console.log("Detailed Leave Balance Filters", payload);

      // Yahan API call karna hai.
      // await fetchDetailedLeaveBalance(payload);
    } finally {
      setLoading(false);
    }
  };

  const handlePdf = () => {
    console.log("Export PDF", {
      startDate,
      endDate,
    });
  };

  const handleExcel = () => {
    console.log("Export Excel", {
      startDate,
      endDate,
    });
  };

  const formatBalance = (value) => {
    if (value === null || value === undefined || value === "") {
      return "0";
    }

    return value;
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
              <h1 className="text-2xl font-semibold text-white">
                Employees Leave Balance Detailed
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                View opening, availed and closing leave balances
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-end">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">End Date</label>

            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="w-11 h-11 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Search"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Search size={18} />
            )}
          </button>

          <button
            type="button"
            onClick={handlePdf}
            className="bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-lg text-white text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText size={16} />
            PDF
          </button>

          <button
            type="button"
            onClick={handleExcel}
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet size={16} />
            Excel
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-white font-semibold">Detailed Leave Balance</h2>

            <p className="text-gray-500 text-sm mt-1">
              Total Employees: {filteredData.length}
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
            <p className="text-gray-500 text-xs">Date Range</p>

            <p className="text-gray-300 text-sm mt-1">
              {startDate || "-"} to {endDate || "-"}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar">
          <table className="w-full min-w-[1900px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th
                  rowSpan={2}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 border-r border-gray-700 w-20"
                >
                  Sr No
                </th>

                <th
                  rowSpan={2}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 border-r border-gray-700 min-w-[240px]"
                >
                  Employee Name
                </th>

                <th
                  rowSpan={2}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 border-r border-gray-700 min-w-[170px]"
                >
                  Employee Id/Code
                </th>

                {leaveTypes.map((leave) => (
                  <th
                    key={leave.key}
                    colSpan={3}
                    className="px-4 py-3 text-center text-xs font-semibold text-indigo-300 border-r border-gray-700"
                  >
                    {leave.label}
                  </th>
                ))}
              </tr>

              <tr className="bg-gray-800/80">
                {leaveTypes.map((leave) => (
                  <React.Fragment key={leave.key}>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 min-w-[70px]">
                      OB
                    </th>

                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 min-w-[70px]">
                      Avail
                    </th>

                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 min-w-[70px] border-r border-gray-700">
                      CB
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={3 + leaveTypes.length * 3} className="py-16">
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
                  <td
                    colSpan={3 + leaveTypes.length * 3}
                    className="py-14 text-center text-gray-500"
                  >
                    No detailed leave balance records found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-400 border-r border-gray-800">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-200 font-medium border-r border-gray-800">
                      {item.employeeName}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-300 border-r border-gray-800">
                      {item.employeeId}
                    </td>

                    {leaveTypes.map((leave) => {
                      const balance = item.balances?.[leave.key] || {};

                      return (
                        <React.Fragment key={leave.key}>
                          <td className="px-3 py-3 text-sm text-gray-300 text-center">
                            {formatBalance(balance.openingBalance)}
                          </td>

                          <td className="px-3 py-3 text-sm text-amber-400 text-center">
                            {formatBalance(balance.availed)}
                          </td>

                          <td className="px-3 py-3 text-sm text-emerald-400 text-center font-medium border-r border-gray-800">
                            {formatBalance(balance.closingBalance)}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="text-gray-300 font-medium">
              {filteredData.length}
            </span>{" "}
            employee detailed leave balance records
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeesLeaveBalanceDetailed;
