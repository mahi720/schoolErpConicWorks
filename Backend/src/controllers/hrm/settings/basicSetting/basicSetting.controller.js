import {
    successResponse,
    errorResponse,
} from "../../../../utils/apiResponse.js";

import {
    createBasicSettingsService,
    getBasicSettingsService,
    getBasicSettingBySlugService,
    updateBasicSettingService,
    deleteBasicSettingService,
    restoreBasicSettingService,
} from "../../../../services/hrm/settings/basicSetting/basicSetting.service.js";

export const createBasicSettingsController = async (
    req,
    res,
) => {
    try {
        const data = await createBasicSettingsService({
            schoolSlug: req.user.schoolSlug,
            payload: req.body,
        });

        return successResponse(
            res,
            201,
            "Basic settings saved successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getBasicSettingsController = async (
    req,
    res,
) => {
    try {
        const data = await getBasicSettingsService({
            schoolSlug: req.user.schoolSlug,
            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Basic settings fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getBasicSettingBySlugController = async (
    req,
    res,
) => {
    try {
        const data = await getBasicSettingBySlugService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Basic setting fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 404, error.message);
    }
};

export const updateBasicSettingController = async (
    req,
    res,
) => {
    try {
        const data = await updateBasicSettingService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
            payload: req.body,
        });

        return successResponse(
            res,
            200,
            "Basic setting updated successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteBasicSettingController = async (
    req,
    res,
) => {
    try {
        const data = await deleteBasicSettingService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Basic setting inactivated successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreBasicSettingController = async (
    req,
    res,
) => {
    try {
        const data = await restoreBasicSettingService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Basic setting restored successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};