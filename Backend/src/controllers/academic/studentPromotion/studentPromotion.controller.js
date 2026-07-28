import {
    createStudentPromotionsService,
    getStudentPromotionsService,
    getStudentPromotionBySlugService,
    getPromotionBatchService,
    rollbackPromotionBatchService,
} from "../../../services/academic/studentPromotion/studentPromotion.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const createStudentPromotionsController = async (
    req,
    res,
) => {
    try {
        const result =
            await createStudentPromotionsService(
                req.body,
                req.user,
            );

        return successResponse(
            res,
            201,
            `${result.totalStudents} student(s) processed successfully`,
            result,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const getStudentPromotionsController = async (
    req,
    res,
) => {
    try {
        const promotions =
            await getStudentPromotionsService(
                req.query,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Student promotions fetched successfully",
            promotions,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const getStudentPromotionBySlugController =
    async (req, res) => {
        try {
            const promotion =
                await getStudentPromotionBySlugService(
                    req.params.slug,
                    req.user,
                );

            return successResponse(
                res,
                200,
                "Student promotion fetched successfully",
                promotion,
            );
        } catch (error) {
            return errorResponse(
                res,
                404,
                error.message,
            );
        }
    };

export const getPromotionBatchController = async (
    req,
    res,
) => {
    try {
        const batch =
            await getPromotionBatchService(
                req.params.batchSlug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Promotion batch fetched successfully",
            batch,
        );
    } catch (error) {
        return errorResponse(
            res,
            404,
            error.message,
        );
    }
};

export const rollbackPromotionBatchController = async (
    req,
    res,
) => {
    try {
        const result =
            await rollbackPromotionBatchService(
                req.params.batchSlug,
                req.body,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Promotion batch rolled back successfully",
            result,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};