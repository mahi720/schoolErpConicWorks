import crypto from "crypto";

import {
    findRemarkByTitleRepo,
    createRemarkRepo,
    getRemarksRepo,
    getRemarkBySlugRepo,
    updateRemarkRepo,
    deleteRemarkRepo,
    restoreRemarkRepo,
} from "../../../repositories/master/remark/remark.repository.js";

const generateSlug = () => crypto.randomUUID();

export const createRemarkService = async (
    body,
    user,
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user",
        );
    }

    const remarksTitle =
        body.remarksTitle.trim();

    const existingRemark =
        await findRemarkByTitleRepo({
            schoolSlug,
            remarksTitle,
        });

    if (existingRemark) {
        if (!existingRemark.isActive) {
            throw new Error(
                "Remark already exists but is inactive. Please restore it.",
            );
        }

        throw new Error(
            "Remark already exists",
        );
    }

    return createRemarkRepo({
        slug: generateSlug(),
        schoolSlug,
        remarksTitle,

        status:
            body.status || "active",

        isActive:
            body.status !== "inactive",

        deletedAt:
            body.status === "inactive"
                ? new Date()
                : null,
    });
};

export const getRemarksService = async (
    query,
    user,
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user",
        );
    }

    return getRemarksRepo({
        schoolSlug,
        status: query.status || "all",
    });
};

export const getRemarkBySlugService = async (
    slug,
    user,
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user",
        );
    }

    const remark =
        await getRemarkBySlugRepo(
            slug,
            schoolSlug,
            true,
        );

    if (!remark) {
        throw new Error("Remark not found");
    }

    return remark;
};

export const updateRemarkService = async (
    slug,
    body,
    user,
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user",
        );
    }

    const remark =
        await getRemarkBySlugRepo(
            slug,
            schoolSlug,
            false,
        );

    if (!remark) {
        throw new Error(
            "Active remark not found",
        );
    }

    const updateData = {};

    if (body.remarksTitle !== undefined) {
        const remarksTitle =
            body.remarksTitle.trim();

        if (
            remarksTitle !==
            remark.remarksTitle
        ) {
            const duplicate =
                await findRemarkByTitleRepo({
                    schoolSlug,
                    remarksTitle,
                    excludeSlug: slug,
                });

            if (duplicate) {
                throw new Error(
                    "Remark already exists",
                );
            }
        }

        updateData.remarksTitle =
            remarksTitle;
    }

    if (body.status !== undefined) {
        updateData.status = body.status;

        if (body.status === "inactive") {
            updateData.isActive = false;
            updateData.deletedAt =
                new Date();
        } else {
            updateData.isActive = true;
            updateData.deletedAt = null;
        }
    }

    return updateRemarkRepo(
        slug,
        updateData,
    );
};

export const deleteRemarkService = async (
    slug,
    user,
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user",
        );
    }

    const remark =
        await getRemarkBySlugRepo(
            slug,
            schoolSlug,
            false,
        );

    if (!remark) {
        throw new Error(
            "Active remark not found",
        );
    }

    return deleteRemarkRepo(slug);
};

export const restoreRemarkService = async (
    slug,
    user,
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user",
        );
    }

    const remark =
        await getRemarkBySlugRepo(
            slug,
            schoolSlug,
            true,
        );

    if (!remark) {
        throw new Error("Remark not found");
    }

    if (
        remark.isActive &&
        remark.deletedAt === null
    ) {
        throw new Error(
            "Remark is already active",
        );
    }

    const duplicate =
        await findRemarkByTitleRepo({
            schoolSlug,
            remarksTitle:
                remark.remarksTitle,
            excludeSlug: slug,
        });

    if (duplicate?.isActive) {
        throw new Error(
            "An active remark with the same title already exists",
        );
    }

    return restoreRemarkRepo(slug);
};