import {
    createSectionService,
    getSectionsService,
    getSectionBySlugService,
    updateSectionService,
    deleteSectionService,
    restoreSectionService,
} from "../../../services/master/section/section.service.js";

import { successResponse, errorResponse } from "../../../utils/apiResponse.js";

export const createSection = async (req, res) => {
    try {
        const sectionData = await createSectionService(req.body, req.user);

        return successResponse(res, 201, "Section created successfully", sectionData);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getSections = async (req, res) => {
    try {
        const sections = await getSectionsService(req.query, req.user);

        return successResponse(res, 200, "Sections fetched successfully", sections);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getSectionBySlug = async (req, res) => {
    try {
        const sectionData = await getSectionBySlugService(req.params.slug, req.user);

        return successResponse(res, 200, "Section fetched successfully", sectionData);
    } catch (error) {
        return errorResponse(res, 404, error.message);
    }
};

export const updateSection = async (req, res) => {
    try {
        const sectionData = await updateSectionService(
            req.params.slug,
            req.body,
            req.user
        );

        return successResponse(res, 200, "Section updated successfully", sectionData);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteSection = async (req, res) => {
    try {
        const sectionData = await deleteSectionService(req.params.slug, req.user);

        return successResponse(res, 200, "Section deleted successfully", sectionData);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreSection = async (req, res) => {
    try {
        const sectionData = await restoreSectionService(req.params.slug, req.user);

        return successResponse(res, 200, "Section restored successfully", sectionData);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};