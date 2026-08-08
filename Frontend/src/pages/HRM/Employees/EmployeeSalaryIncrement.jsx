import React, { useEffect } from "react";

import { ArrowLeft, Loader2, TrendingUp } from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import { useEmployeeSalaryStructureStore } from "../../../store/HRM/employee/mployeeSalaryStructureStore";

const formatAmount = (value) => {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function EmployeeSalaryIncrementHistory() {
  const navigate = useNavigate();

  const location = useLocation();

  const employee = location.state?.employee || null;

  const employeeSlug = employee?.slug || null;

  const { incrementHistory, incrementHistoryLoading, fetchIncrementHistory } =
    useEmployeeSalaryStructureStore();

  useEffect(() => {
    if (!employeeSlug) {
      return;
    }

    fetchIncrementHistory(employeeSlug);
  }, [employeeSlug, fetchIncrementHistory]);

  if (!employeeSlug) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Employee not selected.</p>

        <button
          type="button"
          onClick={() => navigate("/hrm/employees")}
          className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white cursor-pointer"
        >
          Back to Employees
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg text-gray-300 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-white">
            Salary Increment History
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            {employee?.fullName || "-"}{" "}
            {employee?.employeeId ? `(${employee.employeeId})` : ""}
          </p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/15 p-2 rounded-lg">
              <TrendingUp size={20} className="text-indigo-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Increment History
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                All saved salary increments
              </p>
            </div>
          </div>

          <span className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap">
            Total: {incrementHistory.length}
          </span>
        </div>

        <div className="overflow-auto custom-scrollbar max-h-[650px]">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-800 sticky top-0 z-10">
              <tr>
                {[
                  "SNo.",
                  "Pay Band",
                  "Increment Type",
                  "Previous Salary",
                  "Increment Value",
                  "Increment Amount",
                  "New Salary",
                ].map((head) => (
                  <th
                    key={head}
                    className="p-4 text-left text-gray-300 font-semibold whitespace-nowrap"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {incrementHistoryLoading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Loader2 size={20} className="animate-spin" />
                      Loading increment history...
                    </div>
                  </td>
                </tr>
              ) : incrementHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-500">
                    No increment history found
                  </td>
                </tr>
              ) : (
                incrementHistory.map((item, index) => (
                  <tr
                    key={item.slug}
                    className="border-t border-gray-800 hover:bg-gray-800/50"
                  >
                    <td className="p-4 text-gray-300">{index + 1}.</td>

                    <td className="p-4 text-indigo-400 font-semibold whitespace-nowrap">
                      {item.payBand?.name || "-"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                          item.incrementType === "PERCENT"
                            ? "bg-purple-500/15 text-purple-400"
                            : "bg-blue-500/15 text-blue-400"
                        }`}
                      >
                        {item.incrementType === "PERCENT" ? "Percent" : "Fixed"}
                      </span>
                    </td>

                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      ₹ {formatAmount(item.previousBasicSalary)}
                    </td>

                    <td className="p-4 text-gray-300 whitespace-nowrap">
                      {item.incrementType === "PERCENT"
                        ? `${formatAmount(item.incrementValue)}%`
                        : `₹ ${formatAmount(item.incrementValue)}`}
                    </td>

                    <td className="p-4 text-yellow-400 font-semibold whitespace-nowrap">
                      ₹ {formatAmount(item.incrementAmount)}
                    </td>

                    <td className="p-4 text-green-400 font-semibold whitespace-nowrap">
                      ₹ {formatAmount(item.newBasicSalary)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
