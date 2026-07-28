import { randomUUID } from "node:crypto";

import {
    findSchoolByCodeRepo,
    findSessionByNameRepo,
    findBoardByTitleRepo,
    findClassByTitleRepo,
    findSectionBySlugRepo,
    findStreamBySlugRepo,
    findStudentBySlugRepo,
    findCurrentAcademicMappingRepo,
    findAcademicMappingByStudentSessionRepo,
    findDuplicateRollNumberRepo,
    createAcademicMappingRepo,
    updateAcademicMappingRepo,
    updateStudentCurrentAcademicRepo,
    createStudentPromotionRepo,
    getStudentPromotionsRepo,
    getStudentPromotionBySlugRepo,
    getPromotionBatchRepo,
    updateStudentPromotionRepo,
    runPromotionTransactionRepo,
} from "../../../repositories/academic/studentPromotion/studentPromotion.repository.js";

const createBatchSlug = () => {
    return `PROMO-${Date.now()}-${randomUUID().slice(0, 8)}`;
};

const getOldAcademicStatus = (promotionType) => {
    if (promotionType === "DETAINED") {
        return "DETAINED";
    }

    if (promotionType === "REPEATED") {
        return "REPEATED";
    }

    return "PROMOTED";
};

const normalizeNullableValue = (value) => {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    return value;
};

const resolveSchool = async (user, client) => {
    if (user?.schoolSlug) {
        return {
            slug: user.schoolSlug,
            schoolCode: user.schoolCode || null,
        };
    }

    if (!user?.schoolCode) {
        throw new Error("School information not found for logged-in user");
    }

    const school = await findSchoolByCodeRepo(
        user.schoolCode,
        client,
    );

    if (!school) {
        throw new Error("School not found");
    }

    return school;
};

const resolveAcademicTarget = async (
    {
        schoolSlug,
        sessionName,
        boardTitle,
        classTitle,
        sectionSlug,
        streamSlug,
    },
    client,
) => {
    const session = await findSessionByNameRepo(
        schoolSlug,
        sessionName,
        client,
    );

    if (!session) {
        throw new Error(`Session "${sessionName}" not found`);
    }

    const board = await findBoardByTitleRepo(
        schoolSlug,
        boardTitle,
        client,
    );

    if (!board) {
        throw new Error(`Board "${boardTitle}" not found`);
    }

    const classData = await findClassByTitleRepo(
        schoolSlug,
        board.slug,
        classTitle,
        client,
    );

    if (!classData) {
        throw new Error(
            `Class "${classTitle}" not found for board "${boardTitle}"`,
        );
    }

    let section = null;

    if (sectionSlug) {
        section = await findSectionBySlugRepo(
            schoolSlug,
            board.slug,
            sectionSlug,
            client,
        );

        if (!section) {
            throw new Error("Selected section not found");
        }
    }

    let stream = null;

    if (streamSlug) {
        stream = await findStreamBySlugRepo(
            schoolSlug,
            board.slug,
            streamSlug,
            client,
        );

        if (!stream) {
            throw new Error("Selected stream not found");
        }
    }

    return {
        session,
        board,
        classData,
        section,
        stream,
    };
};

export const createStudentPromotionsService = async (
    payload,
    user,
) => {
    return runPromotionTransactionRepo(async (tx) => {
        const school = await resolveSchool(user, tx);

        const previousTarget = await resolveAcademicTarget(
            {
                schoolSlug: school.slug,
                sessionName: payload.previousSession,
                boardTitle: payload.previousBoard,
                classTitle: payload.previousClass,
                sectionSlug: normalizeNullableValue(
                    payload.previousSectionSlug,
                ),
                streamSlug: normalizeNullableValue(
                    payload.previousStreamSlug,
                ),
            },
            tx,
        );

        const defaultNewSectionSlug = normalizeNullableValue(
            payload.newSectionSlug,
        );

        const defaultNewStreamSlug = normalizeNullableValue(
            payload.newStreamSlug,
        );

        const newTarget = await resolveAcademicTarget(
            {
                schoolSlug: school.slug,
                sessionName: payload.newSession,
                boardTitle: payload.newBoard,
                classTitle: payload.newClass,
                sectionSlug: defaultNewSectionSlug,
                streamSlug: defaultNewStreamSlug,
            },
            tx,
        );

        if (
            previousTarget.session.slug ===
            newTarget.session.slug
        ) {
            throw new Error(
                "Previous session and new session cannot be the same",
            );
        }

        const duplicateStudentSlugs = payload.students
            .map((item) => item.studentSlug)
            .filter(
                (studentSlug, index, values) =>
                    values.indexOf(studentSlug) !== index,
            );

        if (duplicateStudentSlugs.length > 0) {
            throw new Error(
                "Duplicate students found in promotion request",
            );
        }

        const requestRollNumbers = new Set();

        for (const item of payload.students) {
            const itemSectionSlug =
                normalizeNullableValue(item.newSectionSlug) ??
                newTarget.section?.slug ??
                null;

            const itemRollNumber = normalizeNullableValue(
                item.newRollNumber,
            );

            if (itemRollNumber) {
                const rollKey = [
                    newTarget.session.slug,
                    newTarget.board.slug,
                    newTarget.classData.slug,
                    itemSectionSlug || "NO_SECTION",
                    itemRollNumber,
                ].join(":");

                if (requestRollNumbers.has(rollKey)) {
                    throw new Error(
                        `Roll number ${itemRollNumber} is repeated in the promotion request`,
                    );
                }

                requestRollNumbers.add(rollKey);
            }
        }

        const batchSlug = createBatchSlug();
        const createdPromotions = [];

        for (const item of payload.students) {
            const student = await findStudentBySlugRepo(
                school.slug,
                item.studentSlug,
                tx,
            );

            if (!student) {
                throw new Error(
                    `Student with slug "${item.studentSlug}" not found`,
                );
            }

            const previousMapping =
                await findCurrentAcademicMappingRepo(
                    {
                        schoolSlug: school.slug,
                        studentSlug: student.slug,
                        sessionSlug:
                            previousTarget.session.slug,
                        boardSlug: previousTarget.board.slug,
                        classSlug:
                            previousTarget.classData.slug,
                        sectionSlug:
                            previousTarget.section?.slug,
                        streamSlug:
                            previousTarget.stream?.slug,
                    },
                    tx,
                );

            if (!previousMapping) {
                throw new Error(
                    `Current academic mapping not found for ${student.studentName}`,
                );
            }

            const existingNewMapping =
                await findAcademicMappingByStudentSessionRepo(
                    {
                        schoolSlug: school.slug,
                        studentSlug: student.slug,
                        sessionSlug: newTarget.session.slug,
                    },
                    tx,
                );

            if (existingNewMapping) {
                throw new Error(
                    `${student.studentName} already has an academic mapping in session ${newTarget.session.name}`,
                );
            }

            const studentNewSectionSlug =
                normalizeNullableValue(
                    item.newSectionSlug,
                ) ??
                newTarget.section?.slug ??
                null;

            const studentNewStreamSlug =
                normalizeNullableValue(
                    item.newStreamSlug,
                ) ??
                newTarget.stream?.slug ??
                null;

            if (
                studentNewSectionSlug &&
                studentNewSectionSlug !==
                newTarget.section?.slug
            ) {
                const studentSection =
                    await findSectionBySlugRepo(
                        school.slug,
                        newTarget.board.slug,
                        studentNewSectionSlug,
                        tx,
                    );

                if (!studentSection) {
                    throw new Error(
                        `Selected section not found for ${student.studentName}`,
                    );
                }
            }

            if (
                studentNewStreamSlug &&
                studentNewStreamSlug !==
                newTarget.stream?.slug
            ) {
                const studentStream =
                    await findStreamBySlugRepo(
                        school.slug,
                        newTarget.board.slug,
                        studentNewStreamSlug,
                        tx,
                    );

                if (!studentStream) {
                    throw new Error(
                        `Selected stream not found for ${student.studentName}`,
                    );
                }
            }

            const newRollNumber =
                normalizeNullableValue(
                    item.newRollNumber,
                );

            const newRollNumberPrefix =
                normalizeNullableValue(
                    item.newRollNumberPrefix,
                );

            if (newRollNumber) {
                const duplicateRollNumber =
                    await findDuplicateRollNumberRepo(
                        {
                            schoolSlug: school.slug,
                            sessionSlug:
                                newTarget.session.slug,
                            boardSlug:
                                newTarget.board.slug,
                            classSlug:
                                newTarget.classData.slug,
                            sectionSlug:
                                studentNewSectionSlug,
                            rollNumber: newRollNumber,
                            excludeStudentSlug:
                                student.slug,
                        },
                        tx,
                    );

                if (duplicateRollNumber) {
                    throw new Error(
                        `Roll number ${newRollNumber} is already assigned to ${duplicateRollNumber.student.studentName}`,
                    );
                }
            }

            const newAcademicMapping =
                await createAcademicMappingRepo(
                    {
                        slug: randomUUID(),
                        schoolSlug: school.slug,
                        studentSlug: student.slug,
                        sessionSlug:
                            newTarget.session.slug,
                        boardSlug: newTarget.board.slug,
                        classSlug:
                            newTarget.classData.slug,
                        sectionSlug:
                            studentNewSectionSlug,
                        streamSlug:
                            studentNewStreamSlug,
                        rollNumberPrefix:
                            newRollNumberPrefix,
                        rollNumber: newRollNumber,
                        academicStatus: "CURRENT",
                        academicStatusChangedAt:
                            new Date(),
                        status: "active",
                        isActive: true,
                        deletedAt: null,
                    },
                    tx,
                );

            await updateAcademicMappingRepo(
                previousMapping.slug,
                {
                    academicStatus:
                        getOldAcademicStatus(
                            payload.promotionType,
                        ),
                    academicStatusChangedAt:
                        new Date(),
                },
                tx,
            );

            await updateStudentCurrentAcademicRepo(
                student.slug,
                {
                    currentSessionSlug:
                        newTarget.session.slug,
                    boardSlug: newTarget.board.slug,
                    currentClassSlug:
                        newTarget.classData.slug,
                },
                tx,
            );

            const promotion =
                await createStudentPromotionRepo(
                    {
                        slug: randomUUID(),
                        batchSlug,
                        schoolSlug: school.slug,
                        studentSlug: student.slug,

                        previousAcademicMappingSlug:
                            previousMapping.slug,

                        newAcademicMappingSlug:
                            newAcademicMapping.slug,

                        previousSessionSlug:
                            previousMapping.sessionSlug,

                        previousBoardSlug:
                            previousMapping.boardSlug,

                        previousClassSlug:
                            previousMapping.classSlug,

                        previousSectionSlug:
                            previousMapping.sectionSlug,

                        previousStreamSlug:
                            previousMapping.streamSlug,

                        previousRollNumberPrefix:
                            previousMapping.rollNumberPrefix,

                        previousRollNumber:
                            previousMapping.rollNumber,

                        newSessionSlug:
                            newAcademicMapping.sessionSlug,

                        newBoardSlug:
                            newAcademicMapping.boardSlug,

                        newClassSlug:
                            newAcademicMapping.classSlug,

                        newSectionSlug:
                            newAcademicMapping.sectionSlug,

                        newStreamSlug:
                            newAcademicMapping.streamSlug,

                        newRollNumberPrefix:
                            newAcademicMapping.rollNumberPrefix,

                        newRollNumber:
                            newAcademicMapping.rollNumber,

                        promotionType:
                            payload.promotionType,

                        promotionStatus: "COMPLETED",

                        remarks:
                            normalizeNullableValue(
                                payload.remarks,
                            ),

                        promotedAt: new Date(),

                        promotedBySlug:
                            user?.slug || null,

                        status: "active",
                        isActive: true,
                        deletedAt: null,
                    },
                    tx,
                );

            createdPromotions.push(promotion);
        }

        return {
            batchSlug,
            totalStudents: createdPromotions.length,
            promotionType: payload.promotionType,
            previousAcademic: {
                session: previousTarget.session.name,
                board: previousTarget.board.title,
                classTitle:
                    previousTarget.classData.classTitle,
            },
            newAcademic: {
                session: newTarget.session.name,
                board: newTarget.board.title,
                classTitle:
                    newTarget.classData.classTitle,
            },
            promotions: createdPromotions,
        };
    });
};

export const getStudentPromotionsService = async (
    query,
    user,
) => {
    const school = await resolveSchool(user);

    let previousSessionSlug = null;
    let newSessionSlug = null;
    let previousClassSlug = null;
    let newClassSlug = null;

    if (query.previousSession) {
        const session = await findSessionByNameRepo(
            school.slug,
            query.previousSession,
        );

        if (!session) {
            return [];
        }

        previousSessionSlug = session.slug;
    }

    if (query.newSession) {
        const session = await findSessionByNameRepo(
            school.slug,
            query.newSession,
        );

        if (!session) {
            return [];
        }

        newSessionSlug = session.slug;
    }

    if (query.previousClass) {
        if (!query.previousBoard) {
            throw new Error(
                "Previous board is required when filtering by previous class",
            );
        }

        const board = await findBoardByTitleRepo(
            school.slug,
            query.previousBoard,
        );

        if (!board) {
            return [];
        }

        const classData = await findClassByTitleRepo(
            school.slug,
            board.slug,
            query.previousClass,
        );

        if (!classData) {
            return [];
        }

        previousClassSlug = classData.slug;
    }

    if (query.newClass) {
        if (!query.newBoard) {
            throw new Error(
                "New board is required when filtering by new class",
            );
        }

        const board = await findBoardByTitleRepo(
            school.slug,
            query.newBoard,
        );

        if (!board) {
            return [];
        }

        const classData = await findClassByTitleRepo(
            school.slug,
            board.slug,
            query.newClass,
        );

        if (!classData) {
            return [];
        }

        newClassSlug = classData.slug;
    }

    return getStudentPromotionsRepo({
        schoolSlug: school.slug,
        batchSlug: query.batchSlug,
        studentSlug: query.studentSlug,
        previousSessionSlug,
        newSessionSlug,
        previousClassSlug,
        newClassSlug,
        promotionType: query.promotionType,
        promotionStatus: query.promotionStatus,
    });
};

export const getStudentPromotionBySlugService = async (
    slug,
    user,
) => {
    const school = await resolveSchool(user);

    const promotion =
        await getStudentPromotionBySlugRepo(
            slug,
            school.slug,
        );

    if (!promotion) {
        throw new Error("Student promotion not found");
    }

    return promotion;
};

export const getPromotionBatchService = async (
    batchSlug,
    user,
) => {
    const school = await resolveSchool(user);

    const promotions = await getPromotionBatchRepo(
        batchSlug,
        school.slug,
    );

    if (!promotions.length) {
        throw new Error("Promotion batch not found");
    }

    return {
        batchSlug,
        totalStudents: promotions.length,
        promotionStatus:
            promotions[0].promotionStatus,
        promotionType:
            promotions[0].promotionType,
        promotedAt: promotions[0].promotedAt,
        promotions,
    };
};

export const rollbackPromotionBatchService = async (
    batchSlug,
    payload,
    user,
) => {
    return runPromotionTransactionRepo(async (tx) => {
        const school = await resolveSchool(user, tx);

        const promotions = await getPromotionBatchRepo(
            batchSlug,
            school.slug,
            tx,
        );

        if (!promotions.length) {
            throw new Error("Promotion batch not found");
        }

        const alreadyRolledBack =
            promotions.some(
                (promotion) =>
                    promotion.promotionStatus ===
                    "ROLLED_BACK",
            );

        if (alreadyRolledBack) {
            throw new Error(
                "This promotion batch has already been rolled back",
            );
        }

        for (const promotion of promotions) {
            const fullPromotion =
                await getStudentPromotionBySlugRepo(
                    promotion.slug,
                    school.slug,
                    tx,
                );

            if (!fullPromotion) {
                throw new Error(
                    "Promotion record not found during rollback",
                );
            }

            if (
                fullPromotion.newAcademicMapping
                    .academicStatus !== "CURRENT"
            ) {
                throw new Error(
                    `${fullPromotion.student.studentName} cannot be rolled back because the new academic mapping is no longer current`,
                );
            }

            await updateAcademicMappingRepo(
                fullPromotion.newAcademicMappingSlug,
                {
                    academicStatus: "COMPLETED",
                    academicStatusChangedAt:
                        new Date(),
                    status: "inactive",
                    isActive: false,
                    deletedAt: new Date(),
                },
                tx,
            );

            await updateAcademicMappingRepo(
                fullPromotion.previousAcademicMappingSlug,
                {
                    academicStatus: "CURRENT",
                    academicStatusChangedAt:
                        new Date(),
                    status: "active",
                    isActive: true,
                    deletedAt: null,
                },
                tx,
            );

            await updateStudentCurrentAcademicRepo(
                fullPromotion.studentSlug,
                {
                    currentSessionSlug:
                        fullPromotion.previousSessionSlug,
                    boardSlug:
                        fullPromotion.previousBoardSlug,
                    currentClassSlug:
                        fullPromotion.previousClassSlug,
                },
                tx,
            );

            await updateStudentPromotionRepo(
                fullPromotion.slug,
                {
                    promotionStatus: "ROLLED_BACK",
                    rolledBackAt: new Date(),
                    rolledBackBySlug:
                        user?.slug || null,
                    rollbackRemarks:
                        payload.rollbackRemarks,
                },
                tx,
            );
        }

        return {
            batchSlug,
            totalStudents: promotions.length,
            promotionStatus: "ROLLED_BACK",
            rollbackRemarks:
                payload.rollbackRemarks,
        };
    });
};