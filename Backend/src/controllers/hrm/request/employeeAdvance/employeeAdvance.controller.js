import {
    successResponse,
    errorResponse,
} from "../../../../utils/apiResponse.js";

import {
    getMyAdvanceEligibilityService,
    createEmployeeAdvanceService,
    getMyEmployeeAdvancesService,
    getAllEmployeeAdvancesService,
    getEmployeeAdvanceBySlugService,
    approveEmployeeAdvanceService,
    rejectEmployeeAdvanceService,
    cancelEmployeeAdvanceService,
    disburseEmployeeAdvanceService,
    getAdvanceInstallmentsService,
    recoverAdvanceInstallmentService,
    deleteEmployeeAdvanceService,
    restoreEmployeeAdvanceService,
    forecloseEmployeeAdvanceService,
} from "../../../../services/HRM/request/employeeAdvance/employeeAdvance.service.js";

// export const getMyAdvanceEligibilityController = async (req, res) => {
//     try {
//         const data = await getMyAdvanceEligibilityService({
//             schoolSlug: req.user.schoolSlug,

//             userSlug: req.user.slug,
//         });

//         return successResponse(
//             res,
//             200,
//             "Advance eligibility fetched successfully",
//             data,
//         );
//     } catch (error) {
//         return errorResponse(res, 400, error.message);
//     }
// };

export const getMyAdvanceEligibilityController = async (req, res) => {
    try {
        const data = await getMyAdvanceEligibilityService({
            schoolSlug: req.user.schoolSlug,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Advance eligibility fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const createEmployeeAdvanceController = async (req, res) => {
    try {
        const data = await createEmployeeAdvanceService({
            schoolSlug: req.user.schoolSlug,

            userSlug: req.user.slug,

            payload: req.body,
        });

        return successResponse(
            res,
            201,
            "Advance request created successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getMyEmployeeAdvancesController = async (req, res) => {
    try {
        // const data = await getMyEmployeeAdvancesService({
        //     schoolSlug: req.user.schoolSlug,

        //     userSlug: req.user.slug,

        //     query: req.query,
        // });

        const data = await getMyEmployeeAdvancesService({
            schoolSlug: req.user.schoolSlug,

            user: req.user,

            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Employee advances fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getAllEmployeeAdvancesController = async (req, res) => {
    try {
        const data = await getAllEmployeeAdvancesService({
            schoolSlug: req.user.schoolSlug,

            user: req.user,

            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Employee advances fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getEmployeeAdvanceBySlugController = async (req, res) => {
    try {
        const data = await getEmployeeAdvanceBySlugService({
            schoolSlug: req.user.schoolSlug,

            advanceSlug: req.params.slug,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Employee advance fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const approveEmployeeAdvanceController = async (req, res) => {
    try {
        const data = await approveEmployeeAdvanceService({
            schoolSlug: req.user.schoolSlug,

            advanceSlug: req.params.slug,

            payload: req.body,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Employee advance approved successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const rejectEmployeeAdvanceController = async (req, res) => {
    try {
        const data = await rejectEmployeeAdvanceService({
            schoolSlug: req.user.schoolSlug,

            advanceSlug: req.params.slug,

            payload: req.body,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Employee advance rejected successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const cancelEmployeeAdvanceController = async (req, res) => {
    try {
        const data = await cancelEmployeeAdvanceService({
            schoolSlug: req.user.schoolSlug,

            advanceSlug: req.params.slug,

            payload: req.body,

            userSlug: req.user.slug,
        });

        return successResponse(
            res,
            200,
            "Employee advance cancelled successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const disburseEmployeeAdvanceController = async (req, res) => {
    try {
        const data = await disburseEmployeeAdvanceService({
            schoolSlug: req.user.schoolSlug,

            advanceSlug: req.params.slug,

            payload: req.body,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Employee advance disbursed successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getAdvanceInstallmentsController = async (req, res) => {
    try {
        const data = await getAdvanceInstallmentsService({
            schoolSlug: req.user.schoolSlug,

            advanceSlug: req.params.slug,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Advance installments fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const recoverAdvanceInstallmentController = async (req, res) => {
    try {
        const data = await recoverAdvanceInstallmentService({
            schoolSlug: req.user.schoolSlug,

            advanceSlug: req.params.slug,

            installmentSlug: req.params.installmentSlug,

            payload: req.body,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Advance installment recovered successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteEmployeeAdvanceController = async (req, res) => {
    try {
        const data = await deleteEmployeeAdvanceService({
            schoolSlug: req.user.schoolSlug,

            advanceSlug: req.params.slug,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Employee advance deleted successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreEmployeeAdvanceController = async (req, res) => {
    try {
        const data = await restoreEmployeeAdvanceService({
            schoolSlug: req.user.schoolSlug,

            advanceSlug: req.params.slug,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Employee advance restored successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const forecloseEmployeeAdvanceController = async (req, res) => {
    try {
        const data = await forecloseEmployeeAdvanceService({
            schoolSlug: req.user.schoolSlug,

            advanceSlug: req.params.slug,

            payload: req.body,

            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Employee advance settled successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};
