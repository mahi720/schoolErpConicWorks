import {
    createClassMappingService,
    getClassMappingsService,
} from "../../../services/master/classMapping/classMapping.service.js";

import { successResponse, errorResponse } from "../../../utils/apiResponse.js";

export const createClassMapping = async (req, res) => {
    try {
        const data = await createClassMappingService(req.body, req.user);

        return successResponse(res, 201, "Class mapping saved successfully", data);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getClassMappings = async (req, res) => {
    try {
        const data = await getClassMappingsService(req.query, req.user);

        return successResponse(res, 200, "Class mappings fetched successfully", data);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};