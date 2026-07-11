import {
    createPaymentInfoService,
    getMyPaymentInfoService,
    updateMyPaymentInfoService,
    deleteMyPaymentInfoService,
    restoreMyPaymentInfoService,
} from "../../../services/master/paymentInfo/paymentInfo.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const createPaymentInfo = async (
    req,
    res,
) => {
    try {
        const paymentInfo =
            await createPaymentInfoService(
                req.body,
                req.user,
            );

        return successResponse(
            res,
            201,
            "Payment information created successfully",
            paymentInfo,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const getMyPaymentInfo = async (
    req,
    res,
) => {
    try {
        const paymentInfo =
            await getMyPaymentInfoService(req.user);

        return successResponse(
            res,
            200,
            "Payment information fetched successfully",
            paymentInfo,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const updateMyPaymentInfo = async (
    req,
    res,
) => {
    try {
        const paymentInfo =
            await updateMyPaymentInfoService(
                req.body,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Payment information updated successfully",
            paymentInfo,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const deleteMyPaymentInfo = async (
    req,
    res,
) => {
    try {
        const paymentInfo =
            await deleteMyPaymentInfoService(req.user);

        return successResponse(
            res,
            200,
            "Payment information deactivated successfully",
            paymentInfo,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const restoreMyPaymentInfo = async (
    req,
    res,
) => {
    try {
        const paymentInfo =
            await restoreMyPaymentInfoService(req.user);

        return successResponse(
            res,
            200,
            "Payment information restored successfully",
            paymentInfo,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};