import crypto from "crypto";

import {
    findSessionByNameRepo,
    findBoardByTitleRepo,
    findClassByTitleRepo,
    findStreamByTitleRepo,
    findSubjectsBySlugsRepo,
    findExistingClassSubjectRepo,
    createClassSubjectsRepo,
    getClassSubjectsRepo,
    getClassSubjectBySlugRepo,
    updateClassSubjectRepo,
    deleteClassSubjectRepo,
    getDeletedClassSubjectRepo,
    restoreClassSubjectRepo,
} from "../../../repositories/master/addSubjectToClass/addSubjectToClass.repository.js";

const generateSlug = () => crypto.randomUUID();

const normalizeClassTitle = (title = "") => {
    return title
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/standard|class|grade/g, "");
};

const isSeniorSecondaryClass = (classData) => {
    const normalizedTitle = normalizeClassTitle(classData?.classTitle);

    const seniorTitles = [
        "11",
        "11th",
        "xi",
        "12",
        "12th",
        "xii",
    ];

    return (
        classData?.classType?.toLowerCase() === "senior secondary" ||
        seniorTitles.includes(normalizedTitle)
    );
};

const formatClassSubject = (item) => ({
    slug: item.slug,

    session: item.session?.name,
    board: item.board?.title,

    classSlug: item.classSlug,
    classTitle: item.class?.classTitle,
    classType: item.class?.classType,

    streamSlug: item.streamSlug,
    stream: item.stream?.streamTitle || null,

    subjectSlug: item.subjectSlug,
    subjectTitle: item.subject?.subjectTitle,
    subjectType: item.subject?.subjectType,
    subjectOrder: item.subject?.subjectOrder,

    marksConfigs: item.marksConfigs || [],


    studyType: item.studyType,
    status: item.status,
    isActive: item.isActive,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
});

export const createClassSubjectsService = async (body, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const sessionName = body.session.trim();
    const boardTitle = body.board.trim();
    const classTitle = body.classTitle.trim();

    const sessionData = await findSessionByNameRepo(
        schoolSlug,
        sessionName
    );

    if (!sessionData) {
        throw new Error("Session not found");
    }

    const boardData = await findBoardByTitleRepo(
        schoolSlug,
        boardTitle
    );

    if (!boardData) {
        throw new Error("Board not found");
    }

    const classData = await findClassByTitleRepo({
        schoolSlug,
        boardSlug: boardData.slug,
        classTitle,
    });

    if (!classData) {
        throw new Error("Class not found");
    }

    const requiresStream = isSeniorSecondaryClass(classData);

    let streamData = null;

    if (requiresStream) {
        if (!body.stream?.trim()) {
            throw new Error("Stream is required for 11th and 12th class");
        }

        streamData = await findStreamByTitleRepo({
            schoolSlug,
            boardSlug: boardData.slug,
            streamTitle: body.stream.trim(),
        });

        if (!streamData) {
            throw new Error("Stream not found");
        }
    } else if (body.stream?.trim()) {
        streamData = await findStreamByTitleRepo({
            schoolSlug,
            boardSlug: boardData.slug,
            streamTitle: body.stream.trim(),
        });

        if (!streamData) {
            throw new Error("Stream not found");
        }
    }

    const uniqueSubjectSlugs = [...new Set(body.subjectSlugs)];

    const subjects = await findSubjectsBySlugsRepo({
        schoolSlug,
        boardSlug: boardData.slug,
        subjectSlugs: uniqueSubjectSlugs,
    });

    if (subjects.length !== uniqueSubjectSlugs.length) {
        throw new Error("One or more subjects not found for this board");
    }

    const rows = [];

    for (const subject of subjects) {
        const existingMapping = await findExistingClassSubjectRepo({
            schoolSlug,
            sessionSlug: sessionData.slug,
            boardSlug: boardData.slug,
            classSlug: classData.slug,
            streamSlug: streamData?.slug || null,
            subjectSlug: subject.slug,
        });

        if (existingMapping) {
            continue;
        }

        rows.push({
            slug: generateSlug(),
            schoolSlug,
            sessionSlug: sessionData.slug,
            boardSlug: boardData.slug,
            classSlug: classData.slug,
            streamSlug: streamData?.slug || null,
            subjectSlug: subject.slug,
            studyType: body.studyType,
            status: body.status || "active",
            isActive: true,
        });
    }

    if (!rows.length) {
        throw new Error("Selected subjects are already assigned to this class");
    }

    const createdMappings = await createClassSubjectsRepo(rows);

    return createdMappings.map(formatClassSubject);
};

export const getClassSubjectsService = async (query, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const sessionData = await findSessionByNameRepo(
        schoolSlug,
        query.session.trim()
    );

    if (!sessionData) {
        throw new Error("Session not found");
    }

    const boardData = await findBoardByTitleRepo(
        schoolSlug,
        query.board.trim()
    );

    if (!boardData) {
        throw new Error("Board not found");
    }

    const classData = await findClassByTitleRepo({
        schoolSlug,
        boardSlug: boardData.slug,
        classTitle: query.classTitle.trim(),
    });

    if (!classData) {
        throw new Error("Class not found");
    }

    let streamSlug;

    if (query.stream?.trim()) {
        const streamData = await findStreamByTitleRepo({
            schoolSlug,
            boardSlug: boardData.slug,
            streamTitle: query.stream.trim(),
        });

        if (!streamData) {
            return [];
        }

        streamSlug = streamData.slug;
    }

    const mappings = await getClassSubjectsRepo({
        schoolSlug,
        sessionSlug: sessionData.slug,
        boardSlug: boardData.slug,
        classSlug: classData.slug,
        streamSlug,
    });

    return mappings.map(formatClassSubject);
};

export const getClassSubjectBySlugService = async (slug, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const mapping = await getClassSubjectBySlugRepo(slug, schoolSlug);

    if (!mapping) {
        throw new Error("Class subject mapping not found");
    }

    return formatClassSubject(mapping);
};

export const updateClassSubjectService = async (
    slug,
    body,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const existingMapping = await getClassSubjectBySlugRepo(
        slug,
        schoolSlug
    );

    if (!existingMapping) {
        throw new Error("Class subject mapping not found");
    }

    const updateData = {};

    if (body.studyType) {
        updateData.studyType = body.studyType;
    }

    if (body.status) {
        updateData.status = body.status;
    }

    if (body.stream !== undefined) {
        if (body.stream?.trim()) {
            const streamData = await findStreamByTitleRepo({
                schoolSlug,
                boardSlug: existingMapping.boardSlug,
                streamTitle: body.stream.trim(),
            });

            if (!streamData) {
                throw new Error("Stream not found");
            }

            updateData.streamSlug = streamData.slug;
        } else {
            updateData.streamSlug = null;
        }
    }

    const updatedMapping = await updateClassSubjectRepo(
        existingMapping.id,
        updateData
    );

    return formatClassSubject(updatedMapping);
};

export const deleteClassSubjectService = async (slug, user) => {
    const schoolSlug = user?.schoolSlug;

    const mapping = await getClassSubjectBySlugRepo(slug, schoolSlug);

    if (!mapping) {
        throw new Error("Class subject mapping not found");
    }

    return deleteClassSubjectRepo(mapping.id);
};

export const restoreClassSubjectService = async (slug, user) => {
    const schoolSlug = user?.schoolSlug;

    const mapping = await getDeletedClassSubjectRepo(
        slug,
        schoolSlug
    );

    if (!mapping) {
        throw new Error("Deleted class subject mapping not found");
    }

    return restoreClassSubjectRepo(mapping.id);
};