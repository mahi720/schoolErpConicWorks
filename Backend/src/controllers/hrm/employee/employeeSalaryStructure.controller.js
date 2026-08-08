import {
    getEmployeeSalaryStructureService,
    getEmployeePayBandOptionsService,
    previewEmployeePayBandService,
    saveEmployeeSalaryStructureService,
    updateSalaryGenerationStatusService,
    getEmployeeSalaryIncrementHistoryService,
} from "../../../services/HRM/employee/employeeSalaryStructure.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const getEmployeeSalaryStructureController =
    async (req, res) => {
        try {
            const data =
                await getEmployeeSalaryStructureService({
                    schoolSlug:
                        req.user.schoolSlug,

                    employeeSlug:
                        req.params.employeeSlug,
                });

            return successResponse(
                res,
                200,
                "Employee salary structure fetched successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

export const getEmployeePayBandOptionsController =
    async (req, res) => {
        try {
            const data =
                await getEmployeePayBandOptionsService({
                    schoolSlug:
                        req.user.schoolSlug,
                });

            return successResponse(
                res,
                200,
                "Pay bands fetched successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

export const previewEmployeePayBandController =
    async (req, res) => {
        try {
            const data =
                await previewEmployeePayBandService({
                    schoolSlug:
                        req.user.schoolSlug,

                    employeeSlug:
                        req.params.employeeSlug,

                    payBandName:
                        req.body.payBand,
                });

            return successResponse(
                res,
                200,
                "Pay band salary details fetched successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

export const saveEmployeeSalaryStructureController =
    async (req, res) => {
        try {
            const data =
                await saveEmployeeSalaryStructureService({
                    schoolSlug:
                        req.user.schoolSlug,

                    employeeSlug:
                        req.params.employeeSlug,

                    userSlug:
                        req.user.slug,

                    payload:
                        req.body,
                });

            return successResponse(
                res,
                200,
                "Employee salary structure saved successfully",
                data,
            );
        } catch (error) {
            console.error(
                "SAVE SALARY ERROR:",
                error,
            );

            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

export const updateSalaryGenerationStatusController =
    async (req, res) => {
        try {
            const data =
                await updateSalaryGenerationStatusService({
                    schoolSlug:
                        req.user.schoolSlug,

                    employeeSlug:
                        req.params.employeeSlug,

                    stopped:
                        req.body.stopped,
                });

            return successResponse(
                res,
                200,
                req.body.stopped
                    ? "Salary generation stopped successfully"
                    : "Salary generation resumed successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

export const getEmployeeSalaryIncrementHistoryController =
    async (req, res) => {
        try {
            const data =
                await getEmployeeSalaryIncrementHistoryService({
                    schoolSlug:
                        req.user.schoolSlug,

                    employeeSlug:
                        req.params.employeeSlug,
                });

            return successResponse(
                res,
                200,
                "Employee salary increment history fetched successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };