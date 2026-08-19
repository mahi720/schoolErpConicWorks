import { randomUUID } from "crypto";

import {
  runEmployeePayrollTransactionRepo,
  getPayrollEmployeesRepo,
  findPayrollEmployeeSourceRepo,
  getEmployeeAttendanceForPayrollRepo,
  getEmployeeLeaveRequestsForPayrollRepo,
  getEmployeeOvertimeForPayrollRepo,
  getEmployeeAdvanceInstallmentsForPayrollRepo,
  getEmployeeLoanInstallmentsForPayrollRepo,
  getEmployeeBasicSettingsForPayrollRepo,
  getEmployeeHolidaysForPayrollRepo,
  findPayrollRunRepo,
  createPayrollRunRepo,
  updatePayrollRunRepo,
  findEmployeePayrollByPeriodRepo,
  findEmployeePayrollBySlugRepo,
  createEmployeePayrollRepo,
  updateEmployeePayrollRepo,
  deleteEmployeePayrollItemsRepo,
  createEmployeePayrollItemsRepo,
  upsertEmployeePayrollAttendanceRepo,
  deleteEmployeePayrollLeavesRepo,
  createEmployeePayrollLeavesRepo,
  createEmployeePayrollLogRepo,
  getEmployeePayrollLogsRepo,
  unlinkPayrollSourcesRepo,
  linkPayrollSourcesRepo,
  getPayrollRunEmployeePayrollsRepo,
  getSalaryStatementRepo,
  getBankStatementRepo,
  recoverPayrollAdvanceInstallmentsRepo,
  recoverPayrollLoanInstallmentsRepo,
} from "../../../repositories/HRM/salary/employeePayroll.repository.js";

import {
  toNumber,
  getPayrollPeriod,
  calculateSalaryStructure,
  calculateAttendanceAndLeave,
  calculateOvertime,
} from "./employeePayroll.helper.js";

const round2 = (value) => {
  return Number(Number(value || 0).toFixed(2));
};

const getActorSnapshot = (user) => {
  return {
    actorSlug: user?.slug || null,

    actorName: user?.name || null,

    actorEmail: user?.email || null,
  };
};

const buildPayrollLogData = ({
  schoolSlug,
  payrollRunSlug,
  employeePayrollSlug,
  employeeSlug,
  action,
  previousData,
  newData,
  user,
  metadata,
  remarks,
}) => {
  return {
    slug: randomUUID(),

    schoolSlug,

    payrollRunSlug: payrollRunSlug || null,

    employeePayrollSlug: employeePayrollSlug || null,

    employeeSlug: employeeSlug || null,

    action,

    previousData: previousData || null,

    newData: newData || null,

    ...getActorSnapshot(user),

    ipAddress: metadata?.ipAddress || null,

    userAgent: metadata?.userAgent || null,

    remarks: remarks || null,
  };
};

const getOrCreatePayrollRun = async ({
  schoolSlug,
  payrollYear,
  payrollMonth,
  startDate,
  endDate,
  user,
  db,
}) => {
  let payrollRun = await findPayrollRunRepo({
    schoolSlug,

    payrollYear,

    payrollMonth,

    db,
  });

  if (payrollRun) {
    return payrollRun;
  }

  payrollRun = await createPayrollRunRepo({
    data: {
      slug: randomUUID(),

      schoolSlug,

      payrollYear,

      payrollMonth,

      periodStart: startDate,

      periodEnd: endDate,

      status: "DRAFT",

      generatedBySlug: user?.slug || null,

      generatedAt: new Date(),
    },

    db,
  });

  return payrollRun;
};

const syncPayrollRunTotals = async ({ payrollRunSlug, db }) => {
  const payrolls = await getPayrollRunEmployeePayrollsRepo({
    payrollRunSlug,

    db,
  });

  const totalEmployees = payrolls.length;

  const totalEarnings = round2(
    payrolls.reduce(
      (total, payroll) => total + toNumber(payroll.grossEarnings),
      0,
    ),
  );

  const totalDeductions = round2(
    payrolls.reduce(
      (total, payroll) => total + toNumber(payroll.totalDeductions),
      0,
    ),
  );

  const totalNetSalary = round2(
    payrolls.reduce((total, payroll) => total + toNumber(payroll.netSalary), 0),
  );

  const allPaid = payrolls.length > 0 && payrolls.every((item) => item.isPaid);

  const allLocked =
    payrolls.length > 0 && payrolls.every((item) => item.isLocked);

  const status = allPaid
    ? "PAID"
    : allLocked
      ? "LOCKED"
      : payrolls.length
        ? "GENERATED"
        : "DRAFT";

  return updatePayrollRunRepo({
    payrollRunSlug,

    data: {
      totalEmployees,

      totalEarnings,

      totalDeductions,

      totalNetSalary,

      status,
    },

    db,
  });
};

const buildManualItems = (manualItems = []) => {
  return manualItems
    .filter((item) => toNumber(item.amount) > 0)
    .map((item, index) => ({
      componentType: item.componentType,

      source: "MANUAL",

      componentName: item.componentName,

      amount: round2(item.amount),

      displayOrder: 900 + index,

      isSystemGenerated: false,

      isEditable: true,

      remarks: item.remarks || null,
    }));
};

const calculateEmployeePayroll = async ({
  schoolSlug,
  employee,
  payrollYear,
  payrollMonth,
  startDate,
  endDate,
  salaryDays,
  claimedSalaryDays,
  manualItems = [],
  db,
}) => {
  const structureCalculation = calculateSalaryStructure({
    employee,

    periodEnd: endDate,
  });

  if (!structureCalculation) {
    throw new Error(`Salary structure not found for ${employee.fullName}`);
  }

  if (structureCalculation.structure.salaryGenerationStopped) {
    throw new Error(`Salary generation is stopped for ${employee.fullName}`);
  }

  const existingPayroll = employee.hrmEmployeePayrolls?.[0] || null;

  const [
    attendances,
    leaveRequests,
    overtimeRequests,
    advanceInstallments,
    loanInstallments,
    basicSettings,
    holidays,
  ] = await Promise.all([
    getEmployeeAttendanceForPayrollRepo({
      schoolSlug,

      employeeSlug: employee.slug,

      startDate,

      endDate,

      db,
    }),

    getEmployeeLeaveRequestsForPayrollRepo({
      schoolSlug,

      employeeSlug: employee.slug,

      startDate,

      endDate,

      db,
    }),

    getEmployeeOvertimeForPayrollRepo({
      schoolSlug,

      employeeSlug: employee.slug,

      startDate,

      endDate,

      payrollSlug: existingPayroll?.slug,

      db,
    }),

    getEmployeeAdvanceInstallmentsForPayrollRepo({
      schoolSlug,

      employeeSlug: employee.slug,

      startDate,

      endDate,

      payrollSlug: existingPayroll?.slug,

      db,
    }),

    getEmployeeLoanInstallmentsForPayrollRepo({
      schoolSlug,

      employeeSlug: employee.slug,

      startDate,

      endDate,

      payrollSlug: existingPayroll?.slug,

      db,
    }),

    getEmployeeBasicSettingsForPayrollRepo({
      schoolSlug,

      departmentSlug: employee.departmentSlug,

      db,
    }),

    getEmployeeHolidaysForPayrollRepo({
      schoolSlug,

      employeeSlug: employee.slug,

      departmentSlug: employee.departmentSlug,

      startDate,

      endDate,

      db,
    }),
  ]);

  const attendance = calculateAttendanceAndLeave({
    employee,

    startDate,

    endDate,

    salaryDays,

    grossSalary: structureCalculation.grossEarnings,

    attendances,

    leaveRequests,

    holidays,

    basicSettings,

    claimedSalaryDays,
  });

  const overtime = calculateOvertime({
    overtimeRequests,

    grossSalary: structureCalculation.grossEarnings,

    salaryDays,

    basicSettings,
  });

  const advanceDeduction = round2(
    advanceInstallments.reduce(
      (total, installment) =>
        total +
        Math.max(
          0,
          toNumber(installment.dueAmount) -
            toNumber(installment.recoveredAmount),
        ),
      0,
    ),
  );

  const loanDeduction = round2(
    loanInstallments.reduce(
      (total, installment) =>
        total +
        Math.max(
          0,
          toNumber(installment.installmentAmount) -
            toNumber(installment.recoveredAmount),
        ),
      0,
    ),
  );

  const salaryItems = structureCalculation.items.map((item, index) => ({
    salaryStructureItemSlug: item.sourceItem.slug,

    componentType: item.componentType,

    source: item.source,

    componentName: item.componentName,

    earningTypeSlug: item.sourceItem.earningTypeSlug || null,

    deductionTypeSlug: item.sourceItem.deductionTypeSlug || null,

    calculationType: item.sourceItem.calculationType,

    calculationBase: item.sourceItem.calculationBase,

    value: toNumber(item.sourceItem.value),

    amount: round2(item.amount),

    displayOrder: item.sourceItem.displayOrder ?? index,

    isSystemGenerated: true,

    isEditable: false,
  }));

  if (attendance.attendanceDeduction > 0) {
    salaryItems.push({
      componentType: "DEDUCTION",

      source: "ATTENDANCE",

      componentName: "ATTENDANCE DEDUCTION",

      amount: attendance.attendanceDeduction,

      displayOrder: 800,

      isSystemGenerated: true,

      isEditable: false,
    });
  }

  if (attendance.leaveDeduction > 0) {
    salaryItems.push({
      componentType: "DEDUCTION",

      source: "LEAVE",

      componentName: "UNPAID LEAVE",

      amount: attendance.leaveDeduction,

      displayOrder: 810,

      isSystemGenerated: true,

      isEditable: false,
    });
  }

  if (overtime.amount > 0) {
    salaryItems.push({
      componentType: "EARNING",

      source: "OVERTIME",

      componentName: "OVERTIME",

      amount: overtime.amount,

      displayOrder: 820,

      isSystemGenerated: true,

      isEditable: false,
    });
  }

  if (advanceDeduction > 0) {
    salaryItems.push({
      componentType: "DEDUCTION",

      source: "ADVANCE",

      componentName: "ADVANCE",

      amount: advanceDeduction,

      displayOrder: 830,

      isSystemGenerated: true,

      isEditable: false,
    });
  }

  if (loanDeduction > 0) {
    salaryItems.push({
      componentType: "DEDUCTION",

      source: "LOAN",

      componentName: "LOAN EMI",

      amount: loanDeduction,

      displayOrder: 840,

      isSystemGenerated: true,

      isEditable: false,
    });
  }

  const resolvedManualItems = buildManualItems(manualItems);

  salaryItems.push(...resolvedManualItems);

  const manualEarning = round2(
    resolvedManualItems
      .filter((item) => item.componentType === "EARNING")
      .reduce((total, item) => total + item.amount, 0),
  );

  const manualDeduction = round2(
    resolvedManualItems
      .filter((item) => item.componentType === "DEDUCTION")
      .reduce((total, item) => total + item.amount, 0),
  );

  const grossEarnings = round2(
    structureCalculation.grossEarnings + overtime.amount + manualEarning,
  );

  const totalDeductions = round2(
    structureCalculation.totalDeductions +
      attendance.attendanceDeduction +
      attendance.leaveDeduction +
      advanceDeduction +
      loanDeduction +
      manualDeduction,
  );

  const netSalary = round2(grossEarnings - totalDeductions);

  const approvedLeaves = leaveRequests.filter(
    (item) => item.requestStatus === "APPROVED",
  );

  const pendingLeaves = leaveRequests.filter(
    (item) => item.requestStatus === "PENDING",
  ).length;

  const declinedLeaves = leaveRequests.filter(
    (item) => item.requestStatus === "REJECTED",
  ).length;

  const advanceSlugs = [
    ...new Set(advanceInstallments.map((item) => item.advanceSlug)),
  ];

  const loanSlugs = [...new Set(loanInstallments.map((item) => item.loanSlug))];

  return {
    employee,

    existingPayroll,

    structureCalculation,

    attendance,

    overtime,

    approvedLeaves,

    leaveRequests,

    overtimeRequests,

    advanceInstallments,

    loanInstallments,

    salaryItems,

    salaryDays,

    salaryClaimedDays: attendance.claimedSalaryDays,

    attendanceDeduction: attendance.attendanceDeduction,

    leaveDeduction: attendance.leaveDeduction,

    advanceDeduction,

    loanDeduction,

    drfDeduction: structureCalculation.drfDeduction,

    manualEarning,

    manualDeduction,

    grossEarnings,

    totalDeductions,

    netSalary,

    overview: {
      attendance: {
        value: attendance.deductionDays,

        totalHolidays: attendance.holidayDays,

        totalDeductionDays: attendance.deductionDays,
      },

      leave: {
        value: round2(attendance.paidLeaveDays + attendance.unpaidLeaveDays),

        paidLeaveDays: attendance.paidLeaveDays,

        unpaidLeaveDays: attendance.unpaidLeaveDays,

        pendingLeaves,

        declinedLeaves,
      },

      overtime: {
        amount: overtime.amount,

        totalHours: overtime.totalHours,

        amountPerHour: overtime.ratePerHour,
      },

      advance: {
        amount: advanceDeduction,

        approvedRequests: advanceSlugs.length,

        requestAmount: round2(
          advanceInstallments.reduce(
            (total, item) => total + toNumber(item.advance?.requestedAmount),
            0,
          ),
        ),
      },

      loan: {
        amount: loanDeduction,

        approvedLoans: loanSlugs.length,

        totalAmount: round2(
          loanInstallments.reduce(
            (total, item) =>
              total + toNumber(item.loan?.totalRecoverableAmount),
            0,
          ),
        ),

        remainingAmount: round2(
          loanInstallments.reduce(
            (total, item) => total + toNumber(item.loan?.outstandingAmount),
            0,
          ),
        ),
      },

      salaryClaim: {
        days: attendance.claimedSalaryDays,
      },
    },
  };
};

const formatCalculatedPayroll = (calculation) => {
  const employee = calculation.employee;

  const existingPayroll = calculation.existingPayroll;

  return {
    payrollSlug: existingPayroll?.slug || null,

    employeeSlug: employee.slug,

    employeeId: employee.employeeId,

    employeeCode: employee.employeeCode,

    employeeName: employee.fullName,

    department: {
      slug: employee.department?.slug || null,

      name:
        employee.department?.departmentName || employee.department?.name || "-",
    },

    designation: {
      slug: employee.designation?.slug || null,

      name:
        employee.designation?.designationName ||
        employee.designation?.name ||
        "-",
    },

    salary: calculation.netSalary,

    grossEarnings: calculation.grossEarnings,

    totalDeductions: calculation.totalDeductions,

    saved: Boolean(existingPayroll?.isSaved),

    locked: Boolean(existingPayroll?.isLocked),

    paid: Boolean(existingPayroll?.isPaid),

    status: existingPayroll?.status || "DRAFT",

    salaryDays: calculation.salaryDays,

    salaryClaimedDays: calculation.salaryClaimedDays,

    overview: calculation.overview,

    earnings: calculation.salaryItems.filter(
      (item) => item.componentType === "EARNING",
    ),

    deductions: calculation.salaryItems.filter(
      (item) => item.componentType === "DEDUCTION",
    ),

    attendance: calculation.attendance,
  };
};

export const getEmployeePayrollsService = async ({
  schoolSlug,
  query = {},
}) => {
  const { payrollYear, payrollMonth, startDate, endDate, salaryDays } =
    getPayrollPeriod({
      year: query.year,

      month: query.month,
    });

  if (!payrollYear || !payrollMonth || payrollMonth < 1 || payrollMonth > 12) {
    throw new Error("Valid year and month are required");
  }

  const employees = await getPayrollEmployeesRepo({
    schoolSlug,

    periodEnd: endDate,

    departmentSlug: query.departmentSlug,

    designationSlug: query.designationSlug,

    employeeSlug: query.employeeSlug,

    payrollYear,

    payrollMonth,
  });

  const rows = [];

  for (const employee of employees) {
    if (!employee.hrmEmployeeSalaryStructure) {
      rows.push({
        employeeSlug: employee.slug,

        employeeId: employee.employeeId,

        employeeCode: employee.employeeCode,

        employeeName: employee.fullName,

        department: {
          slug: employee.department?.slug || null,

          name:
            employee.department?.departmentName ||
            employee.department?.name ||
            "-",
        },

        designation: {
          slug: employee.designation?.slug || null,

          name:
            employee.designation?.designationName ||
            employee.designation?.name ||
            "-",
        },

        salary: 0,

        saved: false,

        locked: false,

        paid: false,

        salaryStructureMissing: true,
      });

      continue;
    }

    const calculation = await calculateEmployeePayroll({
      schoolSlug,

      employee,

      payrollYear,

      payrollMonth,

      startDate,

      endDate,

      salaryDays,
    });

    rows.push(formatCalculatedPayroll(calculation));
  }

  return {
    payrollYear,

    payrollMonth,

    periodStart: startDate,

    periodEnd: endDate,

    employees: rows,
  };
};

export const getEmployeePayrollDetailService = async ({
  schoolSlug,
  employeeSlug,
  query = {},
}) => {
  const { payrollYear, payrollMonth, startDate, endDate, salaryDays } =
    getPayrollPeriod({
      year: query.year,

      month: query.month,
    });

  const employee = await findPayrollEmployeeSourceRepo({
    schoolSlug,

    employeeSlug,

    periodEnd: endDate,

    payrollYear,

    payrollMonth,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const calculation = await calculateEmployeePayroll({
    schoolSlug,

    employee,

    payrollYear,

    payrollMonth,

    startDate,

    endDate,

    salaryDays,

    claimedSalaryDays: query.claimedSalaryDays,
  });

  return formatCalculatedPayroll(calculation);
};

export const saveEmployeePayrollsService = async ({
  schoolSlug,
  payload,
  user,
  metadata,
}) => {
  const { payrollYear, payrollMonth, startDate, endDate, salaryDays } =
    getPayrollPeriod({
      year: payload.year,

      month: payload.month,
    });

  return runEmployeePayrollTransactionRepo(async (tx) => {
    const payrollRun = await getOrCreatePayrollRun({
      schoolSlug,

      payrollYear,

      payrollMonth,

      startDate,

      endDate,

      user,

      db: tx,
    });

    const savedPayrolls = [];

    for (const row of payload.employees) {
      const employee = await findPayrollEmployeeSourceRepo({
        schoolSlug,

        employeeSlug: row.employeeSlug,

        periodEnd: endDate,

        payrollYear,

        payrollMonth,

        db: tx,
      });

      if (!employee) {
        throw new Error("Employee not found");
      }

      const currentPayroll = employee.hrmEmployeePayrolls?.[0] || null;

      if (currentPayroll?.isLocked) {
        throw new Error(`${employee.fullName} salary is locked`);
      }

      const calculation = await calculateEmployeePayroll({
        schoolSlug,

        employee,

        payrollYear,

        payrollMonth,

        startDate,

        endDate,

        salaryDays,

        claimedSalaryDays: row.claimedSalaryDays,

        manualItems: row.manualItems || [],

        db: tx,
      });

      if (calculation.attendance.notMarkedDays > 0) {
        throw new Error(
          `${employee.fullName} has ${calculation.attendance.notMarkedDays} unresolved attendance day(s)`,
        );
      }

      if (currentPayroll) {
        await unlinkPayrollSourcesRepo({
          payrollSlug: currentPayroll.slug,

          db: tx,
        });
      }

      const bankDetail = employee.bankDetail;

      const payrollData = {
        schoolSlug,

        payrollRunSlug: payrollRun.slug,

        employeeSlug: employee.slug,

        employeeSalaryStructureSlug:
          calculation.structureCalculation.structure.slug,

        payrollYear,

        payrollMonth,

        periodStart: startDate,

        periodEnd: endDate,

        employeeNameSnapshot: employee.fullName,

        employeeIdSnapshot: employee.employeeId,

        employeeCodeSnapshot: employee.employeeCode,

        departmentSlugSnapshot: employee.departmentSlug,

        departmentNameSnapshot:
          employee.department?.departmentName ||
          employee.department?.name ||
          null,

        designationSlugSnapshot: employee.designationSlug,

        designationNameSnapshot:
          employee.designation?.designationName ||
          employee.designation?.name ||
          null,

        natureOfAppointmentSnapshot: employee.natureOfAppointment,

        joiningDateSnapshot: employee.joiningDate,

        payBandSlugSnapshot: employee.payBandSlug,

        payBandNameSnapshot: employee.payBand?.payBandName || null,

        bankNameSnapshot: bankDetail?.bankName || null,

        bankAccountNumberSnapshot: bankDetail?.bankAccountNumber || null,

        ifscCodeSnapshot: bankDetail?.ifscCode || null,

        panNumberSnapshot: bankDetail?.panNumber || null,

        uanNumberSnapshot: bankDetail?.uanNumber || null,

        basicSalarySnapshot: calculation.structureCalculation.basicSalary,

        structureGrossEarningsSnapshot:
          calculation.structureCalculation.grossEarnings,

        structureTotalDeductionsSnapshot:
          calculation.structureCalculation.totalDeductions,

        structureNetSalarySnapshot: calculation.structureCalculation.netSalary,

        salaryDays: calculation.salaryDays,

        salaryClaimedDays: calculation.salaryClaimedDays,

        attendanceDeduction: calculation.attendanceDeduction,

        leaveDeduction: calculation.leaveDeduction,

        overtimeSalaryBasis: calculation.overtime.salaryBasis,

        overtimeSalaryPerDay: calculation.overtime.salaryPerDay,

        overtimeHoursPerDay: calculation.overtime.hoursPerDay,

        overtimeRatePerHour: calculation.overtime.ratePerHour,

        overtimeHours: calculation.overtime.totalHours,

        overtimeEarning: calculation.overtime.amount,

        advanceDeduction: calculation.advanceDeduction,

        loanDeduction: calculation.loanDeduction,

        drfDeduction: calculation.drfDeduction,

        manualEarning: calculation.manualEarning,

        manualDeduction: calculation.manualDeduction,

        grossEarnings: calculation.grossEarnings,

        totalDeductions: calculation.totalDeductions,

        netSalary: calculation.netSalary,

        status: "SAVED",

        isSaved: true,

        savedBySlug: user?.slug || null,

        savedAt: new Date(),
      };

      let payroll;

      if (currentPayroll) {
        payroll = await updateEmployeePayrollRepo({
          payrollSlug: currentPayroll.slug,

          data: payrollData,

          db: tx,
        });
      } else {
        payroll = await createEmployeePayrollRepo({
          data: {
            slug: randomUUID(),

            ...payrollData,
          },

          db: tx,
        });
      }

      await deleteEmployeePayrollItemsRepo({
        employeePayrollSlug: payroll.slug,

        db: tx,
      });

      await createEmployeePayrollItemsRepo({
        data: calculation.salaryItems.map((item, index) => ({
          slug: randomUUID(),

          schoolSlug,

          employeePayrollSlug: payroll.slug,

          salaryStructureItemSlug: item.salaryStructureItemSlug || null,

          componentType: item.componentType,

          source: item.source,

          componentName: item.componentName,

          earningTypeSlug: item.earningTypeSlug || null,

          deductionTypeSlug: item.deductionTypeSlug || null,

          calculationType: item.calculationType || null,

          calculationBase: item.calculationBase || null,

          value: item.value ?? null,

          amount: item.amount,

          displayOrder: item.displayOrder ?? index,

          isSystemGenerated: item.isSystemGenerated ?? true,

          isEditable: item.isEditable ?? false,

          remarks: item.remarks || null,
        })),

        db: tx,
      });

      const attendanceData = {
        schoolSlug,

        employeePayrollSlug: payroll.slug,

        calendarDays: calculation.attendance.calendarDays,

        workingDays: calculation.attendance.workingDays,

        presentDays: calculation.attendance.presentDays,

        absentDays: calculation.attendance.absentDays,

        holidayDays: calculation.attendance.holidayDays,

        sundayDays: calculation.attendance.sundayDays,

        fullLeaveDays: calculation.attendance.fullLeaveDays,

        halfLeaveDays: calculation.attendance.halfLeaveDays,

        paidLeaveDays: calculation.attendance.paidLeaveDays,

        unpaidLeaveDays: calculation.attendance.unpaidLeaveDays,

        notMarkedDays: calculation.attendance.notMarkedDays,

        deductionDays: calculation.attendance.deductionDays,

        calculatedSalaryDays: calculation.attendance.calculatedSalaryDays,

        claimedSalaryDays: calculation.attendance.claimedSalaryDays,

        salaryPerDay: calculation.attendance.salaryPerDay,

        deductionAmount:
          calculation.attendanceDeduction + calculation.leaveDeduction,

        salaryDaysManuallyChanged:
          calculation.attendance.salaryDaysManuallyChanged,

        changedBySlug: calculation.attendance.salaryDaysManuallyChanged
          ? user?.slug || null
          : null,

        changedAt: calculation.attendance.salaryDaysManuallyChanged
          ? new Date()
          : null,

        changeRemark: row.salaryDaysRemark || null,
      };

      await upsertEmployeePayrollAttendanceRepo({
        employeePayrollSlug: payroll.slug,

        createData: {
          slug: randomUUID(),

          ...attendanceData,
        },

        updateData: attendanceData,

        db: tx,
      });

      await deleteEmployeePayrollLeavesRepo({
        employeePayrollSlug: payroll.slug,

        db: tx,
      });

      const payrollLeaves = calculation.approvedLeaves.map((leave) => {
        const isUnpaid = leave.payType === "UNPAID";

        const days =
          leave.leaveCategory === "HALF_DAY" ? 0.5 : toNumber(leave.totalDays);

        return {
          slug: randomUUID(),

          schoolSlug,

          employeePayrollSlug: payroll.slug,

          leaveRequestSlug: leave.slug,

          leaveTypeSlug: leave.leaveTypeSlug,

          leaveTypeNameSnapshot: leave.leaveType?.leaveType || "Leave",

          leaveCategory: leave.leaveCategory,

          payType: leave.payType || "PAID",

          fromDate: leave.fromDate,

          toDate: leave.toDate,

          totalDays: toNumber(leave.totalDays),

          numberOfDaysPaid: toNumber(leave.numberOfDaysPaid),

          deductionDays: isUnpaid ? days : 0,

          salaryPerDay: calculation.attendance.salaryPerDay,

          deductionAmount: isUnpaid
            ? round2(days * calculation.attendance.salaryPerDay)
            : 0,
        };
      });

      await createEmployeePayrollLeavesRepo({
        data: payrollLeaves,

        db: tx,
      });

      await linkPayrollSourcesRepo({
        payrollSlug: payroll.slug,

        overtimeSlugs: calculation.overtimeRequests.map((item) => item.slug),

        advanceInstallmentSlugs: calculation.advanceInstallments.map(
          (item) => item.slug,
        ),

        loanInstallmentSlugs: calculation.loanInstallments.map(
          (item) => item.slug,
        ),

        db: tx,
      });

      await createEmployeePayrollLogRepo({
        data: buildPayrollLogData({
          schoolSlug,

          payrollRunSlug: payrollRun.slug,

          employeePayrollSlug: payroll.slug,

          employeeSlug: employee.slug,

          action: currentPayroll ? "SALARY_RECALCULATED" : "SALARY_SAVED",

          previousData: currentPayroll
            ? {
                netSalary: currentPayroll.netSalary,

                salaryClaimedDays: currentPayroll.salaryClaimedDays,
              }
            : null,

          newData: {
            grossEarnings: calculation.grossEarnings,

            totalDeductions: calculation.totalDeductions,

            netSalary: calculation.netSalary,

            salaryClaimedDays: calculation.salaryClaimedDays,
          },

          user,

          metadata,

          remarks: row.salaryDaysRemark,
        }),

        db: tx,
      });

      savedPayrolls.push(payroll.slug);
    }

    await syncPayrollRunTotals({
      payrollRunSlug: payrollRun.slug,

      db: tx,
    });

    return {
      payrollRunSlug: payrollRun.slug,

      savedCount: savedPayrolls.length,

      payrollSlugs: savedPayrolls,
    };
  });
};

export const lockEmployeePayrollsService = async ({
  schoolSlug,
  payload,
  user,
  metadata,
}) => {
  return runEmployeePayrollTransactionRepo(async (tx) => {
    const locked = [];

    for (const payrollSlug of payload.payrollSlugs) {
      const payroll = await findEmployeePayrollBySlugRepo({
        schoolSlug,

        payrollSlug,

        db: tx,
      });

      if (!payroll) {
        throw new Error("Salary record not found");
      }

      if (!payroll.isSaved) {
        throw new Error(
          `${payroll.employeeNameSnapshot} salary must be saved before locking`,
        );
      }

      if (payroll.isLocked) {
        continue;
      }

      await updateEmployeePayrollRepo({
        payrollSlug,

        data: {
          isLocked: true,

          lockedBySlug: user?.slug || null,

          lockedAt: new Date(),

          status: "LOCKED",
        },

        db: tx,
      });

      await createEmployeePayrollLogRepo({
        data: buildPayrollLogData({
          schoolSlug,

          payrollRunSlug: payroll.payrollRunSlug,

          employeePayrollSlug: payroll.slug,

          employeeSlug: payroll.employeeSlug,

          action: "SALARY_LOCKED",

          newData: {
            isLocked: true,
          },

          user,

          metadata,
        }),

        db: tx,
      });

      locked.push(payroll.slug);

      await syncPayrollRunTotals({
        payrollRunSlug: payroll.payrollRunSlug,

        db: tx,
      });
    }

    return {
      lockedCount: locked.length,

      payrollSlugs: locked,
    };
  });
};

export const unlockEmployeePayrollsService = async ({
  schoolSlug,
  payload,
  user,
  metadata,
}) => {
  return runEmployeePayrollTransactionRepo(async (tx) => {
    const unlocked = [];

    for (const payrollSlug of payload.payrollSlugs) {
      const payroll = await findEmployeePayrollBySlugRepo({
        schoolSlug,

        payrollSlug,

        db: tx,
      });

      if (!payroll) {
        throw new Error("Salary record not found");
      }

      if (payroll.isPaid) {
        throw new Error(
          `${payroll.employeeNameSnapshot} salary is already paid and cannot be unlocked`,
        );
      }

      if (!payroll.isLocked) {
        continue;
      }

      await updateEmployeePayrollRepo({
        payrollSlug,

        data: {
          isLocked: false,

          lockedBySlug: null,

          lockedAt: null,

          status: "SAVED",
        },

        db: tx,
      });

      await createEmployeePayrollLogRepo({
        data: buildPayrollLogData({
          schoolSlug,

          payrollRunSlug: payroll.payrollRunSlug,

          employeePayrollSlug: payroll.slug,

          employeeSlug: payroll.employeeSlug,

          action: "SALARY_UNLOCKED",

          user,

          metadata,
        }),

        db: tx,
      });

      unlocked.push(payroll.slug);

      await syncPayrollRunTotals({
        payrollRunSlug: payroll.payrollRunSlug,

        db: tx,
      });
    }

    return {
      unlockedCount: unlocked.length,

      payrollSlugs: unlocked,
    };
  });
};

export const markEmployeePayrollsPaidService = async ({
  schoolSlug,
  payload,
  user,
  metadata,
}) => {
  return runEmployeePayrollTransactionRepo(async (tx) => {
    const paid = [];

    for (const payrollSlug of payload.payrollSlugs) {
      const payroll = await findEmployeePayrollBySlugRepo({
        schoolSlug,

        payrollSlug,

        db: tx,
      });

      if (!payroll) {
        throw new Error("Salary record not found");
      }

      if (!payroll.isLocked) {
        throw new Error(
          `${payroll.employeeNameSnapshot} salary must be locked before payment`,
        );
      }

      if (payroll.isPaid) {
        continue;
      }

      await recoverPayrollAdvanceInstallmentsRepo({
        payrollSlug,

        db: tx,
      });

      await recoverPayrollLoanInstallmentsRepo({
        payrollSlug,

        db: tx,
      });

      await updateEmployeePayrollRepo({
        payrollSlug,

        data: {
          isPaid: true,

          paidAt: new Date(),

          status: "PAID",
        },

        db: tx,
      });

      await createEmployeePayrollLogRepo({
        data: buildPayrollLogData({
          schoolSlug,

          payrollRunSlug: payroll.payrollRunSlug,

          employeePayrollSlug: payroll.slug,

          employeeSlug: payroll.employeeSlug,

          action: "SALARY_PAID",

          newData: {
            netSalary: payroll.netSalary,
          },

          user,

          metadata,
        }),

        db: tx,
      });

      paid.push(payroll.slug);

      await syncPayrollRunTotals({
        payrollRunSlug: payroll.payrollRunSlug,

        db: tx,
      });
    }

    return {
      paidCount: paid.length,

      payrollSlugs: paid,
    };
  });
};

export const getPayrollLogsService = async ({ schoolSlug, payrollSlug }) => {
  return getEmployeePayrollLogsRepo({
    schoolSlug,

    payrollSlug,
  });
};

export const getSalaryStatementService = async ({ schoolSlug, query }) => {
  const { payrollYear, payrollMonth } = getPayrollPeriod({
    year: query.year,

    month: query.month,
  });

  const rows = await getSalaryStatementRepo({
    schoolSlug,

    payrollYear,

    payrollMonth,

    departmentSlug: query.departmentSlug,

    designationSlug: query.designationSlug,
  });

  return {
    payrollYear,

    payrollMonth,

    employees: rows,

    totals: {
      grossEarnings: round2(
        rows.reduce((total, row) => total + toNumber(row.grossEarnings), 0),
      ),

      totalDeductions: round2(
        rows.reduce((total, row) => total + toNumber(row.totalDeductions), 0),
      ),

      netSalary: round2(
        rows.reduce((total, row) => total + toNumber(row.netSalary), 0),
      ),
    },
  };
};

export const getBankStatementService = async ({ schoolSlug, query }) => {
  const { payrollYear, payrollMonth } = getPayrollPeriod({
    year: query.year,

    month: query.month,
  });

  const rows = await getBankStatementRepo({
    schoolSlug,

    payrollYear,

    payrollMonth,
  });

  return {
    payrollYear,

    payrollMonth,

    employees: rows.map((row) => ({
      payrollSlug: row.slug,

      employeeName: row.employeeNameSnapshot,

      employeeId: row.employeeIdSnapshot,

      bankName: row.bankNameSnapshot,

      accountNumber: row.bankAccountNumberSnapshot,

      ifscCode: row.ifscCodeSnapshot,

      netSalary: row.netSalary,

      locked: row.isLocked,

      paid: row.isPaid,
    })),

    totalAmount: round2(
      rows.reduce((total, row) => total + toNumber(row.netSalary), 0),
    ),
  };
};
