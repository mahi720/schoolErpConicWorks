const round2 = (value) => {
    return Number(Number(value || 0).toFixed(2));
};

const round4 = (value) => {
    return Number(Number(value || 0).toFixed(4));
};

export const toNumber = (value) => {
    const number = Number(value || 0);

    return Number.isFinite(number) ? number : 0;
};

export const toDateKey = (value) => {
    if (!value) {
        return null;
    }

    return new Date(value).toISOString().slice(0, 10);
};

export const getPayrollPeriod = ({ year, month }) => {
    const payrollYear = Number(year);

    const payrollMonth = Number(month);

    const startDate = new Date(Date.UTC(payrollYear, payrollMonth - 1, 1));

    const endDate = new Date(Date.UTC(payrollYear, payrollMonth, 0));

    return {
        payrollYear,
        payrollMonth,

        startDate,

        endDate,

        salaryDays: endDate.getUTCDate(),
    };
};

export const getInclusiveDates = (startDate, endDate) => {
    const dates = [];

    const current = new Date(
        Date.UTC(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth(),
            startDate.getUTCDate(),
        ),
    );

    const end = new Date(
        Date.UTC(
            endDate.getUTCFullYear(),
            endDate.getUTCMonth(),
            endDate.getUTCDate(),
        ),
    );

    while (current <= end) {
        dates.push(new Date(current));

        current.setUTCDate(current.getUTCDate() + 1);
    }

    return dates;
};

const getSaturdayOccurrence = (date) => {
    return Math.ceil(date.getUTCDate() / 7);
};

const getBasicWeekDay = (date) => {
    const map = {
        0: "SUNDAY",
        1: "MONDAY",
        2: "TUESDAY",
        3: "WEDNESDAY",
        4: "THURSDAY",
        5: "FRIDAY",
        6: "SATURDAY",
    };

    return map[date.getUTCDay()];
};

export const resolveBasicSettingForDate = ({ date, basicSettings }) => {
    const day = getBasicWeekDay(date);

    if (day !== "SATURDAY") {
        return basicSettings.find((item) => item.weekDay === day) || null;
    }

    const occurrence = getSaturdayOccurrence(date);

    if (occurrence === 2) {
        const special = basicSettings.find(
            (item) => item.weekDay === "SECOND_SATURDAY",
        );

        if (special) {
            return special;
        }
    }

    if (occurrence === 4) {
        const special = basicSettings.find(
            (item) => item.weekDay === "FOURTH_SATURDAY",
        );

        if (special) {
            return special;
        }
    }

    return basicSettings.find((item) => item.weekDay === "SATURDAY") || null;
};

const getTimeMinutes = (value) => {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    return date.getUTCHours() * 60 + date.getUTCMinutes();
};

export const getShiftHours = (shift) => {
    if (!shift) {
        return 0;
    }

    const loginMinutes = getTimeMinutes(shift.loginTime);

    let logoutMinutes = getTimeMinutes(shift.logoutTime);

    if (loginMinutes === null || logoutMinutes === null) {
        return 0;
    }

    if (logoutMinutes <= loginMinutes) {
        logoutMinutes += 24 * 60;
    }

    return round4((logoutMinutes - loginMinutes) / 60);
};

const getComponentName = (item) => {
    return (
        item.componentName ||
        item.earningType?.earningType ||
        item.deductionType?.deductionType ||
        "Salary Component"
    );
};

const isBasicPayItem = (item) => {
    if (item.componentType !== "EARNING") {
        return false;
    }

    const name = getComponentName(item).trim().toUpperCase();

    return name === "BASIC" || name === "BASIC PAY" || name === "BASIC SALARY";
};

const isDrfItem = (item) => {
    if (item.componentType !== "DEDUCTION") {
        return false;
    }

    const name = getComponentName(item).trim().toUpperCase();

    return name === "DRF" || name.includes("DRF");
};

export const resolvePayrollBasicSalary = ({ structure, periodEnd }) => {
    const increments = structure?.hrmEmployeeSalaryIncrements || [];

    if (!increments.length) {
        return toNumber(structure?.basicSalary);
    }

    const sorted = [...increments].sort((a, b) => {
        const dateA = new Date(a.effectiveFrom || a.createdAt).getTime();

        const dateB = new Date(b.effectiveFrom || b.createdAt).getTime();

        return dateA - dateB;
    });

    const applicable = sorted.filter(
        (item) => new Date(item.effectiveFrom || item.createdAt) <= periodEnd,
    );

    if (applicable.length) {
        return toNumber(applicable[applicable.length - 1].newBasicSalary);
    }

    return toNumber(sorted[0].previousBasicSalary);
};

export const calculateSalaryStructure = ({ employee, periodEnd }) => {
    const structure = employee.hrmEmployeeSalaryStructure;

    if (!structure) {
        return null;
    }

    const basicSalary = resolvePayrollBasicSalary({
        structure,

        periodEnd,
    });

    const sourceItems = structure.items.filter((item) => item.isActive !== false);

    const resultItems = [];

    let grossBeforeGrossBased = 0;

    const grossBasedEarnings = [];

    for (const item of sourceItems) {
        if (item.componentType !== "EARNING") {
            continue;
        }

        let amount = 0;

        if (isBasicPayItem(item)) {
            amount = basicSalary;
        } else if (item.calculationType === "FIXED") {
            amount = toNumber(item.amount);
        } else if (item.calculationBase === "BASIC_PAY") {
            amount = basicSalary * (toNumber(item.value) / 100);
        } else if (item.calculationBase === "GROSS_EARNING") {
            grossBasedEarnings.push(item);

            continue;
        } else {
            amount = toNumber(item.amount);
        }

        amount = round2(amount);

        grossBeforeGrossBased += amount;

        resultItems.push({
            sourceItem: item,

            componentType: "EARNING",

            source: "SALARY_STRUCTURE",

            componentName: getComponentName(item),

            amount,
        });
    }

    for (const item of grossBasedEarnings) {
        const amount = round2(grossBeforeGrossBased * (toNumber(item.value) / 100));

        resultItems.push({
            sourceItem: item,

            componentType: "EARNING",

            source: "SALARY_STRUCTURE",

            componentName: getComponentName(item),

            amount,
        });
    }

    const grossEarnings = round2(
        resultItems
            .filter((item) => item.componentType === "EARNING")
            .reduce((total, item) => total + item.amount, 0),
    );

    for (const item of sourceItems) {
        if (item.componentType !== "DEDUCTION") {
            continue;
        }

        if (isDrfItem(item) && !employee.isDrfApplicable) {
            continue;
        }

        let amount = 0;

        if (item.calculationType === "FIXED") {
            amount = toNumber(item.amount);
        } else if (item.calculationBase === "BASIC_PAY") {
            amount = basicSalary * (toNumber(item.value) / 100);
        } else if (item.calculationBase === "GROSS_EARNING") {
            amount = grossEarnings * (toNumber(item.value) / 100);
        } else {
            amount = toNumber(item.amount);
        }

        resultItems.push({
            sourceItem: item,

            componentType: "DEDUCTION",

            source: isDrfItem(item) ? "DRF" : "SALARY_STRUCTURE",

            componentName: getComponentName(item),

            amount: round2(amount),
        });
    }

    const totalDeductions = round2(
        resultItems
            .filter((item) => item.componentType === "DEDUCTION")
            .reduce((total, item) => total + item.amount, 0),
    );

    const drfDeduction = round2(
        resultItems
            .filter((item) => item.source === "DRF")
            .reduce((total, item) => total + item.amount, 0),
    );

    return {
        structure,

        basicSalary,

        grossEarnings,

        totalDeductions,

        netSalary: round2(grossEarnings - totalDeductions),

        drfDeduction,

        items: resultItems,
    };
};

const getLeaveDayValue = (leave) => {
    return leave.leaveCategory === "HALF_DAY" ? 0.5 : 1;
};

export const calculateAttendanceAndLeave = ({
    employee,
    startDate,
    endDate,
    salaryDays,
    grossSalary,
    attendances,
    leaveRequests,
    holidays,
    basicSettings,
    claimedSalaryDays,
}) => {
    const attendanceMap = new Map(
        attendances.map((item) => [toDateKey(item.attendanceDate), item]),
    );

    const holidaySet = new Set(
        holidays.map((item) => toDateKey(item.holidayDate)),
    );

    const approvedLeaves = leaveRequests.filter(
        (item) => item.requestStatus === "APPROVED",
    );

    const leaveMap = new Map();

    for (const leave of approvedLeaves) {
        const leaveStart = new Date(leave.fromDate);

        const leaveEnd = new Date(
            leave.leaveCategory === "MULTI_DAY" && leave.toDate
                ? leave.toDate
                : leave.fromDate,
        );

        for (const date of getInclusiveDates(
            leaveStart < startDate ? startDate : leaveStart,

            leaveEnd > endDate ? endDate : leaveEnd,
        )) {
            leaveMap.set(
                toDateKey(date),

                leave,
            );
        }
    }

    const joiningDate = new Date(employee.joiningDate);

    const eligibleStart =
        joiningDate > startDate
            ? new Date(
                Date.UTC(
                    joiningDate.getUTCFullYear(),
                    joiningDate.getUTCMonth(),
                    joiningDate.getUTCDate(),
                ),
            )
            : startDate;

    const eligibleDates = getInclusiveDates(eligibleStart, endDate);

    let workingDays = 0;

    let presentDays = 0;

    let absentDays = 0;

    let holidayDays = 0;

    let sundayDays = 0;

    let fullLeaveDays = 0;

    let halfLeaveDays = 0;

    let paidLeaveDays = 0;

    let unpaidLeaveDays = 0;

    let notMarkedDays = 0;

    const leaveDetails = [];

    const leaveSeen = new Set();

    for (const date of eligibleDates) {
        const dateKey = toDateKey(date);

        const isSunday = date.getUTCDay() === 0;

        const basicSetting = resolveBasicSettingForDate({
            date,

            basicSettings,
        });

        const isHoliday =
            isSunday ||
            holidaySet.has(dateKey) ||
            basicSetting?.dayType === "HOLIDAY";

        if (isHoliday) {
            holidayDays += 1;

            if (isSunday) {
                sundayDays += 1;
            }

            continue;
        }

        workingDays += 1;

        const approvedLeave = leaveMap.get(dateKey);

        if (approvedLeave) {
            const dayValue = getLeaveDayValue(approvedLeave);

            if (approvedLeave.leaveCategory === "HALF_DAY") {
                halfLeaveDays += 0.5;

                presentDays += 0.5;
            } else {
                fullLeaveDays += 1;
            }

            if (approvedLeave.payType === "UNPAID") {
                unpaidLeaveDays += dayValue;
            } else {
                paidLeaveDays += dayValue;
            }

            if (!leaveSeen.has(approvedLeave.slug)) {
                leaveSeen.add(approvedLeave.slug);

                leaveDetails.push(approvedLeave);
            }

            continue;
        }

        const attendance = attendanceMap.get(dateKey);

        if (!attendance) {
            notMarkedDays += 1;

            continue;
        }

        switch (attendance.attendanceStatus) {
            case "PRESENT":
                presentDays += 1;
                break;

            case "ABSENT":
                absentDays += 1;
                break;

            case "HALF_DAY":
                presentDays += 0.5;

                absentDays += 0.5;

                break;

            case "HOLIDAY":
                holidayDays += 1;
                break;

            case "LEAVE": {
                const leave = attendance.leaveRequest;

                const value = leave?.leaveCategory === "HALF_DAY" ? 0.5 : 1;

                if (leave?.payType === "UNPAID") {
                    unpaidLeaveDays += value;
                } else {
                    paidLeaveDays += value;
                }

                break;
            }

            default:
                notMarkedDays += 1;
                break;
        }
    }

    const salaryPerDay = round4(toNumber(grossSalary) / Math.max(1, salaryDays));

    const autoClaimedDays = round2(
        eligibleDates.length - absentDays - unpaidLeaveDays,
    );

    const finalClaimedDays =
        claimedSalaryDays === undefined || claimedSalaryDays === null
            ? autoClaimedDays
            : Math.min(salaryDays, Math.max(0, toNumber(claimedSalaryDays)));

    const totalDeductionDays = round2(salaryDays - finalClaimedDays);

    const leaveDeduction = round2(unpaidLeaveDays * salaryPerDay);

    const attendanceDeductionDays = Math.max(
        0,
        totalDeductionDays - unpaidLeaveDays,
    );

    const attendanceDeduction = round2(attendanceDeductionDays * salaryPerDay);

    return {
        calendarDays: salaryDays,

        workingDays,

        presentDays: round2(presentDays),

        absentDays: round2(absentDays),

        holidayDays: round2(holidayDays),

        sundayDays: round2(sundayDays),

        fullLeaveDays: round2(fullLeaveDays),

        halfLeaveDays: round2(halfLeaveDays),

        paidLeaveDays: round2(paidLeaveDays),

        unpaidLeaveDays: round2(unpaidLeaveDays),

        notMarkedDays: round2(notMarkedDays),

        deductionDays: totalDeductionDays,

        calculatedSalaryDays: autoClaimedDays,

        claimedSalaryDays: round2(finalClaimedDays),

        salaryPerDay,

        attendanceDeduction,

        leaveDeduction,

        leaveDetails,

        salaryDaysManuallyChanged:
            claimedSalaryDays !== undefined &&
            claimedSalaryDays !== null &&
            Number(claimedSalaryDays) !== Number(autoClaimedDays),
    };
};

export const calculateOvertime = ({
    overtimeRequests,
    grossSalary,
    salaryDays,
    basicSettings,
}) => {
    const salaryPerDay = round4(toNumber(grossSalary) / Math.max(1, salaryDays));

    let totalHours = 0;

    let totalAmount = 0;

    let totalShiftHours = 0;

    let shiftCount = 0;

    for (const request of overtimeRequests) {
        const date = new Date(request.overtimeDate);

        const setting = resolveBasicSettingForDate({
            date,

            basicSettings,
        });

        const hoursPerDay = getShiftHours(setting?.shift);

        if (hoursPerDay <= 0) {
            continue;
        }

        const overtimeHours = toNumber(request.hoursSpent);

        const ratePerHour = salaryPerDay / hoursPerDay;

        totalHours += overtimeHours;

        totalAmount += overtimeHours * ratePerHour;

        totalShiftHours += hoursPerDay;

        shiftCount += 1;
    }

    const averageHoursPerDay = shiftCount ? totalShiftHours / shiftCount : 0;

    return {
        salaryBasis: round2(grossSalary),

        salaryPerDay,

        hoursPerDay: round4(averageHoursPerDay),

        ratePerHour: totalHours > 0 ? round4(totalAmount / totalHours) : 0,

        totalHours: round2(totalHours),

        amount: round2(totalAmount),
    };
};
