import { randomUUID } from "crypto";

import {
    findSessionByNameRepo,
    findBoardByTitleRepo,
    findClassByTitleRepo,
    getClassSectionStreamMappingsRepo,
    findClassSectionStreamMappingRepo,
    getSectionsBySlugsRepo,
    getStreamsBySlugsRepo,
    findSectionBySlugRepo,
    findStreamBySlugRepo,
    getStudentsByCurrentAcademicDetailsRepo,
    findStudentsBySlugsRepo,
    findStudentMappingByStudentAndSessionRepo,
    findRollNumberMappingRepo,
    createStudentAcademicMappingsRepo,
    restoreAndUpdateStudentMappingRepo,
    getMappedStudentsRepo,
    getStudentAcademicMappingBySlugRepo,
    updateStudentAcademicMappingRepo,
    softDeleteStudentAcademicMappingRepo,
    restoreStudentAcademicMappingRepo,
} from "../../../repositories/academic/studentAcademicMapping/studentAcademicMapping.repository.js";

/*
|--------------------------------------------------------------------------
| Common Helpers
|--------------------------------------------------------------------------
*/

const getSchoolSlug = (authUser) => {
    const schoolSlug = authUser?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for logged-in user");
    }

    return schoolSlug;
};

const parseJsonSlugArray = (value) => {
    if (Array.isArray(value)) {
        return value.filter(Boolean);
    }

    if (typeof value === "string") {
        try {
            const parsedValue = JSON.parse(value);

            return Array.isArray(parsedValue)
                ? parsedValue.filter(Boolean)
                : [];
        } catch {
            return [];
        }
    }

    return [];
};

const getSectionLabel = (section) => {
    return (
        section?.sectionName ||
        section?.title ||
        section?.name ||
        section?.sectionTitle ||
        "-"
    );
};

const getStreamLabel = (stream) => {
    return (
        stream?.streamName ||
        stream?.title ||
        stream?.name ||
        stream?.streamTitle ||
        "-"
    );
};

const normalizeSection = (section) => ({
    slug: section.slug,
    title: getSectionLabel(section),
    sectionName: getSectionLabel(section),
});

const normalizeStream = (stream) => ({
    slug: stream.slug,
    title: getStreamLabel(stream),
    streamName: getStreamLabel(stream),
});

const resolveAcademicSelection = async ({
    schoolSlug,
    session,
    board,
    classTitle,
}) => {
    const sessionData = await findSessionByNameRepo({
        schoolSlug,
        sessionName: session,
    });

    if (!sessionData) {
        throw new Error("Selected session not found");
    }

    const boardData = await findBoardByTitleRepo({
        schoolSlug,
        boardTitle: board,
    });

    if (!boardData) {
        throw new Error("Selected board not found");
    }

    const classData = await findClassByTitleRepo({
        schoolSlug,
        boardSlug: boardData.slug,
        classTitle,
    });

    if (!classData) {
        throw new Error(
            "Selected class is not available for this board",
        );
    }

    /*
     * Session validation Class table se nahi,
     * ClassSectionStreamMapping table se hogi.
     */

    const classMapping =
        await findClassSectionStreamMappingRepo({
            schoolSlug,
            sessionSlug: sessionData.slug,
            boardSlug: boardData.slug,
            classSlug: classData.slug,
        });

    if (!classMapping) {
        throw new Error(
            "Selected class is not configured for this session and board",
        );
    }

    return {
        sessionData,
        boardData,
        classData,
        classMapping,
    };
};

/*
|--------------------------------------------------------------------------
| Dropdown Setup Service
|--------------------------------------------------------------------------
|
| ClassSectionStreamMapping table se:
| - Board
| - Class
| - Sections
| - Streams
|
*/

export const getAcademicMappingSetupService = async (
    query,
    authUser,
) => {
    const schoolSlug = getSchoolSlug(authUser);
    const { session } = query;

    if (!session?.trim()) {
        throw new Error("Session is required");
    }

    const sessionData = await findSessionByNameRepo({
        schoolSlug,
        sessionName: session.trim(),
    });

    if (!sessionData) {
        throw new Error("Selected session not found");
    }

    const classMappings =
        await getClassSectionStreamMappingsRepo({
            schoolSlug,
            sessionSlug: sessionData.slug,
        });

    if (!classMappings.length) {
        return {
            session: {
                slug: sessionData.slug,
                name: sessionData.name,
            },
            boards: [],
        };
    }

    const allSectionSlugs = [
        ...new Set(
            classMappings.flatMap((mapping) =>
                parseJsonSlugArray(mapping.sectionSlugs),
            ),
        ),
    ];

    const allStreamSlugs = [
        ...new Set(
            classMappings.flatMap((mapping) =>
                parseJsonSlugArray(mapping.streamSlugs),
            ),
        ),
    ];

    const [sections, streams] = await Promise.all([
        getSectionsBySlugsRepo({
            schoolSlug,
            sectionSlugs: allSectionSlugs,
        }),

        getStreamsBySlugsRepo({
            schoolSlug,
            streamSlugs: allStreamSlugs,
        }),
    ]);

    const sectionMap = new Map(
        sections.map((section) => [
            section.slug,
            normalizeSection(section),
        ]),
    );

    const streamMap = new Map(
        streams.map((stream) => [
            stream.slug,
            normalizeStream(stream),
        ]),
    );

    const boardMap = new Map();

    classMappings.forEach((mapping) => {
        const boardSlug = mapping.board.slug;

        if (!boardMap.has(boardSlug)) {
            boardMap.set(boardSlug, {
                slug: mapping.board.slug,
                title: mapping.board.title,
                classes: [],
            });
        }

        const sectionSlugs = parseJsonSlugArray(
            mapping.sectionSlugs,
        );

        const streamSlugs = parseJsonSlugArray(
            mapping.streamSlugs,
        );

        boardMap.get(boardSlug).classes.push({
            mappingSlug: mapping.slug,

            slug: mapping.class.slug,
            classTitle: mapping.class.classTitle,
            classType: mapping.class.classType,

            sections: sectionSlugs
                .map((slug) => sectionMap.get(slug))
                .filter(Boolean),

            streams: streamSlugs
                .map((slug) => streamMap.get(slug))
                .filter(Boolean),

            timing: {
                startTime: mapping.startTime,
                endTime: mapping.endTime,
                periodDuration: mapping.periodDuration,
                breakTime: mapping.breakTime,
                breakDuration: mapping.breakDuration,
            },
        });
    });

    return {
        session: {
            slug: sessionData.slug,
            name: sessionData.name,
        },

        boards: Array.from(boardMap.values()),
    };
};

/*
|--------------------------------------------------------------------------
| Before Mapping Student Service
|--------------------------------------------------------------------------
|
| Student table se students aayenge.
| Sirf unmapped students return honge.
|
*/

export const getUnmappedStudentsService = async (
    query,
    authUser,
) => {
    const schoolSlug = getSchoolSlug(authUser);

    const {
        session,
        board,
        classTitle,
    } = query;

    if (!session?.trim()) {
        throw new Error("Session is required");
    }

    if (!board?.trim()) {
        throw new Error("Board is required");
    }

    if (!classTitle?.trim()) {
        throw new Error("Class is required");
    }

    const {
        sessionData,
        boardData,
        classData,
        classMapping,
    } = await resolveAcademicSelection({
        schoolSlug,
        session: session.trim(),
        board: board.trim(),
        classTitle: classTitle.trim(),
    });

    if (!classMapping) {
        throw new Error(
            "Selected class has no section and stream configuration",
        );
    }

    const students =
        await getStudentsByCurrentAcademicDetailsRepo({
            schoolSlug,
            sessionSlug: sessionData.slug,
            boardSlug: boardData.slug,
            classSlug: classData.slug,
        });

    const studentMappingChecks = await Promise.all(
        students.map(async (student) => {
            const existingMapping =
                await findStudentMappingByStudentAndSessionRepo({
                    schoolSlug,
                    studentSlug:
                        student.slug,
                    sessionSlug:
                        sessionData.slug,
                });

            return {
                student,
                existingMapping,
            };
        }),
    );

    const unmappedStudents = studentMappingChecks
        .filter(({ existingMapping }) => !existingMapping)
        .map(({ student }) => ({
            ...student,
            isMapped: false,
            academicMapping: null,
        }));

    return {
        academic: {
            session: {
                slug: sessionData.slug,
                name: sessionData.name,
            },

            board: {
                slug: boardData.slug,
                title: boardData.title,
            },

            class: {
                slug: classData.slug,
                classTitle: classData.classTitle,
                classType: classData.classType,
            },
        },

        totalStudents: unmappedStudents.length,

        students: unmappedStudents,
    };
};

/*
|--------------------------------------------------------------------------
| Create / Bulk Mapping Service
|--------------------------------------------------------------------------
*/

export const createStudentAcademicMappingService = async (
    payload,
    authUser,
) => {
    const schoolSlug =
        getSchoolSlug(authUser);

    const {
        session,
        board,
        classTitle,
        sectionSlug,
        streamSlug,
        rollNumberPrefix,
        rollNumberStartFrom,
        students,
    } = payload;

    /*
    |--------------------------------------------------------------------------
    | Resolve Academic Selection
    |--------------------------------------------------------------------------
    */

    const {
        sessionData,
        boardData,
        classData,
        classMapping,
    } = await resolveAcademicSelection({
        schoolSlug,
        session,
        board,
        classTitle,
    });

    if (!classMapping) {
        throw new Error(
            "Selected class has no section and stream configuration",
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Allowed Sections And Streams
    |--------------------------------------------------------------------------
    */

    const allowedSectionSlugs =
        parseJsonSlugArray(
            classMapping.sectionSlugs,
        );

    const allowedStreamSlugs =
        parseJsonSlugArray(
            classMapping.streamSlugs,
        );

    let selectedSection = null;
    let selectedStream = null;

    /*
    |--------------------------------------------------------------------------
    | Resolve Section
    |--------------------------------------------------------------------------
    */

    if (sectionSlug) {
        selectedSection =
            await findSectionBySlugRepo({
                schoolSlug,
                sectionSlug,
            });

        if (!selectedSection) {
            throw new Error(
                "Selected section not found",
            );
        }

        if (
            !allowedSectionSlugs.includes(
                selectedSection.slug,
            )
        ) {
            throw new Error(
                "Selected section is not mapped with this class",
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Resolve Stream
    |--------------------------------------------------------------------------
    */

    if (streamSlug) {
        selectedStream =
            await findStreamBySlugRepo({
                schoolSlug,
                streamSlug,
            });

        if (!selectedStream) {
            throw new Error(
                "Selected stream not found",
            );
        }

        if (
            !allowedStreamSlugs.includes(
                selectedStream.slug,
            )
        ) {
            throw new Error(
                "Selected stream is not mapped with this class",
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Unique Selected Students
    |--------------------------------------------------------------------------
    */

    const uniqueStudentSlugs = [
        ...new Set(
            students.map(
                (student) =>
                    student.studentSlug,
            ),
        ),
    ];

    if (
        uniqueStudentSlugs.length !==
        students.length
    ) {
        throw new Error(
            "Same student cannot be selected multiple times",
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Students
    |--------------------------------------------------------------------------
    */

    const availableStudents =
        await findStudentsBySlugsRepo({
            schoolSlug,
            sessionSlug:
                sessionData.slug,
            boardSlug:
                boardData.slug,
            classSlug:
                classData.slug,
            studentSlugs:
                uniqueStudentSlugs,
        });

    if (
        availableStudents.length !==
        uniqueStudentSlugs.length
    ) {
        throw new Error(
            "One or more students do not belong to the selected session, board and class",
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Prepare Roll Numbers
    |--------------------------------------------------------------------------
    */

    const finalStudentMappings =
        students.map(
            (student, index) => {
                let finalRollNumber =
                    student.rollNumber;

                if (
                    finalRollNumber ===
                    undefined &&
                    rollNumberStartFrom !==
                    undefined
                ) {
                    finalRollNumber =
                        Number(
                            rollNumberStartFrom,
                        ) + index;
                }

                return {
                    studentSlug:
                        student.studentSlug,

                    rollNumber:
                        finalRollNumber ??
                        null,
                };
            },
        );

    /*
    |--------------------------------------------------------------------------
    | Duplicate Roll Numbers Inside Request
    |--------------------------------------------------------------------------
    */

    const assignedRollNumbers =
        finalStudentMappings
            .map(
                (item) =>
                    item.rollNumber,
            )
            .filter(
                (rollNumber) =>
                    rollNumber !== null,
            );

    if (
        assignedRollNumbers.length !==
        new Set(
            assignedRollNumbers,
        ).size
    ) {
        throw new Error(
            "Duplicate roll numbers found in selected students",
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Create, Update Or Restore
    |--------------------------------------------------------------------------
    */

    const updatedMappings = [];
    const restoredMappings = [];
    const newMappings = [];

    for (
        const studentItem of
        finalStudentMappings
    ) {
        /*
         * Duplicate roll check
         */

        if (
            studentItem.rollNumber !==
            null
        ) {
            const rollNumberMapping =
                await findRollNumberMappingRepo(
                    {
                        schoolSlug,

                        sessionSlug:
                            sessionData.slug,

                        boardSlug:
                            boardData.slug,

                        classSlug:
                            classData.slug,

                        sectionSlug:
                            selectedSection?.slug ||
                            null,

                        rollNumber:
                            studentItem.rollNumber,
                    },
                );

            if (
                rollNumberMapping &&
                rollNumberMapping.studentSlug !==
                studentItem.studentSlug
            ) {
                throw new Error(
                    `Roll number ${studentItem.rollNumber} is already assigned`,
                );
            }
        }

        /*
         * Find existing mapping
         */

        const existingStudentMapping =
            await findStudentMappingByStudentAndSessionRepo({
                schoolSlug,
                studentSlug:
                    studentItem.studentSlug,
                sessionSlug:
                    sessionData.slug,
            });

        /*
         * Partial update data
         */

        const updateData = {};

        if (
            sectionSlug !==
            undefined
        ) {
            updateData.sectionSlug =
                selectedSection?.slug ||
                null;
        }

        if (
            streamSlug !==
            undefined
        ) {
            updateData.streamSlug =
                selectedStream?.slug ||
                null;
        }

        if (
            rollNumberPrefix !==
            undefined
        ) {
            updateData.rollNumberPrefix =
                rollNumberPrefix?.trim() ||
                null;
        }

        if (
            studentItem.rollNumber !==
            undefined &&
            studentItem.rollNumber !==
            null
        ) {
            updateData.rollNumber =
                studentItem.rollNumber;
        }

        /*
         * Existing active mapping
         */

        if (
            existingStudentMapping &&
            existingStudentMapping.isActive
        ) {
            const updatedMapping =
                await updateStudentAcademicMappingRepo(
                    {
                        slug:
                            existingStudentMapping.slug,

                        data: updateData,
                    },
                );

            updatedMappings.push(
                updatedMapping,
            );

            continue;
        }

        /*
         * Existing inactive mapping
         */

        if (
            existingStudentMapping &&
            !existingStudentMapping.isActive
        ) {
            const restoredMapping =
                await restoreAndUpdateStudentMappingRepo(
                    {
                        slug:
                            existingStudentMapping.slug,

                        data: updateData,
                    },
                );

            restoredMappings.push(
                restoredMapping,
            );

            continue;
        }

        /*
         * New mapping
         */

        newMappings.push({
            slug: randomUUID(),

            schoolSlug,

            studentSlug:
                studentItem.studentSlug,

            sessionSlug:
                sessionData.slug,

            boardSlug:
                boardData.slug,

            classSlug:
                classData.slug,

            sectionSlug:
                selectedSection?.slug ||
                null,

            streamSlug:
                selectedStream?.slug ||
                null,

            rollNumberPrefix:
                rollNumberPrefix?.trim() ||
                null,

            rollNumber:
                studentItem.rollNumber ??
                null,

            status: "active",
            isActive: true,
            deletedAt: null,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Create New Records
    |--------------------------------------------------------------------------
    */

    const createdMappings =
        newMappings.length > 0
            ? await createStudentAcademicMappingsRepo(
                {
                    mappings:
                        newMappings,
                },
            )
            : [];

    return {
        mappedCount:
            updatedMappings.length +
            restoredMappings.length +
            createdMappings.length,

        createdCount:
            createdMappings.length,

        updatedCount:
            updatedMappings.length,

        restoredCount:
            restoredMappings.length,

        session: {
            slug: sessionData.slug,
            name: sessionData.name,
        },

        board: {
            slug: boardData.slug,
            title: boardData.title,
        },

        class: {
            slug: classData.slug,
            classTitle:
                classData.classTitle,
            classType:
                classData.classType,
        },

        section: selectedSection
            ? normalizeSection(
                selectedSection,
            )
            : null,

        stream: selectedStream
            ? normalizeStream(
                selectedStream,
            )
            : null,
    };
};

/*
|--------------------------------------------------------------------------
| After Mapping Fetch Service
|--------------------------------------------------------------------------
|
| Data StudentAcademicRollSectionStreamMapping table se aayega.
| Student relation include rahega.
|
*/

export const getMappedStudentsService = async (
    query,
    authUser,
) => {
    const schoolSlug = getSchoolSlug(authUser);

    const {
        session,
        board,
        classTitle,
        sectionSlug,
        streamSlug,
        status = "active",
    } = query;

    let sessionSlug;
    let boardSlug;
    let classSlug;

    if (session || board || classTitle) {
        if (!session?.trim()) {
            throw new Error("Session is required");
        }

        if (!board?.trim()) {
            throw new Error("Board is required");
        }

        if (!classTitle?.trim()) {
            throw new Error("Class is required");
        }

        const resolvedAcademic =
            await resolveAcademicSelection({
                schoolSlug,
                session: session.trim(),
                board: board.trim(),
                classTitle: classTitle.trim(),
            });

        sessionSlug = resolvedAcademic.sessionData.slug;
        boardSlug = resolvedAcademic.boardData.slug;
        classSlug = resolvedAcademic.classData.slug;
    }

    const mappings = await getMappedStudentsRepo({
        schoolSlug,
        sessionSlug,
        boardSlug,
        classSlug,
        sectionSlug,
        streamSlug,
        status,
    });

    return mappings.map((mapping) => ({
        id: mapping.id,
        slug: mapping.slug,

        studentSlug: mapping.studentSlug,
        sessionSlug: mapping.sessionSlug,
        boardSlug: mapping.boardSlug,
        classSlug: mapping.classSlug,
        sectionSlug: mapping.sectionSlug,
        streamSlug: mapping.streamSlug,

        rollNumberPrefix: mapping.rollNumberPrefix,
        rollNumber: mapping.rollNumber,

        formattedRollNumber: mapping.rollNumber
            ? `${mapping.rollNumberPrefix || ""}${mapping.rollNumber}`
            : null,

        status: mapping.status,
        isActive: mapping.isActive,
        deletedAt: mapping.deletedAt,
        createdAt: mapping.createdAt,
        updatedAt: mapping.updatedAt,

        student: mapping.student,

        session: mapping.session,

        board: mapping.board,

        class: mapping.class,

        section: mapping.section
            ? normalizeSection(mapping.section)
            : null,

        stream: mapping.stream
            ? normalizeStream(mapping.stream)
            : null,
    }));
};

/*
|--------------------------------------------------------------------------
| Get Mapping By Slug Service
|--------------------------------------------------------------------------
*/

export const getStudentAcademicMappingBySlugService = async (
    slug,
    authUser,
) => {
    const schoolSlug = getSchoolSlug(authUser);

    const mapping =
        await getStudentAcademicMappingBySlugRepo({
            schoolSlug,
            slug,
        });

    if (!mapping) {
        throw new Error("Student academic mapping not found");
    }

    return {
        ...mapping,

        formattedRollNumber: mapping.rollNumber
            ? `${mapping.rollNumberPrefix || ""}${mapping.rollNumber}`
            : null,

        section: mapping.section
            ? normalizeSection(mapping.section)
            : null,

        stream: mapping.stream
            ? normalizeStream(mapping.stream)
            : null,
    };
};

/*
|--------------------------------------------------------------------------
| Update Mapping Service
|--------------------------------------------------------------------------
*/

export const updateStudentAcademicMappingService = async (
    slug,
    payload,
    authUser,
) => {
    const schoolSlug = getSchoolSlug(authUser);

    const existingMapping =
        await getStudentAcademicMappingBySlugRepo({
            schoolSlug,
            slug,
        });

    if (!existingMapping) {
        throw new Error("Student academic mapping not found");
    }

    const classMapping =
        await findClassSectionStreamMappingRepo({
            schoolSlug,
            sessionSlug: existingMapping.sessionSlug,
            boardSlug: existingMapping.boardSlug,
            classSlug: existingMapping.classSlug,
        });

    if (!classMapping) {
        throw new Error(
            "Class section and stream configuration not found",
        );
    }

    const allowedSectionSlugs = parseJsonSlugArray(
        classMapping.sectionSlugs,
    );

    const allowedStreamSlugs = parseJsonSlugArray(
        classMapping.streamSlugs,
    );

    let finalSectionSlug = existingMapping.sectionSlug;
    let finalStreamSlug = existingMapping.streamSlug;
    let finalRollNumber = existingMapping.rollNumber;

    if (payload.sectionSlug !== undefined) {
        if (payload.sectionSlug === null) {
            finalSectionSlug = null;
        } else {
            const section = await findSectionBySlugRepo({
                schoolSlug,
                sectionSlug: payload.sectionSlug,
            });

            if (!section) {
                throw new Error("Selected section not found");
            }

            if (!allowedSectionSlugs.includes(section.slug)) {
                throw new Error(
                    "Selected section is not mapped with this class",
                );
            }

            finalSectionSlug = section.slug;
        }
    }

    if (payload.streamSlug !== undefined) {
        if (payload.streamSlug === null) {
            finalStreamSlug = null;
        } else {
            const stream = await findStreamBySlugRepo({
                schoolSlug,
                streamSlug: payload.streamSlug,
            });

            if (!stream) {
                throw new Error("Selected stream not found");
            }

            if (!allowedStreamSlugs.includes(stream.slug)) {
                throw new Error(
                    "Selected stream is not mapped with this class",
                );
            }

            finalStreamSlug = stream.slug;
        }
    }

    if (payload.rollNumber !== undefined) {
        finalRollNumber = payload.rollNumber;
    }

    if (finalRollNumber !== null) {
        const duplicateRollMapping =
            await findRollNumberMappingRepo({
                schoolSlug,
                sessionSlug: existingMapping.sessionSlug,
                boardSlug: existingMapping.boardSlug,
                classSlug: existingMapping.classSlug,
                sectionSlug: finalSectionSlug,
                rollNumber: finalRollNumber,
                excludeSlug: existingMapping.slug,
            });

        if (duplicateRollMapping) {
            throw new Error(
                `Roll number ${finalRollNumber} is already assigned`,
            );
        }
    }

    return updateStudentAcademicMappingRepo({
        slug,
        data: {
            ...(payload.sectionSlug !== undefined && {
                sectionSlug: finalSectionSlug,
            }),

            ...(payload.streamSlug !== undefined && {
                streamSlug: finalStreamSlug,
            }),

            ...(payload.rollNumberPrefix !== undefined && {
                rollNumberPrefix:
                    payload.rollNumberPrefix?.trim() || null,
            }),

            ...(payload.rollNumber !== undefined && {
                rollNumber: finalRollNumber,
            }),
        },
    });
};

/*
|--------------------------------------------------------------------------
| Soft Delete Mapping Service
|--------------------------------------------------------------------------
*/

export const deleteStudentAcademicMappingService = async (
    slug,
    authUser,
) => {
    const schoolSlug = getSchoolSlug(authUser);

    const mapping =
        await getStudentAcademicMappingBySlugRepo({
            schoolSlug,
            slug,
        });

    if (!mapping) {
        throw new Error("Student academic mapping not found");
    }

    if (!mapping.isActive) {
        throw new Error(
            "Student academic mapping is already inactive",
        );
    }

    return softDeleteStudentAcademicMappingRepo({
        slug,
    });
};

/*
|--------------------------------------------------------------------------
| Restore Mapping Service
|--------------------------------------------------------------------------
*/

export const restoreStudentAcademicMappingService = async (
    slug,
    authUser,
) => {
    const schoolSlug = getSchoolSlug(authUser);

    const mapping =
        await getStudentAcademicMappingBySlugRepo({
            schoolSlug,
            slug,
        });

    if (!mapping) {
        throw new Error("Student academic mapping not found");
    }

    if (mapping.isActive) {
        throw new Error(
            "Student academic mapping is already active",
        );
    }

    if (mapping.rollNumber !== null) {
        const duplicateRollMapping =
            await findRollNumberMappingRepo({
                schoolSlug,
                sessionSlug: mapping.sessionSlug,
                boardSlug: mapping.boardSlug,
                classSlug: mapping.classSlug,
                sectionSlug: mapping.sectionSlug,
                rollNumber: mapping.rollNumber,
                excludeSlug: mapping.slug,
            });

        if (
            duplicateRollMapping &&
            duplicateRollMapping.isActive
        ) {
            throw new Error(
                `Roll number ${mapping.rollNumber} is already assigned`,
            );
        }
    }

    return restoreStudentAcademicMappingRepo({
        slug,
    });
};