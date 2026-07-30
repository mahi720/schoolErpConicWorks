import prisma from "../../../config/prisma.js";

export const findSchoolByCodeRepo = async (schoolCode) => {
    return prisma.school.findFirst({
        where: {
            schoolCode,
            isActive: true,
        },
        select: {
            slug: true,
            schoolCode: true,
            schoolName: true,
        },
    });
};

export const findTermExamBySlugRepo = async ({
    schoolSlug,
    termExamSlug,
}) => {
    return prisma.termExam.findFirst({
        where: {
            slug: termExamSlug,
            schoolSlug,
        },
        include: {
            session: {
                select: {
                    slug: true,
                    name: true,
                    startDate: true,
                    endDate: true,
                },
            },
            board: {
                select: {
                    slug: true,
                    title: true,
                },
            },
            examType: {
                select: {
                    slug: true,
                    examType: true,
                },
            },
        },
    });
};

export const findClassBySlugRepo = async ({
    schoolSlug,
    classSlug,
}) => {
    return prisma.class.findFirst({
        where: {
            slug: classSlug,
            schoolSlug,
        },
        select: {
            slug: true,
            classTitle: true,
            classType: true,
            // sessionSlug: true,
            boardSlug: true,
            isActive: true,
        },
    });
};

export const findClassSubjectBySlugRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
    classSubjectSlug,
}) => {
    return prisma.addSubjectToClass.findFirst({
        where: {
            slug: classSubjectSlug,
            schoolSlug,
            sessionSlug,
            boardSlug,
            classSlug,
            isActive: true,
        },
        include: {
            subject: {
                select: {
                    slug: true,
                    subjectTitle: true,
                    subjectType: true,
                    subjectOrder: true,
                    status: true,
                    isActive: true,
                },
            },
            stream: {
                select: {
                    slug: true,
                    streamTitle: true,
                },
            },
        },
    });
};

export const findStreamBySlugRepo = async ({
    schoolSlug,
    streamSlug,
}) => {
    return prisma.stream.findFirst({
        where: {
            slug: streamSlug,
            schoolSlug,
            isActive: true,
        },
        select: {
            slug: true,
            streamTitle: true,
        },
    });
};

export const getTermExamClassConfigurationRepo = async ({
    schoolSlug,
    termExamSlug,
    classSlug,
}) => {
    return prisma.termExamClassConfiguration.findFirst({
        where: {
            schoolSlug,
            termExamSlug,
            classSlug,
        },
        include: {
            termExam: {
                include: {
                    session: {
                        select: {
                            slug: true,
                            name: true,
                        },
                    },
                    board: {
                        select: {
                            slug: true,
                            title: true,
                        },
                    },
                    examType: {
                        select: {
                            slug: true,
                            examType: true,
                        },
                    },
                },
            },
            class: {
                select: {
                    slug: true,
                    classTitle: true,
                    classType: true,
                },
            },
            timeTables: {
                orderBy: {
                    createdAt: "asc",
                },
                include: {
                    classSubject: {
                        include: {
                            subject: {
                                select: {
                                    slug: true,
                                    subjectTitle: true,
                                    subjectType: true,
                                    subjectOrder: true,
                                },
                            },
                            stream: {
                                select: {
                                    slug: true,
                                    streamTitle: true,
                                },
                            },
                        },
                    },
                    stream: {
                        select: {
                            slug: true,
                            streamTitle: true,
                        },
                    },
                },
            },
        },
    });
};

export const saveTermExamTimeTableRepo = async ({
    schoolSlug,
    termExamSlug,
    classSlug,
    configurationSlug,
    publishResult,
    subjects,
}) => {
    return prisma.$transaction(async (tx) => {
        let configuration =
            await tx.termExamClassConfiguration.findFirst({
                where: {
                    schoolSlug,
                    termExamSlug,
                    classSlug,
                },
            });
        if (!configuration) {
            configuration =
                await tx.termExamClassConfiguration.create({
                    data: {
                        slug: configurationSlug,
                        schoolSlug,
                        termExamSlug,
                        classSlug,
                        publishResult,
                        status: "active",
                        isActive: true,
                        deletedAt: null,
                    },
                });
        } else if (!configuration.isActive) {
            configuration =
                await tx.termExamClassConfiguration.update({
                    where: {
                        slug: configuration.slug,
                    },
                    data: {
                        publishResult,
                        status: "active",
                        isActive: true,
                        deletedAt: null,
                    },
                });
        } else {
            configuration =
                await tx.termExamClassConfiguration.update({
                    where: {
                        slug: configuration.slug,
                    },
                    data: {
                        publishResult,
                    },
                });
        }

        const existingRows =
            await tx.termExamTimeTable.findMany({
                where: {
                    schoolSlug,
                    termExamClassConfigurationSlug:
                        configuration.slug,
                },
            });

        const processedRowSlugs = [];

        for (const subject of subjects) {
            const existingRow = existingRows.find(
                (item) =>
                    item.classSubjectSlug ===
                    subject.classSubjectSlug &&
                    (item.streamSlug || null) ===
                    (subject.streamSlug || null),
            );

            if (existingRow) {
                const updatedRow =
                    await tx.termExamTimeTable.update({
                        where: {
                            slug: existingRow.slug,
                        },
                        data: {
                            studyMode: subject.studyMode,
                            maxMarks: subject.maxMarks,
                            minMarks: subject.minMarks,
                            examDate: subject.examDate,
                            examTime: subject.examTime,
                            duration: subject.duration,
                            questionPaper:
                                subject.questionPaper || null,
                            status: "active",
                            isActive: true,
                            deletedAt: null,
                        },
                    });

                processedRowSlugs.push(updatedRow.slug);
            } else {
                const createdRow =
                    await tx.termExamTimeTable.create({
                        data: {
                            slug: subject.slug,
                            schoolSlug,
                            termExamClassConfigurationSlug:
                                configuration.slug,
                            classSubjectSlug:
                                subject.classSubjectSlug,
                            streamSlug:
                                subject.streamSlug || null,
                            studyMode: subject.studyMode,
                            maxMarks: subject.maxMarks,
                            minMarks: subject.minMarks,
                            examDate: subject.examDate,
                            examTime: subject.examTime,
                            duration: subject.duration,
                            questionPaper:
                                subject.questionPaper || null,
                            status: "active",
                            isActive: true,
                            deletedAt: null,
                        },
                    });

                processedRowSlugs.push(createdRow.slug);
            }
        }

        const rowsToDeactivate = existingRows
            .filter(
                (item) =>
                    !processedRowSlugs.includes(item.slug) &&
                    item.isActive,
            )
            .map((item) => item.slug);

        if (rowsToDeactivate.length > 0) {
            await tx.termExamTimeTable.updateMany({
                where: {
                    slug: {
                        in: rowsToDeactivate,
                    },
                },
                data: {
                    status: "inactive",
                    isActive: false,
                    deletedAt: new Date(),
                },
            });
        }

        return tx.termExamClassConfiguration.findUnique({
            where: {
                slug: configuration.slug,
            },
            include: {
                termExam: {
                    include: {
                        session: {
                            select: {
                                slug: true,
                                name: true,
                            },
                        },
                        board: {
                            select: {
                                slug: true,
                                title: true,
                            },
                        },
                        examType: {
                            select: {
                                slug: true,
                                examType: true,
                            },
                        },
                    },
                },
                class: {
                    select: {
                        slug: true,
                        classTitle: true,
                        classType: true,
                    },
                },
                timeTables: {
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        examDate: "asc",
                    },
                    include: {
                        classSubject: {
                            include: {
                                subject: {
                                    select: {
                                        slug: true,
                                        subjectTitle: true,
                                        subjectType: true,
                                        subjectOrder: true,
                                    },
                                },
                                stream: {
                                    select: {
                                        slug: true,
                                        streamTitle: true,
                                    },
                                },
                            },
                        },
                        stream: {
                            select: {
                                slug: true,
                                streamTitle: true,
                            },
                        },
                    },
                },
            },
        });
    });
};

export const deleteTermExamTimeTableRepo = async ({
    schoolSlug,
    termExamSlug,
    classSlug,
}) => {
    return prisma.$transaction(async (tx) => {
        const configuration =
            await tx.termExamClassConfiguration.findFirst({
                where: {
                    schoolSlug,
                    termExamSlug,
                    classSlug,
                },
            });

        if (!configuration) {
            return null;
        }

        const deletedAt = new Date();

        await tx.termExamTimeTable.updateMany({
            where: {
                schoolSlug,
                termExamClassConfigurationSlug:
                    configuration.slug,
            },
            data: {
                status: "inactive",
                isActive: false,
                deletedAt,
            },
        });

        return tx.termExamClassConfiguration.update({
            where: {
                slug: configuration.slug,
            },
            data: {
                status: "inactive",
                isActive: false,
                deletedAt,
            },
        });
    });
};

export const restoreTermExamTimeTableRepo = async ({
    schoolSlug,
    termExamSlug,
    classSlug,
}) => {
    return prisma.$transaction(async (tx) => {
        const configuration =
            await tx.termExamClassConfiguration.findFirst({
                where: {
                    schoolSlug,
                    termExamSlug,
                    classSlug,
                },
            });

        if (!configuration) {
            return null;
        }

        await tx.termExamTimeTable.updateMany({
            where: {
                schoolSlug,
                termExamClassConfigurationSlug:
                    configuration.slug,
            },
            data: {
                status: "active",
                isActive: true,
                deletedAt: null,
            },
        });

        return tx.termExamClassConfiguration.update({
            where: {
                slug: configuration.slug,
            },
            data: {
                status: "active",
                isActive: true,
                deletedAt: null,
            },
        });
    });
};

export const findSessionByNameRepo = async ({
    schoolSlug,
    session,
}) => {
    return prisma.session.findFirst({
        where: {
            schoolSlug,
            name: session,
            isActive: true,
        },
        select: {
            slug: true,
            name: true,
        },
    });
};

export const findBoardByTitleRepo = async ({
    schoolSlug,
    board,
}) => {
    return prisma.board.findFirst({
        where: {
            schoolSlug,
            title: board,
            isActive: true,
        },
        select: {
            slug: true,
            title: true,
        },
    });
};

export const findExamTypeByTitleRepo = async ({
    schoolSlug,
    examType,
}) => {
    return prisma.examType.findFirst({
        where: {
            schoolSlug,
            examType,
            isActive: true,
        },
        select: {
            slug: true,
            examType: true,
        },
    });
};

export const findDuplicateTermExamRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    examTypeSlug,
    examTitle,
    excludeSlug,
}) => {
    return prisma.termExam.findFirst({
        where: {
            schoolSlug,
            sessionSlug,
            boardSlug,
            examTypeSlug,
            examTitle,
            ...(excludeSlug
                ? {
                    slug: {
                        not: excludeSlug,
                    },
                }
                : {}),
        },
        select: {
            slug: true,
        },
    });
};

export const createTermExamRepo = async (data) => {
    return prisma.termExam.create({
        data,
        include: {
            session: {
                select: {
                    slug: true,
                    name: true,
                    startDate: true,
                    endDate: true,
                },
            },
            board: {
                select: {
                    slug: true,
                    title: true,
                },
            },
            examType: {
                select: {
                    slug: true,
                    examType: true,
                },
            },
        },
    });
};

export const getTermExamsRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    examTypeSlug,
    status,
}) => {
    return prisma.termExam.findMany({
        where: {
            schoolSlug,
            ...(sessionSlug
                ? {
                    sessionSlug,
                }
                : {}),
            ...(boardSlug
                ? {
                    boardSlug,
                }
                : {}),
            ...(examTypeSlug
                ? {
                    examTypeSlug,
                }
                : {}),
            ...(status
                ? {
                    status,
                }
                : {}),
        },
        orderBy: [
            {
                startDate: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
        include: {
            session: {
                select: {
                    slug: true,
                    name: true,
                    startDate: true,
                    endDate: true,
                },
            },
            board: {
                select: {
                    slug: true,
                    title: true,
                },
            },
            examType: {
                select: {
                    slug: true,
                    examType: true,
                },
            },
            termExamClassConfigurations: {
                select: {
                    publishResult: true,
                    isActive: true,
                },
            },
        },
    });
};

export const updateTermExamRepo = async ({
    slug,
    data,
}) => {
    return prisma.termExam.update({
        where: {
            slug,
        },
        data,
        include: {
            session: {
                select: {
                    slug: true,
                    name: true,
                    startDate: true,
                    endDate: true,
                },
            },
            board: {
                select: {
                    slug: true,
                    title: true,
                },
            },
            examType: {
                select: {
                    slug: true,
                    examType: true,
                },
            },
        },
    });
};

export const deleteTermExamRepo = async ({
    schoolSlug,
    termExamSlug,
}) => {
    return prisma.$transaction(async (tx) => {
        const termExam =
            await tx.termExam.findFirst({
                where: {
                    schoolSlug,
                    slug: termExamSlug,
                },
            });

        if (!termExam) {
            return null;
        }

        const deletedAt = new Date();

        const configurations =
            await tx.termExamClassConfiguration.findMany({
                where: {
                    schoolSlug,
                    termExamSlug,
                },
                select: {
                    slug: true,
                },
            });

        const configurationSlugs =
            configurations.map(
                (item) => item.slug,
            );

        if (
            configurationSlugs.length >
            0
        ) {
            await tx.termExamTimeTable.updateMany({
                where: {
                    schoolSlug,
                    termExamClassConfigurationSlug:
                    {
                        in: configurationSlugs,
                    },
                },
                data: {
                    status: "inactive",
                    isActive: false,
                    deletedAt,
                },
            });

            await tx.termExamClassConfiguration.updateMany({
                where: {
                    schoolSlug,
                    termExamSlug,
                },
                data: {
                    status: "inactive",
                    isActive: false,
                    deletedAt,
                },
            });
        }

        return tx.termExam.update({
            where: {
                slug: termExamSlug,
            },
            data: {
                status: "inactive",
                isActive: false,
                deletedAt,
            },
            include: {
                session: true,
                board: true,
                examType: true,
            },
        });
    });
};

export const restoreTermExamRepo = async ({
    schoolSlug,
    termExamSlug,
}) => {
    return prisma.$transaction(async (tx) => {
        const termExam =
            await tx.termExam.findFirst({
                where: {
                    schoolSlug,
                    slug: termExamSlug,
                },
            });

        if (!termExam) {
            return null;
        }

        const configurations =
            await tx.termExamClassConfiguration.findMany({
                where: {
                    schoolSlug,
                    termExamSlug,
                },
                select: {
                    slug: true,
                },
            });

        const configurationSlugs =
            configurations.map(
                (item) => item.slug,
            );

        if (
            configurationSlugs.length >
            0
        ) {
            await tx.termExamClassConfiguration.updateMany({
                where: {
                    schoolSlug,
                    termExamSlug,
                },
                data: {
                    status: "active",
                    isActive: true,
                    deletedAt: null,
                },
            });

            await tx.termExamTimeTable.updateMany({
                where: {
                    schoolSlug,
                    termExamClassConfigurationSlug:
                    {
                        in: configurationSlugs,
                    },
                },
                data: {
                    status: "active",
                    isActive: true,
                    deletedAt: null,
                },
            });
        }

        return tx.termExam.update({
            where: {
                slug: termExamSlug,
            },
            data: {
                status: "active",
                isActive: true,
                deletedAt: null,
            },
            include: {
                session: true,
                board: true,
                examType: true,
            },
        });
    });
};