import prisma from "../../../config/prisma.js";

const paymentInfoSelect = {
    id: true,
    slug: true,
    schoolSlug: true,

    primaryClientId: true,
    primaryMerchantId: true,
    primarySecretKey: true,

    otherClientId: true,
    otherMerchantId: true,
    otherSecretKey: true,

    status: true,
    isActive: true,
    deletedAt: true,

    createdAt: true,
    updatedAt: true,
};

export const createPaymentInfoRepo = async (data) => {
    return prisma.paymentInfo.create({
        data,
        select: paymentInfoSelect,
    });
};

export const getPaymentInfoBySchoolSlugRepo = async (
    schoolSlug,
) => {
    return prisma.paymentInfo.findUnique({
        where: {
            schoolSlug,
        },
        select: paymentInfoSelect,
    });
};

export const updatePaymentInfoRepo = async (
    schoolSlug,
    data,
) => {
    return prisma.paymentInfo.update({
        where: {
            schoolSlug,
        },
        data,
        select: paymentInfoSelect,
    });
};

export const deletePaymentInfoRepo = async (
    schoolSlug,
) => {
    return prisma.paymentInfo.update({
        where: {
            schoolSlug,
        },
        data: {
            status: "inactive",
            isActive: false,
            deletedAt: new Date(),
        },
        select: paymentInfoSelect,
    });
};

export const restorePaymentInfoRepo = async (
    schoolSlug,
) => {
    return prisma.paymentInfo.update({
        where: {
            schoolSlug,
        },
        data: {
            status: "active",
            isActive: true,
            deletedAt: null,
        },
        select: paymentInfoSelect,
    });
};