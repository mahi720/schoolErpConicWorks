import {
    createSchoolService,
    getSchoolsService,
    getSchoolBySlugService,
    getMySchoolService,
    updateSchoolService,
    updateMySchoolService,
    deleteSchoolService,
    restoreSchoolService,
} from "../../../services/master/school/school.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const createSchool = async (req, res) => {
    try {
        const school = await createSchoolService(
            req.body,
            req.file,
        );

        return successResponse(
            res,
            201,
            "School created successfully",
            school,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getSchools = async (req, res) => {
    try {
        const schools = await getSchoolsService();

        return successResponse(
            res,
            200,
            "Schools fetched successfully",
            schools,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getSchoolBySlug = async (req, res) => {
    try {
        const school = await getSchoolBySlugService(
            req.params.slug,
        );

        return successResponse(
            res,
            200,
            "School fetched successfully",
            school,
        );
    } catch (error) {
        return errorResponse(res, 404, error.message);
    }
};

export const getMySchool = async (req, res) => {
    try {
        const school = await getMySchoolService(req.user);

        return successResponse(
            res,
            200,
            "School information fetched successfully",
            school,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const updateSchool = async (req, res) => {
    try {
        const school = await updateSchoolService(
            req.params.slug,
            req.body,
            req.file,
        );

        return successResponse(
            res,
            200,
            "School updated successfully",
            school,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const updateMySchool = async (req, res) => {
    try {
        const school = await updateMySchoolService(
            req.body,
            req.file,
            req.user,
        );

        return successResponse(
            res,
            200,
            "School information updated successfully",
            school,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteSchool = async (req, res) => {
    try {
        const school = await deleteSchoolService(
            req.params.slug,
        );

        return successResponse(
            res,
            200,
            "School deactivated successfully",
            school,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreSchool = async (req, res) => {
    try {
        const school = await restoreSchoolService(
            req.params.slug,
        );

        return successResponse(
            res,
            200,
            "School restored successfully",
            school,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};