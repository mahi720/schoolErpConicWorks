import React, { useEffect, useMemo, useState } from "react";

import {
  Save,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  HelpCircle,
  X,
  Edit,
  IndianRupee,
  StopCircle,
  PlusCircle,
  User,
  PlayCircle,
  Loader2,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useEmployeeSalaryStructureStore } from "../../../store/HRM/employee/mployeeSalaryStructureStore";

import { employeePayBandPreviewSchema } from "../../../validations/HRM/employee/employeeSalaryStructureValidation";

const formatAmount = (value) => {
  const amount = Number(value || 0);

  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const normalizeSalaryItems = (items = []) => {
  return items.map((item, index) => {
    const isBasicPay =
      item.isBasicPay === true ||
      (item.componentType === "EARNING" &&
        !item.earningTypeSlug &&
        index === 0);

    return {
      ...item,

      id: item.slug || item.sourceSlug || `${item.componentType}-${index}`,

      name: isBasicPay ? "BASIC PAY" : item.componentName || item.name || "-",

      componentName: isBasicPay
        ? "BASIC PAY"
        : item.componentName || item.name || "-",

      calculationType: isBasicPay ? "FIXED" : item.calculationType || "FIXED",

      calculationBase: isBasicPay
        ? "BASIC_PAY"
        : item.calculationBase || "BASIC_PAY",

      value: Number(item.value || 0),

      amount: Number(item.amount || 0),

      isBasicPay,

      editable: false,
    };
  });
};

const getBasicPayItem = (earnings = []) => {
  return (
    earnings.find((item) => item.isBasicPay === true) ||
    earnings.find(
      (item) =>
        String(item.componentName || item.name || "")
          .trim()
          .toUpperCase() === "BASIC PAY",
    ) ||
    null
  );
};

const recalculateSalaryItems = (earningItems, deductionItems) => {
  const basicItem = getBasicPayItem(earningItems);

  const basicPay = Number(basicItem?.value || basicItem?.amount || 0);

  let runningGross = 0;

  const updatedEarnings = earningItems.map((item) => {
    const isBasicPay =
      item.isBasicPay === true ||
      String(item.componentName || item.name || "")
        .trim()
        .toUpperCase() === "BASIC PAY";

    if (isBasicPay) {
      runningGross += basicPay;

      return {
        ...item,
        name: "BASIC PAY",
        componentName: "BASIC PAY",
        calculationType: "FIXED",
        calculationBase: "BASIC_PAY",
        value: basicPay,
        amount: basicPay,
        isBasicPay: true,
        editable: false,
      };
    }

    let amount = 0;

    if (item.calculationType === "PERCENT") {
      const base =
        item.calculationBase === "GROSS_EARNINGS" ? runningGross : basicPay;

      amount = (Number(item.value || 0) / 100) * base;
    } else {
      amount = Number(item.value || 0);
    }

    runningGross += amount;

    return {
      ...item,
      amount,
    };
  });

  const grossEarnings = updatedEarnings.reduce(
    (total, item) => total + Number(item.amount || 0),
    0,
  );

  const updatedDeductions = deductionItems.map((item) => {
    let amount = 0;

    if (item.calculationType === "PERCENT") {
      const base =
        item.calculationBase === "GROSS_EARNINGS" ? grossEarnings : basicPay;

      amount = (Number(item.value || 0) / 100) * base;
    } else {
      amount = Number(item.value || 0);
    }

    return {
      ...item,
      amount,
    };
  });

  return {
    earnings: updatedEarnings,
    deductions: updatedDeductions,
  };
};

function TableCard({
  title,
  data,
  section,
  icon: Icon,
  colorFrom,
  colorTo,
  onValueChange,
  onToggleEdit,
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden w-full min-w-0 transition-all duration-300 hover:border-gray-700">
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
            Total: ₹{" "}
            {formatAmount(
              data.reduce((total, item) => total + Number(item.amount || 0), 0),
            )}
          </span>
        </div>
      </div>

      <div className="overflow-auto custom-scrollbar max-h-[500px]">
        <table className="w-full min-w-[650px]">
          <thead className="bg-gray-800/50 border-b border-gray-800 sticky top-0 z-10">
            <tr>
              {["Sno.", "Component", "Type", "Value", "Amount (₹)", ""].map(
                (head) => (
                  <th
                    key={head}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {head}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No salary components found
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const isBasicPay =
                  item.isBasicPay === true ||
                  String(item.componentName || item.name || "")
                    .trim()
                    .toUpperCase() === "BASIC PAY";

                const disabled = isBasicPay || !item.editable;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                      {index + 1}.
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm whitespace-nowrap font-semibold text-gray-200">
                        {item.name || "-"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={item.calculationType}
                        onChange={(e) =>
                          onValueChange(
                            section,
                            item.id,
                            "calculationType",
                            e.target.value,
                          )
                        }
                        disabled={disabled}
                        className={`bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 outline-none focus:border-indigo-500 ${
                          disabled
                            ? "opacity-60 cursor-not-allowed"
                            : "cursor-pointer hover:border-gray-600"
                        }`}
                      >
                        <option value="FIXED">Fixed</option>

                        <option value="PERCENT">Percent</option>
                      </select>
                    </td>

                    <td className="px-4 py-3">
                      <div className="relative w-32">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.value}
                          onChange={(e) =>
                            onValueChange(
                              section,
                              item.id,
                              "value",
                              e.target.value,
                            )
                          }
                          disabled={disabled}
                          placeholder="Enter Value"
                          className={`w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-300 outline-none focus:border-indigo-500 ${
                            disabled
                              ? "opacity-60 cursor-not-allowed"
                              : "hover:border-gray-600"
                          }`}
                        />

                        {item.calculationType === "PERCENT" ? (
                          <Percent
                            size={14}
                            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
                          />
                        ) : (
                          <IndianRupee
                            size={14}
                            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
                          />
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-bold whitespace-nowrap ${
                          section === "earnings"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        ₹ {formatAmount(item.amount)}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {!isBasicPay && (
                        <button
                          type="button"
                          onClick={() => onToggleEdit(section, item.id)}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            item.editable
                              ? "bg-indigo-500/20 text-indigo-400"
                              : "text-gray-600 hover:text-indigo-400 hover:bg-indigo-500/10"
                          }`}
                          title={
                            item.editable ? "Editing mode" : "Edit component"
                          }
                        >
                          <Edit size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SalaryStructure() {
  const location = useLocation();

  const navigate = useNavigate();

  const navigationEmployee = location.state?.employee || null;

  const employeeSlug = navigationEmployee?.slug || null;

  const [earnings, setEarnings] = useState([]);

  const [deductions, setDeductions] = useState([]);

  const [showStopConfirm, setShowStopConfirm] = useState(false);

  const [salaryStopped, setSalaryStopped] = useState(false);

  const [showPaybandModal, setShowPaybandModal] = useState(false);

  const [showIncrementModal, setShowIncrementModal] = useState(false);

  const [incrementData, setIncrementData] = useState({
    type: "PERCENT",
    value: "",
  });

  const [paybandData, setPaybandData] = useState({
    payBand: "",
  });

  const [selectedPayBand, setSelectedPayBand] = useState(null);

  const [pendingIncrement, setPendingIncrement] = useState(null);

  const [payBandModalBackup, setPayBandModalBackup] = useState(null);

  const {
    salaryStructure,
    payBands,
    payBandPreview,

    loading,
    payBandLoading,
    previewLoading,
    submitLoading,
    statusLoading,

    fetchPayBands,
    fetchSalaryStructure,
    previewPayBand,
    saveSalaryStructure,
    updateGenerationStatus,

    clearPayBandPreview,
  } = useEmployeeSalaryStructureStore();

  useEffect(() => {
    if (!employeeSlug) {
      return;
    }

    fetchSalaryStructure(employeeSlug);

    fetchPayBands();
  }, [employeeSlug, fetchSalaryStructure, fetchPayBands]);

  useEffect(() => {
    if (!salaryStructure) {
      return;
    }

    const resolvedBasicSalary = Number(
      salaryStructure.basicSalary || salaryStructure.payBand?.name || 0,
    );

    let normalizedEarnings = normalizeSalaryItems(salaryStructure.earnings);

    const hasBasicPay = normalizedEarnings.some(
      (item) => item.isBasicPay === true,
    );

    normalizedEarnings = normalizedEarnings.map((item) =>
      item.isBasicPay
        ? {
            ...item,
            name: "BASIC PAY",
            componentName: "BASIC PAY",
            calculationType: "FIXED",
            calculationBase: "BASIC_PAY",
            value: resolvedBasicSalary,
            amount: resolvedBasicSalary,
            editable: false,
          }
        : item,
    );

    if (!hasBasicPay) {
      normalizedEarnings.unshift({
        id: "basic-pay",
        slug: null,
        sourceSlug: null,
        componentType: "EARNING",
        componentName: "BASIC PAY",
        name: "BASIC PAY",
        earningTypeSlug: null,
        deductionTypeSlug: null,
        calculationType: "FIXED",
        calculationBase: "BASIC_PAY",
        value: resolvedBasicSalary,
        amount: resolvedBasicSalary,
        displayOrder: 0,
        isBasicPay: true,
        isModified: false,
        editable: false,
      });
    }

    const recalculated = recalculateSalaryItems(
      normalizedEarnings,
      normalizeSalaryItems(salaryStructure.deductions),
    );

    setEarnings(recalculated.earnings);
    setDeductions(recalculated.deductions);
    setSelectedPayBand(salaryStructure.payBand || null);
    setPendingIncrement(null);
    setSalaryStopped(Boolean(salaryStructure.salaryGenerationStopped));
  }, [salaryStructure]);

  useEffect(() => {
    if (!showPaybandModal || !payBandPreview) {
      return;
    }

    const previewBasicSalary = Number(
      payBandPreview.basicSalary || payBandPreview.payBand?.name || 0,
    );

    let normalizedEarnings = normalizeSalaryItems(payBandPreview.earnings);

    const hasBasicPay = normalizedEarnings.some(
      (item) => item.isBasicPay === true,
    );

    normalizedEarnings = normalizedEarnings.map((item) =>
      item.isBasicPay
        ? {
            ...item,
            name: "BASIC PAY",
            componentName: "BASIC PAY",
            calculationType: "FIXED",
            calculationBase: "BASIC_PAY",
            value: previewBasicSalary,
            amount: previewBasicSalary,
            editable: false,
          }
        : item,
    );

    if (!hasBasicPay) {
      normalizedEarnings.unshift({
        id: "basic-pay-preview",
        slug: null,
        sourceSlug: null,
        componentType: "EARNING",
        componentName: "BASIC PAY",
        name: "BASIC PAY",
        earningTypeSlug: null,
        deductionTypeSlug: null,
        calculationType: "FIXED",
        calculationBase: "BASIC_PAY",
        value: previewBasicSalary,
        amount: previewBasicSalary,
        displayOrder: 0,
        isBasicPay: true,
        isModified: false,
        editable: false,
      });
    }

    const recalculated = recalculateSalaryItems(
      normalizedEarnings,
      normalizeSalaryItems(payBandPreview.deductions),
    );

    setEarnings(recalculated.earnings);
    setDeductions(recalculated.deductions);
  }, [payBandPreview, showPaybandModal]);

  const displayedStructure =
    showPaybandModal && payBandPreview ? payBandPreview : salaryStructure;

  const employee =
    displayedStructure?.employee ||
    salaryStructure?.employee ||
    navigationEmployee ||
    null;

  const currentPayBand =
    showPaybandModal && payBandPreview
      ? payBandPreview.payBand
      : selectedPayBand || salaryStructure?.payBand || null;

  const totalEarnings = useMemo(
    () => earnings.reduce((total, item) => total + Number(item.amount || 0), 0),
    [earnings],
  );

  const totalDeductions = useMemo(
    () =>
      deductions.reduce((total, item) => total + Number(item.amount || 0), 0),
    [deductions],
  );

  const netSalary = totalEarnings - totalDeductions;

  const basicSalary = useMemo(() => {
    const basicItem = getBasicPayItem(earnings);

    if (basicItem) {
      return Number(basicItem.value || basicItem.amount || 0);
    }

    return Number(displayedStructure?.basicSalary || currentPayBand?.name || 0);
  }, [earnings, displayedStructure, currentPayBand]);

  const employeeRole =
    [employee?.department?.name, employee?.designation?.name]
      .filter(Boolean)
      .join(" | ") || "-";

  const handleValueChange = (section, id, field, value) => {
    const currentEarnings = [...earnings];

    const currentDeductions = [...deductions];

    const updateList = (list) =>
      list.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,

          [field]: field === "value" ? Number(value || 0) : value,

          isModified: true,
        };
      });

    const nextEarnings =
      section === "earnings" ? updateList(currentEarnings) : currentEarnings;

    const nextDeductions =
      section === "deductions"
        ? updateList(currentDeductions)
        : currentDeductions;

    const recalculated = recalculateSalaryItems(nextEarnings, nextDeductions);

    setEarnings(recalculated.earnings);

    setDeductions(recalculated.deductions);
  };

  const toggleEdit = (section, id) => {
    if (section === "earnings") {
      setEarnings((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                editable: !item.editable,
              }
            : item,
        ),
      );

      return;
    }

    setDeductions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              editable: !item.editable,
            }
          : item,
      ),
    );
  };

  const restoreCurrentStructure = () => {
    if (!salaryStructure) {
      setEarnings([]);
      setDeductions([]);
      return;
    }

    setEarnings(normalizeSalaryItems(salaryStructure.earnings));

    setDeductions(normalizeSalaryItems(salaryStructure.deductions));
    setSelectedPayBand(salaryStructure.payBand || null);
    setPendingIncrement(null);
  };

  const handleOpenPayBandModal = () => {
    setPayBandModalBackup({
      earnings,
      deductions,
      selectedPayBand,
      pendingIncrement,
    });

    setPaybandData({
      payBand: currentPayBand?.name || "",
    });

    clearPayBandPreview();

    setShowPaybandModal(true);
  };

  const handleClosePayBandModal = () => {
    if (payBandModalBackup) {
      setEarnings(payBandModalBackup.earnings);
      setDeductions(payBandModalBackup.deductions);
      setSelectedPayBand(payBandModalBackup.selectedPayBand);
      setPendingIncrement(payBandModalBackup.pendingIncrement);
    } else {
      restoreCurrentStructure();
    }

    clearPayBandPreview();

    setPaybandData({
      payBand: "",
    });

    setPayBandModalBackup(null);
    setShowPaybandModal(false);
  };

  const handlePayBandSelect = async (e) => {
    const payBand = e.target.value;

    setPaybandData({
      payBand,
    });

    clearPayBandPreview();

    if (!payBand) {
      restoreCurrentStructure();
      return;
    }

    const validation = employeePayBandPreviewSchema.safeParse({
      payBand,
    });

    if (!validation.success) {
      toast.error(
        validation.error.issues?.[0]?.message || "Pay band is required",
      );

      return;
    }

    const success = await previewPayBand(employeeSlug, validation.data.payBand);

    if (!success) {
      restoreCurrentStructure();
    }
  };

  const handlePaybandSubmit = () => {
    if (!payBandPreview) {
      toast.error("Please select a pay band");
      return;
    }

    setSelectedPayBand(payBandPreview.payBand);

    const previewBasicSalary = Number(
      payBandPreview.basicSalary || payBandPreview.payBand?.name || 0,
    );

    let previewEarnings = normalizeSalaryItems(payBandPreview.earnings);

    const hasBasicPay = previewEarnings.some(
      (item) => item.isBasicPay === true,
    );

    previewEarnings = previewEarnings.map((item) =>
      item.isBasicPay
        ? {
            ...item,
            name: "BASIC PAY",
            componentName: "BASIC PAY",
            calculationType: "FIXED",
            calculationBase: "BASIC_PAY",
            value: previewBasicSalary,
            amount: previewBasicSalary,
            editable: false,
          }
        : item,
    );

    if (!hasBasicPay) {
      previewEarnings.unshift({
        id: "basic-pay-applied",
        slug: null,
        sourceSlug: null,
        componentType: "EARNING",
        componentName: "BASIC PAY",
        name: "BASIC PAY",
        earningTypeSlug: null,
        deductionTypeSlug: null,
        calculationType: "FIXED",
        calculationBase: "BASIC_PAY",
        value: previewBasicSalary,
        amount: previewBasicSalary,
        displayOrder: 0,
        isBasicPay: true,
        isModified: false,
        editable: false,
      });
    }

    const recalculated = recalculateSalaryItems(
      previewEarnings,
      normalizeSalaryItems(payBandPreview.deductions),
    );

    setEarnings(recalculated.earnings);
    setDeductions(recalculated.deductions);
    setPendingIncrement(null);
    setPayBandModalBackup(null);

    clearPayBandPreview();
    setShowPaybandModal(false);
    setPaybandData({ payBand: "" });

    toast.success("Pay band applied. Click Save to save changes.");
  };

  const saveChanges = async () => {
    const payBandName = selectedPayBand?.name || salaryStructure?.payBand?.name;

    if (!payBandName) {
      toast.error("Pay band is required");
      return;
    }

    const basicItem = getBasicPayItem(earnings);

    if (!basicItem) {
      toast.error("Basic Pay component not found");
      return;
    }

    const basicSalaryValue = Number(
      basicItem.value || basicItem.amount || currentPayBand?.name || 0,
    );

    const payload = {
      payBand: payBandName,
      basicSalary: basicSalaryValue,

      earnings: earnings.map((item, index) => {
        const isBasicPay =
          item.isBasicPay === true ||
          String(item.componentName || item.name || "")
            .trim()
            .toUpperCase() === "BASIC PAY";

        return {
          componentType: "EARNING",
          componentName: isBasicPay
            ? "BASIC PAY"
            : item.componentName || item.name || "EARNING",
          earningTypeSlug: isBasicPay ? null : item.earningTypeSlug || null,
          deductionTypeSlug: null,
          calculationType: isBasicPay ? "FIXED" : item.calculationType,
          value: isBasicPay ? basicSalaryValue : Number(item.value || 0),
          calculationBase: isBasicPay
            ? "BASIC_PAY"
            : item.calculationBase || "BASIC_PAY",
          amount: isBasicPay ? basicSalaryValue : Number(item.amount || 0),
          displayOrder: isBasicPay ? 0 : Number(item.displayOrder ?? index),
          isBasicPay,
          isModified: Boolean(item.isModified),
        };
      }),

      deductions: deductions.map((item, index) => ({
        componentType: "DEDUCTION",
        componentName: item.componentName || item.name || "DEDUCTION",
        earningTypeSlug: null,
        deductionTypeSlug: item.deductionTypeSlug || null,
        calculationType: item.calculationType,
        value: Number(item.value || 0),
        calculationBase: item.calculationBase || "BASIC_PAY",
        amount: Number(item.amount || 0),
        displayOrder: Number(item.displayOrder ?? index),
        isBasicPay: false,
        isModified: Boolean(item.isModified),
      })),

      increment: pendingIncrement,
    };

    const success = await saveSalaryStructure(employeeSlug, payload);

    if (success) {
      setPendingIncrement(null);
      clearPayBandPreview();
    }
  };

  const handleStopSalary = async () => {
    const success = await updateGenerationStatus(employeeSlug, true);

    if (success) {
      setSalaryStopped(true);
      setShowStopConfirm(false);
    }
  };

  const handleResumeSalary = async () => {
    const success = await updateGenerationStatus(employeeSlug, false);

    if (success) {
      setSalaryStopped(false);
    }
  };

  const handleIncrementSubmit = () => {
    const value = Number(incrementData.value);

    if (!value || value <= 0) {
      toast.error("Increment value must be greater than 0");
      return;
    }

    const basicItem = getBasicPayItem(earnings);

    if (!basicItem) {
      toast.error("Basic Pay component not found");
      return;
    }

    const previousBasicSalary = Number(
      basicItem.value || basicItem.amount || currentPayBand?.name || 0,
    );

    const incrementAmount =
      incrementData.type === "PERCENT"
        ? (previousBasicSalary * value) / 100
        : value;

    const newBasicSalary = previousBasicSalary + incrementAmount;

    const nextEarnings = earnings.map((item) => {
      const isBasicPay =
        item.isBasicPay === true ||
        String(item.componentName || item.name || "")
          .trim()
          .toUpperCase() === "BASIC PAY";

      if (!isBasicPay) {
        return item;
      }

      return {
        ...item,
        name: "BASIC PAY",
        componentName: "BASIC PAY",
        calculationType: "FIXED",
        calculationBase: "BASIC_PAY",
        value: newBasicSalary,
        amount: newBasicSalary,
        isBasicPay: true,
        isModified: true,
        editable: false,
      };
    });

    const recalculated = recalculateSalaryItems(nextEarnings, deductions);

    setEarnings(recalculated.earnings);
    setDeductions(recalculated.deductions);

    setPendingIncrement({
      type: incrementData.type,
      value,
      previousBasicSalary,
      incrementAmount,
      newBasicSalary,
    });

    setShowIncrementModal(false);
    setIncrementData({
      type: "PERCENT",
      value: "",
    });

    toast.success("Increment applied. Click Save to save changes.");
  };

  if (!employeeSlug) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-gray-400">Employee not selected.</p>

        <button
          type="button"
          onClick={() => navigate("/hrm/employees")}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer"
        >
          Back to Employees
        </button>
      </div>
    );
  }

  if (loading && !salaryStructure) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 size={22} className="animate-spin" />
          Loading salary structure...
        </div>
      </div>
    );
  }

  if (!salaryStructure) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Salary structure not available.</p>

        <button
          type="button"
          onClick={() => fetchSalaryStructure(employeeSlug)}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const deductionRate =
    totalEarnings > 0 ? (totalDeductions / totalEarnings) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-4 sm:p-5 lg:p-6 w-full">
      <div className="w-full max-w-none space-y-6">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Salary Details</h2>

          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                <User size={32} className="text-white" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-300 mb-1">
                  {employee?.fullName || navigationEmployee?.fullName || "-"}
                </h1>

                <p className="text-gray-400 text-sm mb-2">{employeeRole}</p>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-indigo-400" />

                    <span className="text-gray-400 text-xs">Payband:</span>

                    <span className="text-white text-sm font-semibold">
                      {currentPayBand?.name || "-"}
                    </span>

                    <button
                      type="button"
                      onClick={handleOpenPayBandModal}
                      className="ml-1 p-0.5 hover:bg-gray-700 rounded transition-colors cursor-pointer"
                      title="Edit Payband"
                    >
                      <Edit
                        size={12}
                        className="text-gray-400 hover:text-indigo-400"
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee size={14} className="text-green-400" />

                    <span className="text-gray-400 text-xs">Basic Salary:</span>

                    <span className="text-white text-sm font-semibold">
                      ₹ {formatAmount(basicSalary)}
                    </span>

                    <button
                      type="button"
                      onClick={() => setShowIncrementModal(true)}
                      className="ml-1 p-0.5 hover:bg-gray-700 rounded transition-colors cursor-pointer"
                      title="Edit Basic Salary"
                    >
                      <Edit
                        size={12}
                        className="text-gray-400 hover:text-indigo-400"
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-md ${
                      salaryStructure.source === "EMPLOYEE"
                        ? "bg-indigo-500/15 text-indigo-400"
                        : "bg-yellow-500/15 text-yellow-400"
                    }`}
                  >
                    {salaryStructure.source === "EMPLOYEE"
                      ? "Employee Saved Structure"
                      : "Pay Band Default Structure"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <div className="flex flex-wrap gap-3">
                {salaryStopped ? (
                  <button
                    type="button"
                    onClick={handleResumeSalary}
                    disabled={statusLoading}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    {statusLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <PlayCircle size={18} />
                    )}
                    Resume Salary Generation
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowStopConfirm(true)}
                    disabled={statusLoading}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <StopCircle size={18} />
                    Stop Salary Generation
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/hrm/employees/salary-increments/history", {
                      state: {
                        employee: navigationEmployee,
                      },
                    })
                  }
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold flex items-center gap-2 cursor-pointer"
                >
                  {/* <PlusCircle size={18} /> */}
                  Increment History
                </button>

                <button
                  type="button"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <User size={18} />
                  Profile
                </button>
              </div>

              <button
                type="button"
                onClick={saveChanges}
                disabled={submitLoading}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold flex items-center gap-2 cursor-pointer"
              >
                {submitLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {submitLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {salaryStopped && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <StopCircle size={16} />
                Salary generation has been stopped for this employee.
              </p>
            </div>
          )}

          {showPaybandModal && payBandPreview && (
            <div className="mt-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
              <p className="text-indigo-400 text-sm">
                Previewing{" "}
                <span className="font-semibold">
                  {payBandPreview.payBand?.name}
                </span>{" "}
                salary structure. Apply to use it on this screen; click Save to
                persist it.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
          <TableCard
            title="Earnings"
            data={earnings}
            section="earnings"
            icon={TrendingUp}
            colorFrom="from-emerald-600"
            colorTo="to-green-700"
            onValueChange={handleValueChange}
            onToggleEdit={toggleEdit}
          />

          <TableCard
            title="Deductions"
            data={deductions}
            section="deductions"
            icon={TrendingDown}
            colorFrom="from-red-600"
            colorTo="to-red-700"
            onValueChange={handleValueChange}
            onToggleEdit={toggleEdit}
          />
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1 text-center md:text-left">
                <p className="text-gray-400 text-sm mb-1">Gross Earnings</p>

                <p className="text-2xl font-bold text-emerald-400">
                  ₹ {formatAmount(totalEarnings)}
                </p>
              </div>

              <div className="hidden md:block w-px h-12 bg-gray-800" />

              <div className="flex-1 text-center md:text-left">
                <p className="text-gray-400 text-sm mb-1">Total Deductions</p>

                <p className="text-2xl font-bold text-red-400">
                  ₹ {formatAmount(totalDeductions)}
                </p>
              </div>

              <div className="hidden md:block w-px h-12 bg-gray-800" />

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
                  className={`text-3xl font-bold ${
                    netSalary >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  ₹ {formatAmount(netSalary)}
                </p>

                {netSalary < 0 && (
                  <p className="text-xs text-red-400 mt-1">
                    Deductions exceed earnings
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Deduction Rate</span>

                <span>{deductionRate.toFixed(1)}% of gross</span>
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

      {showStopConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/20 p-2 rounded-full">
                  <StopCircle size={24} className="text-red-500" />
                </div>

                <h3 className="text-xl font-bold text-white">
                  Stop Salary Generation
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowStopConfirm(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-300 mb-2">
              Are you sure you want to stop salary generation for
            </p>

            <p className="text-white font-semibold mb-6">
              {employee?.fullName || "-"}?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowStopConfirm(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleStopSalary}
                disabled={statusLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold cursor-pointer flex items-center gap-2"
              >
                {statusLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {statusLoading ? "Stopping..." : "Yes, Stop Salary"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showIncrementModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Salary Increment</h3>

              <button
                type="button"
                onClick={() => setShowIncrementModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm block mb-2">
                  Increment Type <span className="text-red-500">*</span>
                </label>

                <select
                  value={incrementData.type}
                  onChange={(e) =>
                    setIncrementData((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                >
                  <option value="PERCENT">Percent</option>

                  <option value="FIXED">Fixed</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 text-sm block mb-2">
                  Value <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={incrementData.value}
                    onChange={(e) =>
                      setIncrementData((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    placeholder={
                      incrementData.type === "PERCENT"
                        ? "Enter Percentage"
                        : "Enter Amount"
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pl-8 text-white outline-none focus:border-indigo-500"
                  />

                  {incrementData.type === "PERCENT" ? (
                    <Percent
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                  ) : (
                    <IndianRupee
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowIncrementModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleIncrementSubmit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaybandModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Change Pay Band
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Select Pay Band to preview its salary structure
                </p>
              </div>

              <button
                type="button"
                onClick={handleClosePayBandModal}
                disabled={previewLoading}
                className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="text-gray-300 text-sm block mb-2">
                Pay Band <span className="text-red-500">*</span>
              </label>

              <select
                value={paybandData.payBand}
                onChange={handlePayBandSelect}
                disabled={payBandLoading || previewLoading}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500 disabled:opacity-50 cursor-pointer"
              >
                <option value="">Select Pay Band</option>

                {payBands.map((option) => (
                  <option key={option.slug || option.name} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>

              {previewLoading && (
                <div className="flex items-center gap-2 text-sm text-indigo-400 mt-3">
                  <Loader2 size={16} className="animate-spin" />
                  Loading Pay Band details...
                </div>
              )}

              {payBandPreview && !previewLoading && (
                <div className="mt-4 bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-2">
                  <p className="text-sm text-gray-400">Selected Pay Band</p>

                  <p className="text-white font-semibold">
                    {payBandPreview.payBand?.name}
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div>
                      <p className="text-xs text-gray-500">Basic</p>

                      <p className="text-sm text-green-400">
                        ₹ {formatAmount(payBandPreview.basicSalary)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Gross</p>

                      <p className="text-sm text-green-400">
                        ₹ {formatAmount(payBandPreview.grossEarnings)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Net</p>

                      <p className="text-sm text-indigo-400">
                        ₹ {formatAmount(payBandPreview.netSalary)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={handleClosePayBandModal}
                disabled={previewLoading}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePaybandSubmit}
                disabled={previewLoading || !payBandPreview}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
