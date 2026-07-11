import crypto from "crypto";

import {
    createPaymentInfoRepo,
    getPaymentInfoBySchoolSlugRepo,
    updatePaymentInfoRepo,
    deletePaymentInfoRepo,
    restorePaymentInfoRepo,
} from "../../../repositories/master/paymentInfo/paymentInfo.repository.js";

const ensureSchool = (user) => {
    if (!user?.schoolSlug) {
        throw new Error(
            "School is not assigned to this user",
        );
    }

    return user.schoolSlug;
};

const formatPaymentInfo = (paymentInfo) => {
    if (!paymentInfo) {
        return {
            clientId: "",
            merchantId: "",
            secretKey: "",

            otherClientId: "",
            otherMerchantId: "",
            otherSecretKey: "",

            status: "active",
            isActive: true,
        };
    }

    return {
        id: paymentInfo.id,
        slug: paymentInfo.slug,
        schoolSlug: paymentInfo.schoolSlug,

        clientId: paymentInfo.primaryClientId || "",
        merchantId:
            paymentInfo.primaryMerchantId || "",
        secretKey: paymentInfo.primarySecretKey || "",

        otherClientId:
            paymentInfo.otherClientId || "",
        otherMerchantId:
            paymentInfo.otherMerchantId || "",
        otherSecretKey:
            paymentInfo.otherSecretKey || "",

        status: paymentInfo.status,
        isActive: paymentInfo.isActive,
        deletedAt: paymentInfo.deletedAt,

        createdAt: paymentInfo.createdAt,
        updatedAt: paymentInfo.updatedAt,
    };
};

export const createPaymentInfoService = async (
    payload,
    user,
) => {
    const schoolSlug = ensureSchool(user);

    const existingPaymentInfo =
        await getPaymentInfoBySchoolSlugRepo(
            schoolSlug,
        );

    if (existingPaymentInfo) {
        throw new Error(
            "Payment information already exists for this school",
        );
    }

    const paymentInfo = await createPaymentInfoRepo({
        slug: crypto.randomUUID(),
        schoolSlug,

        primaryClientId:
            payload.primaryClientId || null,

        primaryMerchantId:
            payload.primaryMerchantId || null,

        primarySecretKey:
            payload.primarySecretKey || null,

        otherClientId:
            payload.otherClientId || null,

        otherMerchantId:
            payload.otherMerchantId || null,

        otherSecretKey:
            payload.otherSecretKey || null,

        status: "active",
        isActive: true,
        deletedAt: null,
    });

    return formatPaymentInfo(paymentInfo);
};

export const getMyPaymentInfoService = async (
    user,
) => {
    const schoolSlug = ensureSchool(user);

    const paymentInfo =
        await getPaymentInfoBySchoolSlugRepo(
            schoolSlug,
        );

    /*
      Seed se record create na hua ho tab bhi frontend
      empty state dikha sakega.
    */
    return formatPaymentInfo(paymentInfo);
};

export const updateMyPaymentInfoService = async (
    payload,
    user,
) => {
    const schoolSlug = ensureSchool(user);

    let paymentInfo =
        await getPaymentInfoBySchoolSlugRepo(
            schoolSlug,
        );

    /*
      Seed missing ho to first update par automatically
      payment info create ho jayega.
    */
    if (!paymentInfo) {
        paymentInfo = await createPaymentInfoRepo({
            slug: crypto.randomUUID(),
            schoolSlug,

            primaryClientId: null,
            primaryMerchantId: null,
            primarySecretKey: null,

            otherClientId: null,
            otherMerchantId: null,
            otherSecretKey: null,

            status: "active",
            isActive: true,
            deletedAt: null,
        });
    }

    if (!paymentInfo.isActive) {
        throw new Error(
            "Payment information is inactive. Restore it before updating",
        );
    }

    const updateData = {};

    if (payload.type === "primary") {
        if (payload.primaryClientId !== undefined) {
            updateData.primaryClientId =
                payload.primaryClientId;
        }

        if (payload.primaryMerchantId !== undefined) {
            updateData.primaryMerchantId =
                payload.primaryMerchantId;
        }

        if (payload.primarySecretKey !== undefined) {
            updateData.primarySecretKey =
                payload.primarySecretKey;
        }
    } else if (payload.type === "other") {
        if (payload.otherClientId !== undefined) {
            updateData.otherClientId =
                payload.otherClientId;
        }

        if (
            payload.otherMerchantId !== undefined
        ) {
            updateData.otherMerchantId =
                payload.otherMerchantId;
        }

        if (payload.otherSecretKey !== undefined) {
            updateData.otherSecretKey =
                payload.otherSecretKey;
        }
    } else {
        const allowedFields = [
            "primaryClientId",
            "primaryMerchantId",
            "primarySecretKey",
            "otherClientId",
            "otherMerchantId",
            "otherSecretKey",
        ];

        allowedFields.forEach((field) => {
            if (payload[field] !== undefined) {
                updateData[field] = payload[field];
            }
        });
    }

    if (Object.keys(updateData).length === 0) {
        throw new Error(
            "No payment information provided for update",
        );
    }

    const updatedPaymentInfo =
        await updatePaymentInfoRepo(
            schoolSlug,
            updateData,
        );

    return formatPaymentInfo(updatedPaymentInfo);
};

export const deleteMyPaymentInfoService = async (
    user,
) => {
    const schoolSlug = ensureSchool(user);

    const paymentInfo =
        await getPaymentInfoBySchoolSlugRepo(
            schoolSlug,
        );

    if (!paymentInfo) {
        throw new Error(
            "Payment information not found",
        );
    }

    if (!paymentInfo.isActive) {
        throw new Error(
            "Payment information is already inactive",
        );
    }

    const deletedPaymentInfo =
        await deletePaymentInfoRepo(schoolSlug);

    return formatPaymentInfo(deletedPaymentInfo);
};

export const restoreMyPaymentInfoService = async (
    user,
) => {
    const schoolSlug = ensureSchool(user);

    const paymentInfo =
        await getPaymentInfoBySchoolSlugRepo(
            schoolSlug,
        );

    if (!paymentInfo) {
        throw new Error(
            "Payment information not found",
        );
    }

    if (paymentInfo.isActive) {
        throw new Error(
            "Payment information is already active",
        );
    }

    const restoredPaymentInfo =
        await restorePaymentInfoRepo(schoolSlug);

    return formatPaymentInfo(restoredPaymentInfo);
};