import {
    createStreamService,
    getStreamsService,
    getStreamBySlugService,
    updateStreamService,
    deleteStreamService,
    restoreStreamService,
} from "../../../services/master/stream/stream.service.js"

import { successResponse, errorResponse } from "../../../utils/apiResponse.js";

export const createStream = async (req, res) => {
    try {
        const streamData = await createStreamService(req.body, req.user);

        return successResponse(res, 201, "Stream created successfully", streamData);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getStreams = async (req, res) => {
    try {
        const streams = await getStreamsService(req.query, req.user);

        return successResponse(res, 200, "Streams fetched successfully", streams);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getStreamBySlug = async (req, res) => {
    try {
        const streamData = await getStreamBySlugService(req.params.slug, req.user);

        return successResponse(res, 200, "Stream fetched successfully", streamData);
    } catch (error) {
        return errorResponse(res, 404, error.message);
    }
};

export const updateStream = async (req, res) => {
    try {
        const streamData = await updateStreamService(
            req.params.slug,
            req.body,
            req.user
        );

        return successResponse(res, 200, "Stream updated successfully", streamData);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteStream = async (req, res) => {
    try {
        const streamData = await deleteStreamService(req.params.slug, req.user);

        return successResponse(res, 200, "Stream deleted successfully", streamData);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreStream = async (req, res) => {
    try {
        const streamData = await restoreStreamService(req.params.slug, req.user);

        return successResponse(res, 200, "Stream restored successfully", streamData);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};