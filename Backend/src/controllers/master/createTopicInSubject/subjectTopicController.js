import {
    createSubjectTopicService,
    getSubjectTopicsService,
    getSubjectTopicBySlugService,
    updateSubjectTopicService,
    deleteSubjectTopicService,
    restoreSubjectTopicService,
} from "../../../services/master/createTopicInSubject/subjectTopic.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const createSubjectTopic = async (req, res) => {
    try {
        const topic = await createSubjectTopicService(
            req.body,
            req.user
        );

        return successResponse(
            res,
            201,
            "Subject topic created successfully",
            topic
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getSubjectTopics = async (req, res) => {
    try {
        const topics = await getSubjectTopicsService(
            req.query,
            req.user
        );

        return successResponse(
            res,
            200,
            "Subject topics fetched successfully",
            topics
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getSubjectTopicBySlug = async (req, res) => {
    try {
        const topic = await getSubjectTopicBySlugService(
            req.params.slug,
            req.user
        );

        return successResponse(
            res,
            200,
            "Subject topic fetched successfully",
            topic
        );
    } catch (error) {
        return errorResponse(res, 404, error.message);
    }
};

export const updateSubjectTopic = async (req, res) => {
    try {
        const topic = await updateSubjectTopicService(
            req.params.slug,
            req.body,
            req.user
        );

        return successResponse(
            res,
            200,
            "Subject topic updated successfully",
            topic
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteSubjectTopic = async (req, res) => {
    try {
        const topic = await deleteSubjectTopicService(
            req.params.slug,
            req.user
        );

        return successResponse(
            res,
            200,
            "Subject topic deleted successfully",
            topic
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreSubjectTopic = async (req, res) => {
    try {
        const topic = await restoreSubjectTopicService(
            req.params.slug,
            req.user
        );

        return successResponse(
            res,
            200,
            "Subject topic restored successfully",
            topic
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};