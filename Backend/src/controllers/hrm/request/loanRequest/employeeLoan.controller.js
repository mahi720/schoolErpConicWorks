import {
    successResponse,
    errorResponse,
} from "../../../../utils/apiResponse.js";

import {
    getMyLoanEligibilityService,
    getLoanPlanPreviewService,
    createEmployeeLoanService,
    getMyEmployeeLoansService,
    getAllEmployeeLoansService,
    getEmployeeLoanBySlugService,
    approveEmployeeLoanService,
    rejectEmployeeLoanService,
    cancelEmployeeLoanService,
    disburseEmployeeLoanService,
    getEmployeeLoanInstallmentsService,
    recoverEmployeeLoanInstallmentService,
    getEmployeeLoanForeclosurePreviewService,
    forecloseEmployeeLoanService,
    deleteEmployeeLoanService,
    restoreEmployeeLoanService,
} from "../../../../services/hrm/request/loanRequest/employeeLoan.service.js";

export const getMyLoanEligibilityController = async (req, res) => {
    try {
        const data = await getMyLoanEligibilityService({
            schoolSlug: req.user.schoolSlug,

            userSlug: req.user.slug,
        });

        return successResponse(
            res,
            200,
            "Loan eligibility fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getLoanPlanPreviewController = async (req, res) => {
    try {
        const data = await getLoanPlanPreviewService({
            schoolSlug: req.user.schoolSlug,

            userSlug: req.user.slug,

            loanAmount: req.query.loanAmount,
        });

        return successResponse(
            res,
            200,
            "Loan plans calculated successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const createEmployeeLoanController = async (req, res) => {
    try {
        const data = await createEmployeeLoanService({
            schoolSlug: req.user.schoolSlug,

            userSlug: req.user.slug,

            payload: req.body,
        });

        return successResponse(res, 201, "Loan request created successfully", data);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getMyEmployeeLoansController = async (req, res) => {
    try {
        const data = await getMyEmployeeLoansService({
            schoolSlug: req.user.schoolSlug,

            userSlug: req.user.slug,

            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Employee loans fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getAllEmployeeLoansController = async (req, res) => {
    try {
        const data = await getAllEmployeeLoansService({
            schoolSlug: req.user.schoolSlug,

            user: req.user,

            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Employee loans fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getEmployeeLoanBySlugController = async (req, res) => {
    try {
        const data = await getEmployeeLoanBySlugService({
            schoolSlug: req.user.schoolSlug,

            loanSlug: req.params.slug,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Employee loan fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const approveEmployeeLoanController = async (req, res) => {
    try {
        const data = await approveEmployeeLoanService({
            schoolSlug: req.user.schoolSlug,

            loanSlug: req.params.slug,

            payload: req.body,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Employee loan approved successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const rejectEmployeeLoanController = async (req, res) => {
    try {
        const data = await rejectEmployeeLoanService({
            schoolSlug: req.user.schoolSlug,

            loanSlug: req.params.slug,

            payload: req.body,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Employee loan rejected successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const cancelEmployeeLoanController = async (req, res) => {
    try {
        const data = await cancelEmployeeLoanService({
            schoolSlug: req.user.schoolSlug,

            loanSlug: req.params.slug,

            payload: req.body,

            userSlug: req.user.slug,
        });

        return successResponse(
            res,
            200,
            "Employee loan cancelled successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const disburseEmployeeLoanController = async (req, res) => {
    try {
        const data = await disburseEmployeeLoanService({
            schoolSlug: req.user.schoolSlug,

            loanSlug: req.params.slug,

            payload: req.body,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Employee loan disbursed successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getEmployeeLoanInstallmentsController = async (req, res) => {
    try {
        const data = await getEmployeeLoanInstallmentsService({
            schoolSlug: req.user.schoolSlug,

            loanSlug: req.params.slug,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Loan installments fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const recoverEmployeeLoanInstallmentController = async (req, res) => {
    try {
        const data = await recoverEmployeeLoanInstallmentService({
            schoolSlug: req.user.schoolSlug,

            loanSlug: req.params.slug,

            installmentSlug: req.params.installmentSlug,

            payload: req.body,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Loan installment recovered successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getEmployeeLoanForeclosurePreviewController = async (req, res) => {
    try {
        const data = await getEmployeeLoanForeclosurePreviewService({
            schoolSlug: req.user.schoolSlug,

            loanSlug: req.params.slug,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Loan foreclosure preview fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const forecloseEmployeeLoanController = async (req, res) => {
    try {
        const data = await forecloseEmployeeLoanService({
            schoolSlug: req.user.schoolSlug,

            loanSlug: req.params.slug,

            payload: req.body,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Employee loan foreclosed successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteEmployeeLoanController = async (req, res) => {
    try {
        const data = await deleteEmployeeLoanService({
            schoolSlug: req.user.schoolSlug,

            loanSlug: req.params.slug,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Employee loan deleted successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreEmployeeLoanController = async (req, res) => {
    try {
        const data = await restoreEmployeeLoanService({
            schoolSlug: req.user.schoolSlug,

            loanSlug: req.params.slug,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Employee loan restored successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};
