import API from "../../axios/axios";

const EMPLOYEE_PAYROLL_URL = "/hrm/employee-payrolls";

export const employeePayrollApi = {
    getEmployees: async (params = {}) => {
        const response = await API.get(`${EMPLOYEE_PAYROLL_URL}/employees`, {
            params,
        });

        return response.data;
    },

    getEmployeeDetail: async (employeeSlug, params = {}) => {
        const response = await API.get(
            `${EMPLOYEE_PAYROLL_URL}/employees/${employeeSlug}`,
            {
                params,
            },
        );

        return response.data;
    },

    save: async (payload) => {
        const response = await API.post(`${EMPLOYEE_PAYROLL_URL}/save`, payload);

        return response.data;
    },

    lock: async (payload) => {
        const response = await API.patch(`${EMPLOYEE_PAYROLL_URL}/lock`, payload);

        return response.data;
    },

    unlock: async (payload) => {
        const response = await API.patch(`${EMPLOYEE_PAYROLL_URL}/unlock`, payload);

        return response.data;
    },

    markPaid: async (payload) => {
        const response = await API.patch(
            `${EMPLOYEE_PAYROLL_URL}/mark-paid`,
            payload,
        );

        return response.data;
    },

    getLogs: async (payrollSlug) => {
        const response = await API.get(
            `${EMPLOYEE_PAYROLL_URL}/${payrollSlug}/logs`,
        );

        return response.data;
    },

    getSalaryStatement: async (params = {}) => {
        const response = await API.get(`${EMPLOYEE_PAYROLL_URL}/salary-statement`, {
            params,
        });

        return response.data;
    },

    getBankStatement: async (params = {}) => {
        const response = await API.get(`${EMPLOYEE_PAYROLL_URL}/bank-statement`, {
            params,
        });

        return response.data;
    },
};
