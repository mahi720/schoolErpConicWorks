import crypto from "crypto";

import {
    findBoardByTitleRepo,
    findFeeTypeByNameRepo,
    createFeeTypeRepo,
    getFeeTypesRepo,
    getFeeTypeBySlugRepo,
    updateFeeTypeRepo,
    deleteFeeTypeRepo,
    restoreFeeTypeRepo,
} from "../../../repositories/master/feeType/feeType.repository.js";

const generateSlug = () => crypto.randomUUID();

const formatFeeType = (item) => {
    return {
        id: item.id,
        slug: item.slug,

        schoolSlug: item.schoolSlug,

        boardSlug: item.boardSlug,
        board: item.board?.title || null,

        feeType: item.feeType,
        description: item.description,

        status: item.status,
        isActive: item.isActive,
        deletedAt: item.deletedAt,

        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
};

export const createFeeTypeService = async (
    body,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user"
        );
    }

    const boardTitle = body.board.trim();
    const feeTypeName = body.feeType.trim();

    const boardData = await findBoardByTitleRepo(
        schoolSlug,
        boardTitle
    );

    if (!boardData) {
        throw new Error(
            "Board not found or inactive"
        );
    }

    const existingFeeType =
        await findFeeTypeByNameRepo({
            schoolSlug,
            boardSlug: boardData.slug,
            feeType: feeTypeName,
        });

    if (existingFeeType) {
        if (!existingFeeType.isActive) {
            throw new Error(
                "Fee type already exists but is inactive. Please restore it."
            );
        }

        throw new Error(
            "Fee type already exists for this board"
        );
    }

    const feeType = await createFeeTypeRepo({
        slug: generateSlug(),
        schoolSlug,
        boardSlug: boardData.slug,

        feeType: feeTypeName,

        description:
            body.description?.trim() || null,

        status: body.status || "active",

        isActive:
            body.status !== "inactive",

        deletedAt:
            body.status === "inactive"
                ? new Date()
                : null,
    });

    return formatFeeType(feeType);
};

export const getFeeTypesService = async (
    query,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user"
        );
    }

    if (!query.board?.trim()) {
        throw new Error("Board is required");
    }

    const boardData = await findBoardByTitleRepo(
        schoolSlug,
        query.board.trim()
    );

    if (!boardData) {
        throw new Error(
            "Board not found or inactive"
        );
    }

    const feeTypes = await getFeeTypesRepo({
        schoolSlug,
        boardSlug: boardData.slug,
        status: query.status || "all",
    });

    return feeTypes.map(formatFeeType);
};

export const getFeeTypeBySlugService = async (
    slug,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user"
        );
    }

    const feeType = await getFeeTypeBySlugRepo(
        slug,
        schoolSlug,
        true
    );

    if (!feeType) {
        throw new Error("Fee type not found");
    }

    return formatFeeType(feeType);
};

export const updateFeeTypeService = async (
    slug,
    body,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user"
        );
    }

    const existingFeeType =
        await getFeeTypeBySlugRepo(
            slug,
            schoolSlug,
            false
        );

    if (!existingFeeType) {
        throw new Error(
            "Active fee type not found"
        );
    }

    const updateData = {};

    let finalBoardSlug =
        existingFeeType.boardSlug;

    if (body.board !== undefined) {
        const boardData =
            await findBoardByTitleRepo(
                schoolSlug,
                body.board.trim()
            );

        if (!boardData) {
            throw new Error(
                "Board not found or inactive"
            );
        }

        finalBoardSlug = boardData.slug;
        updateData.boardSlug = boardData.slug;
    }

    const finalFeeTypeName =
        body.feeType !== undefined
            ? body.feeType.trim()
            : existingFeeType.feeType;

    if (
        finalFeeTypeName !==
        existingFeeType.feeType ||
        finalBoardSlug !==
        existingFeeType.boardSlug
    ) {
        const duplicate =
            await findFeeTypeByNameRepo({
                schoolSlug,
                boardSlug: finalBoardSlug,
                feeType: finalFeeTypeName,
                excludeSlug: slug,
            });

        if (duplicate) {
            throw new Error(
                "Fee type already exists for this board"
            );
        }
    }

    if (body.feeType !== undefined) {
        updateData.feeType =
            finalFeeTypeName;
    }

    if (body.description !== undefined) {
        updateData.description =
            body.description?.trim() || null;
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

    const updatedFeeType =
        await updateFeeTypeRepo(
            slug,
            updateData
        );

    return formatFeeType(updatedFeeType);
};

export const deleteFeeTypeService = async (
    slug,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user"
        );
    }

    const feeType = await getFeeTypeBySlugRepo(
        slug,
        schoolSlug,
        false
    );

    if (!feeType) {
        throw new Error(
            "Active fee type not found"
        );
    }

    const deletedFeeType =
        await deleteFeeTypeRepo(slug);

    return formatFeeType(deletedFeeType);
};

export const restoreFeeTypeService = async (
    slug,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user"
        );
    }

    const feeType = await getFeeTypeBySlugRepo(
        slug,
        schoolSlug,
        true
    );

    if (!feeType) {
        throw new Error("Fee type not found");
    }

    if (
        feeType.isActive &&
        feeType.deletedAt === null
    ) {
        throw new Error(
            "Fee type is already active"
        );
    }

    const duplicate =
        await findFeeTypeByNameRepo({
            schoolSlug,
            boardSlug: feeType.boardSlug,
            feeType: feeType.feeType,
            excludeSlug: slug,
        });

    if (duplicate?.isActive) {
        throw new Error(
            "An active fee type with the same name already exists"
        );
    }

    const restoredFeeType =
        await restoreFeeTypeRepo(slug);

    return formatFeeType(restoredFeeType);
};