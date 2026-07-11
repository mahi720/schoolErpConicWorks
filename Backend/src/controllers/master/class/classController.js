import {
    createClassService,
    getClassesService,
    getClassBySlugService,
    updateClassService,
    deleteClassService,
    restoreClassService,
} from "../../../services/master/class/class.service.js";

import { successResponse, errorResponse } from "../../../utils/apiResponse.js";

export const createClass = async (req, res) => {
    try {
        const classData = await createClassService(req.body, req.user);

        return successResponse(res, 201, "Class created successfully", classData);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getClasses = async (req, res) => {
    try {
        const classes = await getClassesService(req.query, req.user);

        return successResponse(res, 200, "Classes fetched successfully", classes);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getClassBySlug = async (req, res) => {
    try {
        const classData = await getClassBySlugService(req.params.slug, req.user);

        return successResponse(res, 200, "Class fetched successfully", classData);
    } catch (error) {
        return errorResponse(res, 404, error.message);
    }
};

export const updateClass = async (req, res) => {
    try {
        const classData = await updateClassService(
            req.params.slug,
            req.body,
            req.user
        );

        return successResponse(res, 200, "Class updated successfully", classData);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteClass = async (req, res) => {
    try {
        const classData = await deleteClassService(req.params.slug, req.user);

        return successResponse(res, 200, "Class deleted successfully", classData);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreClass = async (req, res) => {
    try {
        const classData = await restoreClassService(req.params.slug, req.user);

        return successResponse(res, 200, "Class restored successfully", classData);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};