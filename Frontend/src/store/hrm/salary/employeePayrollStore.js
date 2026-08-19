import { create } from "zustand";

import toast from "react-hot-toast";

import { employeePayrollApi } from "../../../api/hrm/salary/employeePayrollApi";

const initialSummary = {
    totalEmployees: 0,

    totalGrossEarnings: 0,

    totalDeductions: 0,

    totalNetSalary: 0,

    savedCount: 0,

    lockedCount: 0,

    paidCount: 0,
};

export const useEmployeePayrollStore = create((set, get) => ({
    payrollData: null,

    employees: [],

    selectedPayroll: null,

    salaryStatement: null,

    bankStatement: null,

    logs: [],

    summary: {
        ...initialSummary,
    },

    loading: false,

    detailLoading: false,

    submitLoading: false,

    lockLoading: false,

    unlockLoading: false,

    paidLoading: false,

    statementLoading: false,

    bankStatementLoading: false,

    logsLoading: false,

    fetchPayrollEmployees: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const response = await employeePayrollApi.getEmployees(params);

            const data = response.data || null;

            const employees = data?.employees || [];

            const summary = {
                totalEmployees: employees.length,

                totalGrossEarnings: employees.reduce(
                    (total, item) => total + Number(item.grossEarnings || 0),
                    0,
                ),

                totalDeductions: employees.reduce(
                    (total, item) => total + Number(item.totalDeductions || 0),
                    0,
                ),

                totalNetSalary: employees.reduce(
                    (total, item) => total + Number(item.salary || item.netSalary || 0),
                    0,
                ),

                savedCount: employees.filter((item) => item.saved).length,

                lockedCount: employees.filter((item) => item.locked).length,

                paidCount: employees.filter((item) => item.paid).length,
            };

            set({
                payrollData: data,

                employees,

                summary,
            });

            return true;
        } catch (error) {
            set({
                payrollData: null,

                employees: [],

                summary: {
                    ...initialSummary,
                },
            });

            toast.error(
                error?.response?.data?.message || "Failed to fetch employee salaries",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchEmployeePayrollDetail: async (employeeSlug, params = {}) => {
        try {
            set({
                detailLoading: true,

                selectedPayroll: null,
            });

            const response = await employeePayrollApi.getEmployeeDetail(
                employeeSlug,
                params,
            );

            set({
                selectedPayroll: response.data || null,
            });

            return true;
        } catch (error) {
            set({
                selectedPayroll: null,
            });

            toast.error(
                error?.response?.data?.message || "Failed to fetch salary details",
            );

            return false;
        } finally {
            set({
                detailLoading: false,
            });
        }
    },

    savePayrolls: async (payload) => {
        try {
            set({
                submitLoading: true,
            });

            const response = await employeePayrollApi.save(payload);

            toast.success(response.message || "Salary saved successfully");

            return {
                success: true,

                data: response.data || null,
            };
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to save salary");

            return {
                success: false,

                data: null,
            };
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    lockPayrolls: async (payrollSlugs) => {
        try {
            set({
                lockLoading: true,
            });

            const response = await employeePayrollApi.lock({
                payrollSlugs,
            });

            toast.success(response.message || "Salary locked successfully");

            return {
                success: true,

                data: response.data || null,
            };
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to lock salary");

            return {
                success: false,

                data: null,
            };
        } finally {
            set({
                lockLoading: false,
            });
        }
    },

    unlockPayrolls: async (payrollSlugs) => {
        try {
            set({
                unlockLoading: true,
            });

            const response = await employeePayrollApi.unlock({
                payrollSlugs,
            });

            toast.success(response.message || "Salary unlocked successfully");

            return {
                success: true,

                data: response.data || null,
            };
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to unlock salary");

            return {
                success: false,

                data: null,
            };
        } finally {
            set({
                unlockLoading: false,
            });
        }
    },

    markPayrollsPaid: async (payrollSlugs) => {
        try {
            set({
                paidLoading: true,
            });

            const response = await employeePayrollApi.markPaid({
                payrollSlugs,
            });

            toast.success(response.message || "Salary marked paid successfully");

            return {
                success: true,

                data: response.data || null,
            };
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to mark salary paid",
            );

            return {
                success: false,

                data: null,
            };
        } finally {
            set({
                paidLoading: false,
            });
        }
    },

    fetchPayrollLogs: async (payrollSlug) => {
        try {
            set({
                logsLoading: true,

                logs: [],
            });

            const response = await employeePayrollApi.getLogs(payrollSlug);

            set({
                logs: response.data || [],
            });

            return true;
        } catch (error) {
            set({
                logs: [],
            });

            toast.error(
                error?.response?.data?.message || "Failed to fetch salary logs",
            );

            return false;
        } finally {
            set({
                logsLoading: false,
            });
        }
    },

    fetchSalaryStatement: async (params = {}) => {
        try {
            set({
                statementLoading: true,

                salaryStatement: null,
            });

            const response = await employeePayrollApi.getSalaryStatement(params);

            set({
                salaryStatement: response.data || null,
            });

            return true;
        } catch (error) {
            set({
                salaryStatement: null,
            });

            toast.error(
                error?.response?.data?.message || "Failed to fetch salary statement",
            );

            return false;
        } finally {
            set({
                statementLoading: false,
            });
        }
    },

    fetchBankStatement: async (params = {}) => {
        try {
            set({
                bankStatementLoading: true,

                bankStatement: null,
            });

            const response = await employeePayrollApi.getBankStatement(params);

            set({
                bankStatement: response.data || null,
            });

            return true;
        } catch (error) {
            set({
                bankStatement: null,
            });

            toast.error(
                error?.response?.data?.message || "Failed to fetch bank statement",
            );

            return false;
        } finally {
            set({
                bankStatementLoading: false,
            });
        }
    },

    updateEmployeeInStore: (employeeSlug, data) => {
        const employees = get().employees;

        set({
            employees: employees.map((employee) =>
                employee.employeeSlug === employeeSlug
                    ? {
                        ...employee,
                        ...data,
                    }
                    : employee,
            ),
        });
    },

    clearSelectedPayroll: () => {
        set({
            selectedPayroll: null,
        });
    },

    clearPayrollData: () => {
        set({
            payrollData: null,

            employees: [],

            selectedPayroll: null,

            salaryStatement: null,

            bankStatement: null,

            logs: [],

            summary: {
                ...initialSummary,
            },
        });
    },
}));
