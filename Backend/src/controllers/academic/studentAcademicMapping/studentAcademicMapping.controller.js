import {
    getAcademicMappingSetupService,
    getUnmappedStudentsService,
    createStudentAcademicMappingService,
    getMappedStudentsService,
    getStudentAcademicMappingBySlugService,
    updateStudentAcademicMappingService,
    deleteStudentAcademicMappingService,
    restoreStudentAcademicMappingService,
} from "../../../services/academic/studentAcademicMapping/studentAcademicMapping.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

/*
|--------------------------------------------------------------------------
| Dropdown Setup
|--------------------------------------------------------------------------
*/

export const getAcademicMappingSetupController = async (
    req,
    res,
) => {
    try {
        const data = await getAcademicMappingSetupService(
            req.query,
            req.user,
        );

        return successResponse(
            res,
            200,
            "Academic mapping setup fetched successfully",
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

/*
|--------------------------------------------------------------------------
| Before Mapping Students
|--------------------------------------------------------------------------
*/

export const getUnmappedStudentsController = async (
    req,
    res,
) => {
    try {
        const data = await getUnmappedStudentsService(
            req.query,
            req.user,
        );

        return successResponse(
            res,
            200,
            "Unmapped students fetched successfully",
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

/*
|--------------------------------------------------------------------------
| Create Student Academic Mapping
|--------------------------------------------------------------------------
*/

export const createStudentAcademicMappingController =
    async (req, res) => {
        try {
            // console.log(
            //     "MAPPING REQUEST BODY:",
            //     req.body,
            // );

            const result =
                await createStudentAcademicMappingService(
                    req.body,
                    req.user,
                );

            return successResponse(
                res,
                201,
                "Student academic mapping created successfully",
                result,
            );
        } catch (error) {
            console.error(
                "CREATE MAPPING ERROR:",
                error,
            );

            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

/*
|--------------------------------------------------------------------------
| After Mapping Students
|--------------------------------------------------------------------------
*/

export const getMappedStudentsController = async (
    req,
    res,
) => {
    try {
        const data = await getMappedStudentsService(
            req.query,
            req.user,
        );

        return successResponse(
            res,
            200,
            "Mapped students fetched successfully",
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

/*
|--------------------------------------------------------------------------
| Get Mapping By Slug
|--------------------------------------------------------------------------
*/

export const getStudentAcademicMappingBySlugController =
    async (req, res) => {
        try {
            const data =
                await getStudentAcademicMappingBySlugService(
                    req.params.slug,
                    req.user,
                );

            return successResponse(
                res,
                200,
                "Student academic mapping fetched successfully",
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

/*
|--------------------------------------------------------------------------
| Update Mapping
|--------------------------------------------------------------------------
*/

export const updateStudentAcademicMappingController = async (
    req,
    res,
) => {
    try {
        const data =
            await updateStudentAcademicMappingService(
                req.params.slug,
                req.body,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Student academic mapping updated successfully",
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

/*
|--------------------------------------------------------------------------
| Delete Mapping
|--------------------------------------------------------------------------
*/

export const deleteStudentAcademicMappingController = async (
    req,
    res,
) => {
    try {
        const data =
            await deleteStudentAcademicMappingService(
                req.params.slug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Student academic mapping deleted successfully",
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

/*
|--------------------------------------------------------------------------
| Restore Mapping
|--------------------------------------------------------------------------
*/

export const restoreStudentAcademicMappingController = async (
    req,
    res,
) => {
    try {
        const data =
            await restoreStudentAcademicMappingService(
                req.params.slug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Student academic mapping restored successfully",
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