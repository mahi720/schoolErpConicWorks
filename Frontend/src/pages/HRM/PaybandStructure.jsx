import React, { useEffect, useMemo, useState } from "react";
import {
  Save,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  HelpCircle,
  CheckCircle,
  Edit,
  IndianRupee,
  Loader2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useEarningTypeStore } from "../../store/hrm/settings/earningType/earningTypeStore";
import { useDeductionTypeStore } from "../../store/hrm/settings/deductionType/deductionTypeStore";
import { usePayBandStructureStore } from "../../store/hrm/settings/payBandStructure/payBandStructureStore";

import { payBandStructureSchema } from "../../validations/hrm/settings/payBandStructure/payBandStructureValidation";

const normalizeCalculationType = (value) => {
  return value === "PERCENT" || value === "Percent" ? "Percent" : "Fixed";
};

const getStoredCalculationType = (value) => {
  return value === "Percent" ? "PERCENT" : "FIXED";
};

const getNumericValue = (value) => {
  const parsedValue = Number.parseFloat(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

export default function PaybandStructure() {
  const location = useLocation();
  const navigate = useNavigate();

  const payBandSlug = location.state?.payBandSlug || "";

  const payBandName = location.state?.payBandName || "-";

  const payBandAmount =
    Number.parseFloat(
      location.state?.payBandAmount ?? location.state?.payBandName,
    ) || 0;

  const [earnings, setEarnings] = useState([]);

  const [deductions, setDeductions] = useState([]);

  const [saved, setSaved] = useState(false);

  const [initializing, setInitializing] = useState(true);

  const {
    earningTypes,
    loading: earningTypeLoading,
    fetchEarningTypes,
  } = useEarningTypeStore();

  const {
    deductionTypes,
    loading: deductionTypeLoading,
    fetchDeductionTypes,
  } = useDeductionTypeStore();

  const {
    structures,
    loading: structureLoading,
    submitLoading,
    fetchPayBandStructure,
    savePayBandStructure,
  } = usePayBandStructureStore();

  useEffect(() => {
    if (!payBandSlug) {
      toast.error("Pay Band select karke structure open karein");

      navigate("/hrm/settings", {
        replace: true,
      });

      return;
    }

    const loadData = async () => {
      setInitializing(true);

      await Promise.all([
        fetchEarningTypes({
          status: "active",
        }),

        fetchDeductionTypes({
          status: "active",
        }),

        fetchPayBandStructure(payBandSlug),
      ]);

      setInitializing(false);
    };

    loadData();
  }, [
    payBandSlug,
    navigate,
    fetchEarningTypes,
    fetchDeductionTypes,
    fetchPayBandStructure,
  ]);

  useEffect(() => {
    if (initializing) return;

    const activeEarningTypes = earningTypes.filter((item) => item.isActive);

    const activeDeductionTypes = deductionTypes.filter((item) => item.isActive);

    const savedBasicPayStructure = structures.find(
      (structure) =>
        structure.isBasicPay === true ||
        (structure.componentType === "EARNING" &&
          !structure.earningTypeSlug &&
          !structure.deductionTypeSlug),
    );

    const basicPayRow = {
      id: "earning-basic-pay",

      structureSlug: savedBasicPayStructure?.slug || null,

      masterSlug: null,

      name: "BASIC PAY",

      type: "Fixed",

      value: getNumericValue(savedBasicPayStructure?.value ?? payBandAmount),

      displayOrder: 0,

      editable: false,

      isBasicPay: true,
    };

    const earningRows = activeEarningTypes
      .filter(
        (earningType) =>
          earningType.earningType?.trim().toUpperCase() !== "BASIC PAY",
      )
      .map((earningType, index) => {
        const savedStructure = structures.find(
          (structure) =>
            !structure.isBasicPay &&
            structure.componentType === "EARNING" &&
            (structure.earningTypeSlug === earningType.slug ||
              structure.earningType?.slug === earningType.slug),
        );

        return {
          id: `earning-${earningType.slug}`,

          structureSlug: savedStructure?.slug || null,

          masterSlug: earningType.slug,

          name: earningType.earningType,

          type: normalizeCalculationType(
            savedStructure?.calculationType || earningType.valueType,
          ),

          value: getNumericValue(savedStructure?.value ?? earningType.value),

          displayOrder: savedStructure?.displayOrder ?? index + 1,

          editable: false,

          isBasicPay: false,
        };
      });

    const deductionRows = activeDeductionTypes.map((deductionType, index) => {
      const savedStructure = structures.find(
        (structure) =>
          structure.componentType === "DEDUCTION" &&
          (structure.deductionTypeSlug === deductionType.slug ||
            structure.deductionType?.slug === deductionType.slug),
      );

      return {
        id: `deduction-${deductionType.slug}`,

        structureSlug: savedStructure?.slug || null,

        masterSlug: deductionType.slug,

        name: deductionType.deductionType,

        type: normalizeCalculationType(
          savedStructure?.calculationType || deductionType.valueType,
        ),

        value: getNumericValue(savedStructure?.value ?? deductionType.value),

        displayOrder: savedStructure?.displayOrder ?? index,

        editable: false,

        isBasicPay: false,
      };
    });

    setEarnings([basicPayRow, ...earningRows]);

    setDeductions(deductionRows);
  }, [initializing, earningTypes, deductionTypes, structures, payBandAmount]);

  const basicPay = useMemo(() => {
    const basicPayRow = earnings.find((item) => item.isBasicPay);

    return getNumericValue(basicPayRow?.value);
  }, [earnings]);

  const calculateAmount = (item) => {
    const value = getNumericValue(item.value);

    if (item.isBasicPay) {
      return value;
    }

    if (item.type === "Percent") {
      return (value / 100) * basicPay;
    }

    return value;
  };

  const earningRowsWithAmount = useMemo(() => {
    return earnings.map((item) => ({
      ...item,
      amount: calculateAmount(item),
    }));
  }, [earnings, basicPay]);

  const deductionRowsWithAmount = useMemo(() => {
    return deductions.map((item) => ({
      ...item,
      amount: calculateAmount(item),
    }));
  }, [deductions, basicPay]);

  const totalEarnings = earningRowsWithAmount.reduce(
    (total, item) => total + item.amount,
    0,
  );

  const totalDeductions = deductionRowsWithAmount.reduce(
    (total, item) => total + item.amount,
    0,
  );

  const netSalary = totalEarnings - totalDeductions;

  const deductionRate =
    totalEarnings > 0 ? (totalDeductions / totalEarnings) * 100 : 0;

  const handleValueChange = (section, id, field, value) => {
    const updateSection = section === "earnings" ? setEarnings : setDeductions;

    updateSection((currentData) =>
      currentData.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (item.isBasicPay && field === "type") {
          return item;
        }

        return {
          ...item,

          [field]: field === "value" ? getNumericValue(value) : value,
        };
      }),
    );
  };

  const toggleEdit = (section, id) => {
    const updateSection = section === "earnings" ? setEarnings : setDeductions;

    updateSection((currentData) =>
      currentData.map((item) =>
        item.id === id
          ? {
              ...item,

              editable: !item.editable,
            }
          : item,
      ),
    );
  };

  const saveChanges = async () => {
    if (!payBandSlug) {
      toast.error("Pay Band is required");

      return;
    }

    if (earnings.length === 0 && deductions.length === 0) {
      toast.error("Earning Type ya Deduction Type available nahi hai");

      return;
    }

    const payload = {
      structures: [
        ...earnings.map((item, index) => ({
          componentType: "EARNING",

          isBasicPay: Boolean(item.isBasicPay),

          earningTypeSlug: item.isBasicPay ? null : item.masterSlug,

          deductionTypeSlug: null,

          calculationType: item.isBasicPay
            ? "FIXED"
            : getStoredCalculationType(item.type),

          value: getNumericValue(item.value),

          calculationBase: "BASIC_PAY",

          displayOrder: index,
        })),

        ...deductions.map((item, index) => ({
          componentType: "DEDUCTION",

          isBasicPay: false,

          earningTypeSlug: null,

          deductionTypeSlug: item.masterSlug,

          calculationType: getStoredCalculationType(item.type),

          value: getNumericValue(item.value),

          calculationBase: "BASIC_PAY",

          displayOrder: index,
        })),
      ],
    };

    const validation = payBandStructureSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message ||
          "Please enter valid Pay Band structure",
      );

      return;
    }

    const success = await savePayBandStructure(payBandSlug, validation.data);

    if (!success) return;

    await fetchPayBandStructure(payBandSlug);

    setEarnings((currentData) =>
      currentData.map((item) => ({
        ...item,
        editable: false,
      })),
    );

    setDeductions((currentData) =>
      currentData.map((item) => ({
        ...item,
        editable: false,
      })),
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const TableCard = ({
    title,
    data,
    section,
    icon: Icon,
    colorFrom,
    colorTo,
  }) => {
    const sectionTotal = data.reduce((total, item) => total + item.amount, 0);

    return (
      <div className="min-w-0 w-full bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-700">
        <div
          className={`bg-gradient-to-r ${colorFrom} ${colorTo} px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3`}
        >
          <div className="min-w-0 flex items-center gap-3">
            <div className="shrink-0 bg-white/10 backdrop-blur-sm p-2 rounded-lg">
              <Icon size={20} className="text-white" />
            </div>

            <h2 className="truncate text-xl font-bold text-white">{title}</h2>
          </div>

          <div className="shrink-0 self-start sm:self-auto bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-white text-sm font-semibold whitespace-nowrap">
              Total: ₹ {sectionTotal.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="w-full min-w-0 overflow-hidden">
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[8%]" />
              <col className="w-[25%]" />
              <col className="w-[18%]" />
              <col className="w-[21%]" />
              <col className="w-[20%]" />
              <col className="w-[8%]" />
            </colgroup>

            <thead className="bg-gray-800/50 border-b border-gray-800">
              <tr>
                <th className="px-2 sm:px-3 py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Sno.
                </th>

                <th className="px-2 sm:px-3 py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Component
                </th>

                <th className="px-2 sm:px-3 py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Type
                </th>

                <th className="px-2 sm:px-3 py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Value
                </th>

                <th className="px-2 sm:px-3 py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Amount
                </th>

                <th className="px-2 sm:px-3 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {(initializing ||
                earningTypeLoading ||
                deductionTypeLoading ||
                structureLoading) && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Loading {title.toLowerCase()}
                      ...
                    </div>
                  </td>
                </tr>
              )}

              {!initializing &&
                !earningTypeLoading &&
                !deductionTypeLoading &&
                !structureLoading &&
                data.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-gray-500"
                    >
                      No {title.toLowerCase()} found
                    </td>
                  </tr>
                )}

              {!initializing &&
                !earningTypeLoading &&
                !deductionTypeLoading &&
                !structureLoading &&
                data.map((item, index) => {
                  const inputDisabled = !item.editable;

                  const typeDisabled = item.isBasicPay || inputDisabled;

                  return (
                    <tr
                      key={item.id}
                      className="group hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-gray-500 font-medium">
                        {index + 1}.
                      </td>

                      <td className="min-w-0 px-2 sm:px-3 py-3">
                        <span className="block break-words text-xs sm:text-sm font-semibold text-gray-200 leading-5">
                          {item.name}
                        </span>
                      </td>

                      <td className="min-w-0 px-2 sm:px-3 py-3">
                        <select
                          value={item.isBasicPay ? "Fixed" : item.type}
                          onChange={(event) =>
                            handleValueChange(
                              section,
                              item.id,
                              "type",
                              event.target.value,
                            )
                          }
                          disabled={typeDisabled}
                          className={`w-full min-w-0 bg-gray-800 border border-gray-700 rounded-lg px-1.5 sm:px-2 py-1.5 text-xs sm:text-sm text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            typeDisabled
                              ? "opacity-60 cursor-not-allowed"
                              : "cursor-pointer hover:border-gray-600"
                          }`}
                        >
                          <option value="Fixed">Fixed</option>

                          <option value="Percent">Percent</option>
                        </select>
                      </td>

                      <td className="min-w-0 px-2 sm:px-3 py-3">
                        <div className="relative min-w-0">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.value}
                            onChange={(event) =>
                              handleValueChange(
                                section,
                                item.id,
                                "value",
                                event.target.value,
                              )
                            }
                            disabled={inputDisabled}
                            className={`w-full min-w-0 bg-gray-800 border border-gray-700 rounded-lg pl-6 sm:pl-7 pr-1.5 sm:pr-2 py-1.5 text-xs sm:text-sm text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                              inputDisabled
                                ? "opacity-60 cursor-not-allowed"
                                : "hover:border-gray-600"
                            }`}
                          />

                          {item.type === "Percent" && !item.isBasicPay ? (
                            <Percent
                              size={13}
                              className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                          ) : (
                            <IndianRupee
                              size={13}
                              className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                          )}
                        </div>
                      </td>

                      <td className="min-w-0 px-2 sm:px-3 py-3">
                        <span
                          className={`block break-words text-xs sm:text-sm font-bold ${
                            section === "earnings"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          ₹{" "}
                          {item.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>

                      <td className="px-1 sm:px-2 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleEdit(section, item.id)}
                          className={`p-1.5 rounded-lg transition-all ${
                            item.editable
                              ? "bg-indigo-500/20 text-indigo-400 cursor-pointer"
                              : "text-gray-600 hover:text-indigo-400 hover:bg-indigo-500/10 cursor-pointer"
                          }`}
                          title={
                            item.editable ? "Editing mode" : "Edit component"
                          }
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-w-0 min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-3 sm:p-4 lg:p-6">
      <div className="w-full min-w-0 space-y-6">
        <div className="w-full min-w-0 bg-gray-900 rounded-2xl border border-gray-800 p-4 sm:p-6 shadow-xl">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg">
                  <DollarSign size={24} className="text-white" />
                </div>

                <h1 className="truncate text-xl sm:text-2xl font-bold text-white">
                  Payband Structure
                </h1>
              </div>

              <p className="ml-0 sm:ml-12 text-sm sm:text-base text-gray-400">
                Configure salary components for{" "}
                <span className="text-indigo-400 font-semibold">
                  {payBandName}
                </span>{" "}
                payband
              </p>
            </div>

            <button
              type="button"
              onClick={saveChanges}
              disabled={submitLoading || initializing || structureLoading}
              className="relative shrink-0 overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-4 sm:px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />

                  <span>Saving...</span>
                </>
              ) : saved ? (
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

        <div className="grid w-full min-w-0 grid-cols-1 2xl:grid-cols-2 gap-6">
          <TableCard
            title="Earnings"
            data={earningRowsWithAmount}
            section="earnings"
            icon={TrendingUp}
            colorFrom="from-emerald-600"
            colorTo="to-green-700"
          />

          <TableCard
            title="Deductions"
            data={deductionRowsWithAmount}
            section="deductions"
            icon={TrendingDown}
            colorFrom="from-red-600"
            colorTo="to-red-700"
          />
        </div>

        <div className="w-full min-w-0 bg-gradient-to-r from-gray-900 to-gray-900 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="min-w-0 flex-1 text-center md:text-left">
                <p className="text-gray-400 text-sm mb-1">Gross Earnings</p>

                <p className="break-words text-xl sm:text-2xl font-bold text-emerald-400">
                  ₹{" "}
                  {totalEarnings.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="hidden md:block w-px h-12 bg-gray-800" />

              <div className="min-w-0 flex-1 text-center md:text-left">
                <p className="text-gray-400 text-sm mb-1">Total Deductions</p>

                <p className="break-words text-xl sm:text-2xl font-bold text-red-400">
                  ₹{" "}
                  {totalDeductions.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="hidden md:block w-px h-12 bg-gray-800" />

              <div className="min-w-0 flex-1 text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end gap-2 mb-1">
                  <p className="text-gray-400 text-sm">Net Payable Salary</p>

                  <HelpCircle
                    size={14}
                    className="shrink-0 text-gray-600 cursor-help"
                    title="Amount after all deductions"
                  />
                </div>

                <p
                  className={`break-words text-2xl sm:text-3xl font-bold ${
                    netSalary >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
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
              <div className="flex justify-between gap-3 text-xs text-gray-500 mb-2">
                <span>Deduction Rate</span>

                <span className="text-right">
                  {deductionRate.toFixed(1)}% of gross
                </span>
              </div>

              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(deductionRate, 100)}%`,
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
