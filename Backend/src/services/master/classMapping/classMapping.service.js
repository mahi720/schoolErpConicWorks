import crypto from "crypto";
import {
    findSessionByNameRepo,
    findBoardByTitleRepo,
    findClassByTitleRepo,
    findSectionsByTitlesRepo,
    findStreamsByTitlesRepo,
    findTeachersByEmailsRepo,
    upsertClassMappingRepo,
    getClassMappingsRepo,
    findSectionsBySlugsRepo,
    findStreamsBySlugsRepo,
    findTeachersBySlugsRepo,
} from "../../../repositories/master/classMapping/classMapping.repository.js";

const generateSlug = () => crypto.randomUUID();

export const createClassMappingService = async (body, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) throw new Error("School not found for this user");

    const sessionName = body.session.trim();
    const boardTitle = body.board.trim();
    const classTitle = body.classTitle.trim();

    const sectionNames = body.sections || [];
    const streamNames = body.streams || [];
    const teacherEmails = body.classTeachers || [];

    const session = await findSessionByNameRepo(schoolSlug, sessionName);
    if (!session) throw new Error("Session not found");

    const board = await findBoardByTitleRepo(schoolSlug, boardTitle);
    if (!board) throw new Error("Board not found");

    const classData = await findClassByTitleRepo(
        schoolSlug,
        board.slug,
        classTitle
    );
    if (!classData) throw new Error("Class not found");

    const sections = sectionNames.length
        ? await findSectionsByTitlesRepo(schoolSlug, board.slug, sectionNames)
        : [];

    if (sectionNames.length && sections.length !== sectionNames.length) {
        throw new Error("One or more sections not found");
    }

    const streams = streamNames.length
        ? await findStreamsByTitlesRepo(schoolSlug, board.slug, streamNames)
        : [];

    if (streamNames.length && streams.length !== streamNames.length) {
        throw new Error("One or more streams not found");
    }

    const teachers = teacherEmails.length
        ? await findTeachersByEmailsRepo(schoolSlug, teacherEmails)
        : [];

    if (teacherEmails.length && teachers.length !== teacherEmails.length) {
        throw new Error("One or more teachers not found");
    }

    const hasSections =
        Array.isArray(body.sections) && body.sections.length > 0;

    const hasStreams =
        Array.isArray(body.streams) && body.streams.length > 0;

    const hasTeachers =
        Array.isArray(body.classTeachers) && body.classTeachers.length > 0;

    const data = {
        slug: generateSlug(),

        ...(hasSections && {
            sectionSlugs: sections.map((item) => item.slug),
        }),

        ...(hasStreams && {
            streamSlugs: streams.map((item) => item.slug),
        }),

        ...(hasTeachers && {
            classTeacherSlugs: teachers.map((item) => item.slug),
        }),

        ...(body.startTime !== undefined && {
            startTime: body.startTime || null,
        }),
        ...(body.endTime !== undefined && {
            endTime: body.endTime || null,
        }),
        ...(body.periodDuration !== undefined && {
            periodDuration: body.periodDuration || null,
        }),
        ...(body.breakTime !== undefined && {
            breakTime: body.breakTime || null,
        }),
        ...(body.breakDuration !== undefined && {
            breakDuration: body.breakDuration || null,
        }),

        status: body.status || "active",
    };

    return upsertClassMappingRepo({
        schoolSlug,
        sessionSlug: session.slug,
        boardSlug: board.slug,
        classSlug: classData.slug,
        data,
    });
};

export const getClassMappingsService = async (query, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) throw new Error("School not found for this user");
    if (!query.session) throw new Error("Session is required");
    if (!query.board) throw new Error("Board is required");

    const session = await findSessionByNameRepo(schoolSlug, query.session.trim());
    if (!session) throw new Error("Session not found");

    const board = await findBoardByTitleRepo(schoolSlug, query.board.trim());
    if (!board) throw new Error("Board not found");

    const mappings = await getClassMappingsRepo({
        schoolSlug,
        sessionSlug: session.slug,
        boardSlug: board.slug,
    });

    const resolvedData = [];

    for (const mapping of mappings) {
        const sectionSlugs = mapping.sectionSlugs || [];
        const streamSlugs = mapping.streamSlugs || [];
        const classTeacherSlugs = mapping.classTeacherSlugs || [];

        const sections = sectionSlugs.length
            ? await findSectionsBySlugsRepo(schoolSlug, sectionSlugs)
            : [];

        const streams = streamSlugs.length
            ? await findStreamsBySlugsRepo(schoolSlug, streamSlugs)
            : [];

        const teachers = classTeacherSlugs.length
            ? await findTeachersBySlugsRepo(schoolSlug, classTeacherSlugs)
            : [];

        resolvedData.push({
            slug: mapping.slug,

            session: mapping.session?.name,
            board: mapping.board?.title,

            classSlug: mapping.class?.slug,
            classTitle: mapping.class?.classTitle,
            classType: mapping.class?.classType,

            sectionSlugs,
            streamSlugs,
            classTeacherSlugs,

            sections: sections.map((item) => item.sectionTitle),
            streams: streams.map((item) => item.streamTitle),
            classTeachers: teachers.map((item) => ({
                name: item.name,
                email: item.email,
            })),

            startTime: mapping.startTime,
            endTime: mapping.endTime,
            status: mapping.status,
            isActive: mapping.isActive,
            createdAt: mapping.createdAt,
            updatedAt: mapping.updatedAt,
        });
    }

    return resolvedData;
};