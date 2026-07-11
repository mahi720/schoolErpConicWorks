import crypto from "crypto";

import {
    findAddedSubjectToClassBySlugRepo,
    findDuplicateSubjectTopicRepo,
    createSubjectTopicRepo,
    getSubjectTopicsRepo,
    getSubjectTopicBySlugRepo,
    updateSubjectTopicRepo,
    deleteSubjectTopicRepo,
    restoreSubjectTopicRepo,
} from "../../../repositories/master/createTopicInSubject/subjectTopic.repository.js";

const generateSlug = () => crypto.randomUUID();

const formatSubjectTopic = (item) => {
    const mapping = item.addedSubjectToClass;

    return {
        id: item.id,
        slug: item.slug,

        addedSubjectToClassSlug: item.addedSubjectToClassSlug,

        session: mapping?.session?.name || null,
        board: mapping?.board?.title || null,

        classSlug: mapping?.class?.slug || mapping?.classSlug || null,
        classTitle: mapping?.class?.classTitle || null,
        classType: mapping?.class?.classType || null,

        streamSlug: mapping?.stream?.slug || mapping?.streamSlug || null,
        stream: mapping?.stream?.streamTitle || null,

        subjectSlug: mapping?.subject?.slug || mapping?.subjectSlug || null,
        subjectTitle: mapping?.subject?.subjectTitle || null,
        subjectType: mapping?.subject?.subjectType || null,
        subjectOrder: mapping?.subject?.subjectOrder || null,

        studyType: mapping?.studyType || null,

        topicTitle: item.topicTitle,
        topicGroup: item.topicGroup,

        status: item.status,
        isActive: item.isActive,
        deletedAt: item.deletedAt,

        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
};

export const createSubjectTopicService = async (body, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const addedSubjectToClassSlug =
        body.addedSubjectToClassSlug.trim();

    const topicTitle = body.topicTitle.trim();
    const topicGroup = body.topicGroup.trim();

    const classSubjectMapping =
        await findAddedSubjectToClassBySlugRepo(
            addedSubjectToClassSlug,
            schoolSlug
        );

    if (!classSubjectMapping) {
        throw new Error("Mapped class subject not found");
    }

    const duplicateTopic = await findDuplicateSubjectTopicRepo({
        addedSubjectToClassSlug,
        topicTitle,
        topicGroup,
    });

    if (duplicateTopic) {
        if (!duplicateTopic.isActive) {
            throw new Error(
                "This topic already exists but is inactive. Please restore it."
            );
        }

        throw new Error(
            "Topic already exists in this topic group"
        );
    }

    const topic = await createSubjectTopicRepo({
        slug: generateSlug(),
        addedSubjectToClassSlug,
        topicTitle,
        topicGroup,
        status: body.status || "active",
        isActive: body.status !== "inactive",
        deletedAt:
            body.status === "inactive" ? new Date() : null,
    });

    return formatSubjectTopic(topic);
};

export const getSubjectTopicsService = async (query, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const addedSubjectToClassSlug =
        query.addedSubjectToClassSlug?.trim();

    if (!addedSubjectToClassSlug) {
        throw new Error("Mapped class subject is required");
    }

    const classSubjectMapping =
        await findAddedSubjectToClassBySlugRepo(
            addedSubjectToClassSlug,
            schoolSlug
        );

    if (!classSubjectMapping) {
        throw new Error("Mapped class subject not found");
    }

    const topics = await getSubjectTopicsRepo({
        schoolSlug,
        addedSubjectToClassSlug,
        status: query.status || "all",
    });

    return topics.map(formatSubjectTopic);
};

export const getSubjectTopicBySlugService = async (
    slug,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const topic = await getSubjectTopicBySlugRepo(
        slug,
        schoolSlug,
        true
    );

    if (!topic) {
        throw new Error("Subject topic not found");
    }

    return formatSubjectTopic(topic);
};

export const updateSubjectTopicService = async (
    slug,
    body,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const existingTopic = await getSubjectTopicBySlugRepo(
        slug,
        schoolSlug,
        false
    );

    if (!existingTopic) {
        throw new Error("Active subject topic not found");
    }

    const topicTitle =
        body.topicTitle?.trim() || existingTopic.topicTitle;

    const topicGroup =
        body.topicGroup?.trim() || existingTopic.topicGroup;

    if (
        topicTitle !== existingTopic.topicTitle ||
        topicGroup !== existingTopic.topicGroup
    ) {
        const duplicateTopic =
            await findDuplicateSubjectTopicRepo({
                addedSubjectToClassSlug:
                    existingTopic.addedSubjectToClassSlug,
                topicTitle,
                topicGroup,
                excludeSlug: slug,
            });

        if (duplicateTopic) {
            throw new Error(
                "Topic already exists in this topic group"
            );
        }
    }

    const updateData = {};

    if (body.topicTitle !== undefined) {
        updateData.topicTitle = topicTitle;
    }

    if (body.topicGroup !== undefined) {
        updateData.topicGroup = topicGroup;
    }

    if (body.status !== undefined) {
        updateData.status = body.status;

        if (body.status === "inactive") {
            updateData.isActive = false;
            updateData.deletedAt = new Date();
        } else {
            updateData.isActive = true;
            updateData.deletedAt = null;
        }
    }

    const updatedTopic = await updateSubjectTopicRepo(
        slug,
        updateData
    );

    return formatSubjectTopic(updatedTopic);
};

export const deleteSubjectTopicService = async (
    slug,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const topic = await getSubjectTopicBySlugRepo(
        slug,
        schoolSlug,
        false
    );

    if (!topic) {
        throw new Error("Active subject topic not found");
    }

    const deletedTopic = await deleteSubjectTopicRepo(slug);

    return formatSubjectTopic(deletedTopic);
};

export const restoreSubjectTopicService = async (
    slug,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const topic = await getSubjectTopicBySlugRepo(
        slug,
        schoolSlug,
        true
    );

    if (!topic) {
        throw new Error("Subject topic not found");
    }

    if (topic.isActive && topic.deletedAt === null) {
        throw new Error("Subject topic is already active");
    }

    const duplicateActiveTopic =
        await findDuplicateSubjectTopicRepo({
            addedSubjectToClassSlug:
                topic.addedSubjectToClassSlug,
            topicTitle: topic.topicTitle,
            topicGroup: topic.topicGroup,
            excludeSlug: slug,
        });

    if (duplicateActiveTopic?.isActive) {
        throw new Error(
            "An active topic with the same title and group already exists"
        );
    }

    const restoredTopic =
        await restoreSubjectTopicRepo(slug);

    return formatSubjectTopic(restoredTopic);
};