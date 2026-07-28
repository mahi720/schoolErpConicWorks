import {
    createStudentOtherInformationService,
    getStudentOtherInformationBySlugService,
    getStudentOtherInformationByStudentService,
    updateStudentOtherInformationService,
    deleteStudentOtherInformationService,
    restoreStudentOtherInformationService,
} from "../../../services/academic/studentHealthManagement/studentOtherInformation.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const createStudentOtherInformationController = async (
    req,
    res,
) => {
    try {
        const data =
            await createStudentOtherInformationService(
                req.body,
                req.user,
            );

        return successResponse(
            res,
            201,
            "Student other information created successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getStudentOtherInformationBySlugController =
    async (req, res) => {
        try {
            const data =
                await getStudentOtherInformationBySlugService(
                    req.params.slug,
                    req.user,
                );

            return successResponse(
                res,
                200,
                "Student other information fetched successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                404,
                error.message,
            );
        }
    };

export const getStudentOtherInformationByStudentController =
    async (req, res) => {
        try {
            const data =
                await getStudentOtherInformationByStudentService(
                    req.params.studentSlug,
                    req.user,
                );

            return successResponse(
                res,
                200,
                data
                    ? "Student other information fetched successfully"
                    : "Student other information not added yet",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

export const updateStudentOtherInformationController = async (
    req,
    res,
) => {
    try {
        const data =
            await updateStudentOtherInformationService(
                req.params.slug,
                req.body,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Student other information updated successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteStudentOtherInformationController = async (
    req,
    res,
) => {
    try {
        const data =
            await deleteStudentOtherInformationService(
                req.params.slug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Student other information deleted successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreStudentOtherInformationController = async (
    req,
    res,
) => {
    try {
        const data =
            await restoreStudentOtherInformationService(
                req.params.slug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Student other information restored successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};