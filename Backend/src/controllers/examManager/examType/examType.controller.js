import {
    createExamTypeService,
    getExamTypesService,
    getExamTypeBySlugService,
    updateExamTypeService,
    deleteExamTypeService,
    restoreExamTypeService,
} from "../../../services/examManager/examType/examType.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const createExamTypeController = async (
    req,
    res,
) => {
    try {
        const examType = await createExamTypeService(
            req.body,
            req.user,
        );

        return successResponse(
            res,
            201,
            "Exam type created successfully",
            examType,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getExamTypesController = async (
    req,
    res,
) => {
    try {
        const examTypes = await getExamTypesService(
            req.query,
            req.user,
        );

        return successResponse(
            res,
            200,
            "Exam types fetched successfully",
            examTypes,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getExamTypeBySlugController = async (
    req,
    res,
) => {
    try {
        const examType = await getExamTypeBySlugService(
            req.params.slug,
            req.user,
        );

        return successResponse(
            res,
            200,
            "Exam type fetched successfully",
            examType,
        );
    } catch (error) {
        return errorResponse(res, 404, error.message);
    }
};

export const updateExamTypeController = async (
    req,
    res,
) => {
    try {
        const examType = await updateExamTypeService(
            req.params.slug,
            req.body,
            req.user,
        );

        return successResponse(
            res,
            200,
            "Exam type updated successfully",
            examType,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteExamTypeController = async (
    req,
    res,
) => {
    try {
        const examType = await deleteExamTypeService(
            req.params.slug,
            req.user,
        );

        return successResponse(
            res,
            200,
            "Exam type deleted successfully",
            examType,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreExamTypeController = async (
    req,
    res,
) => {
    try {
        const examType = await restoreExamTypeService(
            req.params.slug,
            req.user,
        );

        return successResponse(
            res,
            200,
            "Exam type restored successfully",
            examType,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};