import {
    createClassSubjectsService,
    getClassSubjectsService,
    getClassSubjectBySlugService,
    updateClassSubjectService,
    deleteClassSubjectService,
    restoreClassSubjectService,
} from "../../../services/master/addSubjectToClass/addSubjectToClass.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const createClassSubjects = async (req, res) => {
    try {
        const data = await createClassSubjectsService(
            req.body,
            req.user
        );

        return successResponse(
            res,
            201,
            "Subjects assigned to class successfully",
            data
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getClassSubjects = async (req, res) => {
    try {
        const data = await getClassSubjectsService(
            req.query,
            req.user
        );

        return successResponse(
            res,
            200,
            "Class subjects fetched successfully",
            data
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getClassSubjectBySlug = async (req, res) => {
    try {
        const data = await getClassSubjectBySlugService(
            req.params.slug,
            req.user
        );

        return successResponse(
            res,
            200,
            "Class subject fetched successfully",
            data
        );
    } catch (error) {
        return errorResponse(res, 404, error.message);
    }
};

export const updateClassSubject = async (req, res) => {
    try {
        const data = await updateClassSubjectService(
            req.params.slug,
            req.body,
            req.user
        );

        return successResponse(
            res,
            200,
            "Class subject updated successfully",
            data
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteClassSubject = async (req, res) => {
    try {
        const data = await deleteClassSubjectService(
            req.params.slug,
            req.user
        );

        return successResponse(
            res,
            200,
            "Class subject deleted successfully",
            data
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreClassSubject = async (req, res) => {
    try {
        const data = await restoreClassSubjectService(
            req.params.slug,
            req.user
        );

        return successResponse(
            res,
            200,
            "Class subject restored successfully",
            data
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};