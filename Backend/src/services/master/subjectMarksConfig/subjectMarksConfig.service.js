import crypto from "crypto";

import {
    findAddedSubjectToClassBySlugRepo,
    findDuplicateMarksConfigRepo,
    createSubjectMarksConfigRepo,
    getSubjectMarksConfigsRepo,
    getSubjectMarksConfigBySlugRepo,
    updateSubjectMarksConfigRepo,
    deleteSubjectMarksConfigRepo,
    restoreSubjectMarksConfigRepo,
} from "../../../repositories/master/subjectMarksConfig/subjectMarksConfig.repository.js";

const generateSlug = () => crypto.randomUUID();

const formatMarksConfig = (item) => {
    const mapping = item.addedSubjectToClass;

    return {
        id: item.id,
        slug: item.slug,

        addedSubjectToClassSlug:
            item.addedSubjectToClassSlug,

        session: mapping?.session?.name || null,
        board: mapping?.board?.title || null,

        classSlug:
            mapping?.class?.slug ||
            mapping?.classSlug ||
            null,

        classTitle:
            mapping?.class?.classTitle || null,

        classType:
            mapping?.class?.classType || null,

        streamSlug:
            mapping?.stream?.slug ||
            mapping?.streamSlug ||
            null,

        stream:
            mapping?.stream?.streamTitle || null,

        subjectSlug:
            mapping?.subject?.slug ||
            mapping?.subjectSlug ||
            null,

        subjectTitle:
            mapping?.subject?.subjectTitle || null,

        subjectType:
            mapping?.subject?.subjectType || null,

        subjectOrder:
            mapping?.subject?.subjectOrder || null,

        studyType:
            mapping?.studyType || null,

        componentName: item.componentName,
        totalMarks: item.totalMarks,
        passingMarks: item.passingMarks,

        status: item.status,
        isActive: item.isActive,
        deletedAt: item.deletedAt,

        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
};

export const createSubjectMarksConfigService = async (
    body,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user"
        );
    }

    const addedSubjectToClassSlug =
        body.addedSubjectToClassSlug.trim();

    const componentName =
        body.componentName.trim();

    const totalMarks =
        Number(body.totalMarks);

    const passingMarks =
        body.passingMarks === undefined ||
            body.passingMarks === null ||
            body.passingMarks === ""
            ? null
            : Number(body.passingMarks);

    const classSubject =
        await findAddedSubjectToClassBySlugRepo(
            addedSubjectToClassSlug,
            schoolSlug
        );

    if (!classSubject) {
        throw new Error(
            "Mapped class subject not found"
        );
    }

    if (
        passingMarks !== null &&
        passingMarks > totalMarks
    ) {
        throw new Error(
            "Passing marks cannot be greater than total marks"
        );
    }

    const duplicate =
        await findDuplicateMarksConfigRepo({
            addedSubjectToClassSlug,
            componentName,
        });

    if (duplicate) {
        if (!duplicate.isActive) {
            throw new Error(
                "This marks component already exists but is inactive. Please restore it."
            );
        }

        throw new Error(
            "Marks component already exists for this subject"
        );
    }

    const marksConfig =
        await createSubjectMarksConfigRepo({
            slug: generateSlug(),
            addedSubjectToClassSlug,
            componentName,
            totalMarks,
            passingMarks,
            status: body.status || "active",
            isActive:
                body.status !== "inactive",
            deletedAt:
                body.status === "inactive"
                    ? new Date()
                    : null,
        });

    return formatMarksConfig(marksConfig);
};

export const getSubjectMarksConfigsService = async (
    query,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user"
        );
    }

    const addedSubjectToClassSlug =
        query.addedSubjectToClassSlug?.trim();

    if (!addedSubjectToClassSlug) {
        throw new Error(
            "Mapped class subject is required"
        );
    }

    const classSubject =
        await findAddedSubjectToClassBySlugRepo(
            addedSubjectToClassSlug,
            schoolSlug
        );

    if (!classSubject) {
        throw new Error(
            "Mapped class subject not found"
        );
    }

    const marksConfigs =
        await getSubjectMarksConfigsRepo({
            schoolSlug,
            addedSubjectToClassSlug,
            status: query.status || "all",
        });

    return marksConfigs.map(formatMarksConfig);
};

export const getSubjectMarksConfigBySlugService = async (
    slug,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user"
        );
    }

    const marksConfig =
        await getSubjectMarksConfigBySlugRepo(
            slug,
            schoolSlug,
            true
        );

    if (!marksConfig) {
        throw new Error(
            "Subject marks configuration not found"
        );
    }

    return formatMarksConfig(marksConfig);
};

export const updateSubjectMarksConfigService = async (
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

    const existingConfig =
        await getSubjectMarksConfigBySlugRepo(
            slug,
            schoolSlug,
            false
        );

    if (!existingConfig) {
        throw new Error(
            "Active subject marks configuration not found"
        );
    }

    const componentName =
        body.componentName?.trim() ||
        existingConfig.componentName;

    const totalMarks =
        body.totalMarks !== undefined
            ? Number(body.totalMarks)
            : existingConfig.totalMarks;

    let passingMarks =
        existingConfig.passingMarks;

    if (body.passingMarks !== undefined) {
        passingMarks =
            body.passingMarks === null ||
                body.passingMarks === ""
                ? null
                : Number(body.passingMarks);
    }

    if (
        passingMarks !== null &&
        passingMarks > totalMarks
    ) {
        throw new Error(
            "Passing marks cannot be greater than total marks"
        );
    }

    if (
        componentName !==
        existingConfig.componentName
    ) {
        const duplicate =
            await findDuplicateMarksConfigRepo({
                addedSubjectToClassSlug:
                    existingConfig.addedSubjectToClassSlug,
                componentName,
                excludeSlug: slug,
            });

        if (duplicate) {
            throw new Error(
                "Marks component already exists for this subject"
            );
        }
    }

    const updateData = {};

    if (body.componentName !== undefined) {
        updateData.componentName =
            componentName;
    }

    if (body.totalMarks !== undefined) {
        updateData.totalMarks =
            totalMarks;
    }

    if (body.passingMarks !== undefined) {
        updateData.passingMarks =
            passingMarks;
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

    const updatedConfig =
        await updateSubjectMarksConfigRepo(
            slug,
            updateData
        );

    return formatMarksConfig(updatedConfig);
};

export const deleteSubjectMarksConfigService = async (
    slug,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user"
        );
    }

    const marksConfig =
        await getSubjectMarksConfigBySlugRepo(
            slug,
            schoolSlug,
            false
        );

    if (!marksConfig) {
        throw new Error(
            "Active subject marks configuration not found"
        );
    }

    const deletedConfig =
        await deleteSubjectMarksConfigRepo(slug);

    return formatMarksConfig(deletedConfig);
};

export const restoreSubjectMarksConfigService = async (
    slug,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School not found for this user"
        );
    }

    const marksConfig =
        await getSubjectMarksConfigBySlugRepo(
            slug,
            schoolSlug,
            true
        );

    if (!marksConfig) {
        throw new Error(
            "Subject marks configuration not found"
        );
    }

    if (
        marksConfig.isActive &&
        marksConfig.deletedAt === null
    ) {
        throw new Error(
            "Subject marks configuration is already active"
        );
    }

    const duplicate =
        await findDuplicateMarksConfigRepo({
            addedSubjectToClassSlug:
                marksConfig.addedSubjectToClassSlug,
            componentName:
                marksConfig.componentName,
            excludeSlug: slug,
        });

    if (duplicate?.isActive) {
        throw new Error(
            "An active marks component with the same name already exists"
        );
    }

    const restoredConfig =
        await restoreSubjectMarksConfigRepo(slug);

    return formatMarksConfig(restoredConfig);
};