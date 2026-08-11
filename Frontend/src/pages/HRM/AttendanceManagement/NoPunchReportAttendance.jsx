import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const NoPunchReport = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const noPunchData = [
    {
      id: 1,
      employeeId: "1411",
      employeeName: "S CHAITHANYA SIROMANI",
      date: "21-07-2026",
      inTime: "07:28 AM",
      outTime: "",
    },
    {
      id: 2,
      employeeId: "812200",
      employeeName: "MITU ROY",
      date: "21-07-2026",
      inTime: "07:35 AM",
      outTime: "",
    },
    {
      id: 3,
      employeeId: "811273",
      employeeName: "K PRATHIBHA AJITH",
      date: "21-07-2026",
      inTime: "07:36 AM",
      outTime: "",
    },
    {
      id: 4,
      employeeId: "812293",
      employeeName: "SUJATHA VP",
      date: "21-07-2026",
      inTime: "07:37 AM",
      outTime: "",
    },
    {
      id: 5,
      employeeId: "812290",
      employeeName: "RANJINI VARMA K",
      date: "21-07-2026",
      inTime: "07:38 AM",
      outTime: "",
    },
    {
      id: 6,
      employeeId: "812199",
      employeeName: "RAJESWARI RAMESH",
      date: "21-07-2026",
      inTime: "07:38 AM",
      outTime: "",
    },
    {
      id: 7,
      employeeId: "811195",
      employeeName: "KAJARI HAZRA",
      date: "21-07-2026",
      inTime: "07:54 AM",
      outTime: "",
    },
    {
      id: 8,
      employeeId: "1408",
      employeeName: "MATHINA BEE K",
      date: "21-07-2026",
      inTime: "07:22 AM",
      outTime: "",
    },
    {
      id: 9,
      employeeId: "1414",
      employeeName: "IMPANA K",
      date: "21-07-2026",
      inTime: "07:23 AM",
      outTime: "",
    },
    {
      id: 10,
      employeeId: "1380",
      employeeName: "POONAM SHRIVASTAVA",
      date: "21-07-2026",
      inTime: "07:25 AM",
      outTime: "",
    },
    {
      id: 11,
      employeeId: "1351",
      employeeName: "K M RAJSHIKHA SINGH",
      date: "21-07-2026",
      inTime: "07:25 AM",
      outTime: "",
    },
    {
      id: 12,
      employeeId: "811193",
      employeeName: "SAVAREENA ILANGO",
      date: "21-07-2026",
      inTime: "07:35 AM",
      outTime: "",
    },
    {
      id: 13,
      employeeId: "16212",
      employeeName: "ANITHA V.",
      date: "21-07-2026",
      inTime: "07:31 AM",
      outTime: "",
    },
    {
      id: 14,
      employeeId: "1349",
      employeeName: "SAVITRI SHIVASHIMPI",
      date: "21-07-2026",
      inTime: "07:34 AM",
      outTime: "",
    },
    {
      id: 15,
      employeeId: "1365",
      employeeName: "BUVANESWARI C",
      date: "21-07-2026",
      inTime: "07:35 AM",
      outTime: "",
    },
    {
      id: 16,
      employeeId: "1382",
      employeeName: "KAVITHA A",
      date: "21-07-2026",
      inTime: "07:36 AM",
      outTime: "",
    },
    {
      id: 17,
      employeeId: "1413",
      employeeName: "SUDHA KUMARI",
      date: "21-07-2026",
      inTime: "07:39 AM",
      outTime: "",
    },
    {
      id: 18,
      employeeId: "770232",
      employeeName: "S KANCHANA",
      date: "21-07-2026",
      inTime: "07:44 AM",
      outTime: "",
    },
    {
      id: 19,
      employeeId: "1383",
      employeeName: "JOYCE M",
      date: "21-07-2026",
      inTime: "07:44 AM",
      outTime: "",
    },
    {
      id: 20,
      employeeId: "812308",
      employeeName: "DEVENDRA SINGH",
      date: "21-07-2026",
      inTime: "07:57 AM",
      outTime: "",
    },
    {
      id: 21,
      employeeId: "1417",
      employeeName: "PADMAJA P",
      date: "21-07-2026",
      inTime: "07:23 AM",
      outTime: "",
    },
    {
      id: 22,
      employeeId: "1418",
      employeeName: "SRITHEELA M K",
      date: "21-07-2026",
      inTime: "07:07 AM",
      outTime: "",
    },
    {
      id: 23,
      employeeId: "89019",
      employeeName: "EUPHRASIA RANI",
      date: "21-07-2026",
      inTime: "07:30 AM",
      outTime: "",
    },
  ];

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return noPunchData;
    }

    return noPunchData.filter((item) => {
      return (
        item.employeeId.toLowerCase().includes(keyword) ||
        item.employeeName.toLowerCase().includes(keyword) ||
        item.date.toLowerCase().includes(keyword) ||
        item.inTime.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const handleExcelExport = async () => {
    try {
      setLoading(true);

      console.log("Export no punch report Excel");

      // Yahan Excel export API call karna hai.
    } finally {
      setLoading(false);
    }
  };

  const handlePdfExport = async () => {
    try {
      setLoading(true);

      console.log("Export no punch report PDF");

      // Yahan PDF export API call karna hai.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              <h1 className="text-2xl text-white font-semibold">
                No Punch Report
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                Employees with missing in or out punch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExcelExport}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileSpreadsheet size={16} />
              )}
              Excel
            </button>

            <button
              type="button"
              onClick={handlePdfExport}
              disabled={loading}
              className="bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileText size={16} />
              )}
              PDF
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-white font-semibold">
                No Punch Employee List
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Total Records: {filteredData.length}
              </p>
            </div>

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

        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 w-16">
                  #
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Employee Id
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Employee Name
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Date
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  In Time
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                  Out Time
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16">
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
                  <td colSpan={6} className="py-14 text-center text-gray-500">
                    No punch records found
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

                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.employeeId}
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-200 font-medium">
                        {item.employeeName}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-400">
                      {item.date}
                    </td>

                    <td className="px-4 py-3">
                      {item.inTime ? (
                        <span className="inline-flex bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md px-2.5 py-1 text-xs font-medium">
                          {item.inTime}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">NA</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {item.outTime ? (
                        <span className="inline-flex bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-md px-2.5 py-1 text-xs font-medium">
                          {item.outTime}
                        </span>
                      ) : (
                        <span className="inline-flex bg-red-500/10 border border-red-500/20 text-red-400 rounded-md px-2.5 py-1 text-xs font-medium">
                          NA
                        </span>
                      )}
                    </td>
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
            no punch records
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoPunchReport;
