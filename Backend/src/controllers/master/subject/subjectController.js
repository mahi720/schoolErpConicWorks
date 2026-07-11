import {
    createSubjectService,
    getSubjectsService,
    getSubjectBySlugService,
    updateSubjectService,
    deleteSubjectService,
    restoreSubjectService,
} from "../../../services/master/subject/subject.service.js";

import { successResponse, errorResponse } from "../../../utils/apiResponse.js";

export const createSubject = async (req, res) => {
    try {
        const subject = await createSubjectService(req.body, req.user);
        return successResponse(res, 201, "Subject created successfully", subject);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getSubjects = async (req, res) => {
    try {
        const subjects = await getSubjectsService(req.query, req.user);

        return successResponse(res, 200, "Subjects fetched successfully", subjects);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getSubjectBySlug = async (req, res) => {
    try {
        const subject = await getSubjectBySlugService(req.params.slug, req.user);
        return successResponse(res, 200, "Subject fetched successfully", subject);
    } catch (error) {
        return errorResponse(res, 404, error.message);
    }
};

export const updateSubject = async (req, res) => {
    try {
        const subject = await updateSubjectService(
            req.params.slug,
            req.body,
            req.user
        );

        return successResponse(res, 200, "Subject updated successfully", subject);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteSubject = async (req, res) => {
    try {
        const subject = await deleteSubjectService(req.params.slug, req.user);
        return successResponse(res, 200, "Subject deleted successfully", subject);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreSubject = async (req, res) => {
    try {
        const subject = await restoreSubjectService(req.params.slug, req.user);
        return successResponse(res, 200, "Subject restored successfully", subject);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};