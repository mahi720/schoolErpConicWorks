import API from "../../axios/axios";

const EMPLOYEE_SALARY_URL =
    "/hrm/salary/employees";

export const employeeSalaryStructureApi = {
    getPayBands: async () => {
        const response =
            await API.get(
                `${EMPLOYEE_SALARY_URL}/pay-bands`,
            );

        return response.data;
    },

    getSalaryStructure: async (
        employeeSlug,
    ) => {
        const response =
            await API.get(
                `${EMPLOYEE_SALARY_URL}/${employeeSlug}/salary-structure`,
            );

        return response.data;
    },

    previewPayBand: async (
        employeeSlug,
        payload,
    ) => {
        const response =
            await API.post(
                `${EMPLOYEE_SALARY_URL}/${employeeSlug}/salary-structure/pay-band-preview`,
                payload,
            );

        return response.data;
    },

    saveSalaryStructure: async (
        employeeSlug,
        payload,
    ) => {
        const response =
            await API.put(
                `${EMPLOYEE_SALARY_URL}/${employeeSlug}/salary-structure`,
                payload,
            );

        return response.data;
    },

    updateGenerationStatus: async (
        employeeSlug,
        stopped,
    ) => {
        const response =
            await API.patch(
                `${EMPLOYEE_SALARY_URL}/${employeeSlug}/salary-structure/generation-status`,
                {
                    stopped,
                },
            );

        return response.data;
    },

    getIncrementHistory: async (
        employeeSlug,
    ) => {
        const response =
            await API.get(
                `${EMPLOYEE_SALARY_URL}/${employeeSlug}/salary-structure/increments`,
            );

        return response.data;
    },
};