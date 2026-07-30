import {
    createPeriodicTestService,
    getPeriodicTestsService,
    getPeriodicTestBySlugService,
    updatePeriodicTestService,
    deletePeriodicTestService,
    restorePeriodicTestService,
    getPeriodicTestTimeTableService,
    savePeriodicTestTimeTableService,
    deletePeriodicTestTimeTableService,
    restorePeriodicTestTimeTableService,
} from "../../../services/examManager/periodicTestTimeTable/periodicTestTimeTable.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const createPeriodicTest = async (
    req,
    res,
) => {
    try {
        const periodicTest =
            await createPeriodicTestService(
                req.body,
                req.user,
            );

        return successResponse(
            res,
            201,
            "Periodic test created successfully",
            periodicTest,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const getPeriodicTests = async (
    req,
    res,
) => {
    try {
        const periodicTests =
            await getPeriodicTestsService(
                req.query,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Periodic tests fetched successfully",
            periodicTests,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const getPeriodicTestBySlug = async (
    req,
    res,
) => {
    try {
        const periodicTest =
            await getPeriodicTestBySlugService(
                req.params.slug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Periodic test fetched successfully",
            periodicTest,
        );
    } catch (error) {
        return errorResponse(
            res,
            404,
            error.message,
        );
    }
};

export const updatePeriodicTest = async (
    req,
    res,
) => {
    try {
        const periodicTest =
            await updatePeriodicTestService(
                req.params.slug,
                req.body,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Periodic test updated successfully",
            periodicTest,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const deletePeriodicTest = async (
    req,
    res,
) => {
    try {
        const periodicTest =
            await deletePeriodicTestService(
                req.params.slug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Periodic test inactivated successfully",
            periodicTest,
        );
    } catch (error) {
        return errorResponse(
            res,
            404,
            error.message,
        );
    }
};

export const restorePeriodicTest = async (
    req,
    res,
) => {
    try {
        const periodicTest =
            await restorePeriodicTestService(
                req.params.slug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Periodic test restored successfully",
            periodicTest,
        );
    } catch (error) {
        return errorResponse(
            res,
            404,
            error.message,
        );
    }
};

export const getPeriodicTestTimeTable = async (
    req,
    res,
) => {
    try {
        const data =
            await getPeriodicTestTimeTableService(
                req.params.periodicTestSlug,
                req.params.classSlug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Periodic test timetable fetched successfully",
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

export const savePeriodicTestTimeTable = async (
    req,
    res,
) => {
    try {
        const data =
            await savePeriodicTestTimeTableService(
                req.body,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Periodic test timetable saved successfully",
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

export const deletePeriodicTestTimeTable = async (
    req,
    res,
) => {
    try {
        const data =
            await deletePeriodicTestTimeTableService(
                req.params.periodicTestSlug,
                req.params.classSlug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Periodic test timetable inactivated successfully",
            data,
        );
    } catch (error) {
        return errorResponse(
            res,
            404,
            error.message,
        );
    }
};

export const restorePeriodicTestTimeTable = async (
    req,
    res,
) => {
    try {
        const data =
            await restorePeriodicTestTimeTableService(
                req.params.periodicTestSlug,
                req.params.classSlug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Periodic test timetable restored successfully",
            data,
        );
    } catch (error) {
        return errorResponse(
            res,
            404,
            error.message,
        );
    }
};