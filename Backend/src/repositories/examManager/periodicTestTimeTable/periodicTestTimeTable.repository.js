import prisma from "../../../config/prisma.js";

export const findPeriodicTestSchoolByCodeRepo = async (schoolCode) => {
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

export const findPeriodicTestSessionByNameRepo = async ({
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
            startDate: true,
            endDate: true,
        },
    });
};

export const findPeriodicTestBoardByTitleRepo = async ({
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

export const findPeriodicTestBySlugRepo = async ({
    schoolSlug,
    periodicTestSlug,
}) => {
    return prisma.periodicTest.findFirst({
        where: {
            schoolSlug,
            slug: periodicTestSlug,
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
            periodicTestClassConfigurations: {
                include: {
                    class: {
                        select: {
                            slug: true,
                            classTitle: true,
                            classType: true,
                        },
                    },
                },
            },
        },
    });
};

export const findDuplicatePeriodicTestRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    testTitle,
    excludeSlug,
}) => {
    return prisma.periodicTest.findFirst({
        where: {
            schoolSlug,
            sessionSlug,
            boardSlug,
            testTitle,
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

export const createPeriodicTestRepo = async (data) => {
    return prisma.periodicTest.create({
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
        },
    });
};

export const getPeriodicTestsRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    testStatus,
    status,
}) => {
    return prisma.periodicTest.findMany({
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
            ...(testStatus
                ? {
                    testStatus,
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
            periodicTestClassConfigurations: {
                select: {
                    slug: true,
                    classSlug: true,
                    publishResult: true,
                    status: true,
                    isActive: true,
                    class: {
                        select: {
                            slug: true,
                            classTitle: true,
                            classType: true,
                        },
                    },
                },
            },
        },
    });
};

export const updatePeriodicTestRepo = async ({
    slug,
    data,
}) => {
    return prisma.periodicTest.update({
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
        },
    });
};

export const findPeriodicTestClassBySlugRepo = async ({
    schoolSlug,
    // sessionSlug,
    boardSlug,
    classSlug,
}) => {
    return prisma.class.findFirst({
        where: {
            schoolSlug,
            // sessionSlug,
            boardSlug,
            slug: classSlug,
        },
        select: {
            slug: true,
            schoolSlug: true,
            // sessionSlug: true,
            boardSlug: true,
            classTitle: true,
            classType: true,
            status: true,
            isActive: true,
        },
    });
};

export const findPeriodicTestClassMappingRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
}) => {
    return prisma.classSectionStreamMapping.findFirst({
        where: {
            schoolSlug,
            sessionSlug,
            boardSlug,
            classSlug,
            isActive: true,
        },
        select: {
            slug: true,
            schoolSlug: true,
            sessionSlug: true,
            boardSlug: true,
            classSlug: true,
            sectionSlugs: true,
            streamSlugs: true,
            isActive: true,
        },
    });
};

export const findPeriodicTestClassSubjectBySlugRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
    classSubjectSlug,
}) => {
    return prisma.addSubjectToClass.findFirst({
        where: {
            schoolSlug,
            sessionSlug,
            boardSlug,
            classSlug,
            slug: classSubjectSlug,
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

export const findPeriodicTestStreamBySlugRepo = async ({
    schoolSlug,
    streamSlug,
}) => {
    return prisma.stream.findFirst({
        where: {
            schoolSlug,
            slug: streamSlug,
            isActive: true,
        },
        select: {
            slug: true,
            streamTitle: true,
        },
    });
};

export const getPeriodicTestClassConfigurationRepo = async ({
    schoolSlug,
    periodicTestSlug,
    classSlug,
}) => {
    return prisma.periodicTestClassConfiguration.findFirst({
        where: {
            schoolSlug,
            periodicTestSlug,
            classSlug,
        },
        include: {
            periodicTest: {
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
                },
            },
            class: {
                select: {
                    slug: true,
                    classTitle: true,
                    classType: true,
                },
            },
            periodicTestTimeTables: {
                orderBy: [
                    {
                        testDate: "asc",
                    },
                    {
                        testTime: "asc",
                    },
                ],
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

export const savePeriodicTestTimeTableRepo = async ({
    schoolSlug,
    periodicTestSlug,
    classSlug,
    configurationSlug,
    publishResult,
    subjects,
}) => {
    return prisma.$transaction(async (tx) => {
        let configuration =
            await tx.periodicTestClassConfiguration.findFirst({
                where: {
                    schoolSlug,
                    periodicTestSlug,
                    classSlug,
                },
            });

        if (!configuration) {
            configuration =
                await tx.periodicTestClassConfiguration.create({
                    data: {
                        slug: configurationSlug,
                        schoolSlug,
                        periodicTestSlug,
                        classSlug,
                        publishResult,
                        status: "active",
                        isActive: true,
                        deletedAt: null,
                    },
                });
        } else {
            configuration =
                await tx.periodicTestClassConfiguration.update({
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
        }

        for (const subject of subjects) {
            const existingRow =
                await tx.periodicTestTimeTable.findFirst({
                    where: {
                        schoolSlug,
                        periodicTestClassConfigurationSlug:
                            configuration.slug,
                        classSubjectSlug:
                            subject.classSubjectSlug,
                        streamSlug:
                            subject.streamSlug || null,
                    },
                });

            if (existingRow) {
                await tx.periodicTestTimeTable.update({
                    where: {
                        slug: existingRow.slug,
                    },
                    data: {
                        studyMode:
                            subject.studyMode || null,
                        maxMarks:
                            subject.maxMarks,
                        minMarks:
                            subject.minMarks,
                        testDate:
                            subject.testDate,
                        testTime:
                            subject.testTime,
                        duration:
                            subject.duration,
                        questionPaper:
                            subject.questionPaper || null,
                        status: "active",
                        isActive: true,
                        deletedAt: null,
                    },
                });
            } else {
                await tx.periodicTestTimeTable.create({
                    data: {
                        slug: subject.slug,
                        schoolSlug,
                        periodicTestClassConfigurationSlug:
                            configuration.slug,
                        classSubjectSlug:
                            subject.classSubjectSlug,
                        streamSlug:
                            subject.streamSlug || null,
                        studyMode:
                            subject.studyMode || null,
                        maxMarks:
                            subject.maxMarks,
                        minMarks:
                            subject.minMarks,
                        testDate:
                            subject.testDate,
                        testTime:
                            subject.testTime,
                        duration:
                            subject.duration,
                        questionPaper:
                            subject.questionPaper || null,
                        status: "active",
                        isActive: true,
                        deletedAt: null,
                    },
                });
            }
        }

        return tx.periodicTestClassConfiguration.findUnique({
            where: {
                slug: configuration.slug,
            },
            include: {
                periodicTest: {
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
                    },
                },
                class: {
                    select: {
                        slug: true,
                        classTitle: true,
                        classType: true,
                    },
                },
                periodicTestTimeTables: {
                    where: {
                        isActive: true,
                    },
                    orderBy: [
                        {
                            testDate: "asc",
                        },
                        {
                            testTime: "asc",
                        },
                    ],
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

export const deletePeriodicTestTimeTableRepo = async ({
    schoolSlug,
    periodicTestSlug,
    classSlug,
}) => {
    return prisma.$transaction(async (tx) => {
        const configuration =
            await tx.periodicTestClassConfiguration.findFirst({
                where: {
                    schoolSlug,
                    periodicTestSlug,
                    classSlug,
                },
            });

        if (!configuration) {
            return null;
        }

        const deletedAt = new Date();

        await tx.periodicTestTimeTable.updateMany({
            where: {
                schoolSlug,
                periodicTestClassConfigurationSlug:
                    configuration.slug,
            },
            data: {
                status: "inactive",
                isActive: false,
                deletedAt,
            },
        });

        return tx.periodicTestClassConfiguration.update({
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

export const restorePeriodicTestTimeTableRepo = async ({
    schoolSlug,
    periodicTestSlug,
    classSlug,
}) => {
    return prisma.$transaction(async (tx) => {
        const configuration =
            await tx.periodicTestClassConfiguration.findFirst({
                where: {
                    schoolSlug,
                    periodicTestSlug,
                    classSlug,
                },
            });

        if (!configuration) {
            return null;
        }

        await tx.periodicTestTimeTable.updateMany({
            where: {
                schoolSlug,
                periodicTestClassConfigurationSlug:
                    configuration.slug,
            },
            data: {
                status: "active",
                isActive: true,
                deletedAt: null,
            },
        });

        return tx.periodicTestClassConfiguration.update({
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

export const deletePeriodicTestRepo = async ({
    schoolSlug,
    periodicTestSlug,
}) => {
    return prisma.$transaction(async (tx) => {
        const periodicTest =
            await tx.periodicTest.findFirst({
                where: {
                    schoolSlug,
                    slug: periodicTestSlug,
                },
            });

        if (!periodicTest) {
            return null;
        }

        const deletedAt = new Date();

        const configurations =
            await tx.periodicTestClassConfiguration.findMany({
                where: {
                    schoolSlug,
                    periodicTestSlug,
                },
                select: {
                    slug: true,
                },
            });

        const configurationSlugs =
            configurations.map((item) => item.slug);

        if (configurationSlugs.length > 0) {
            await tx.periodicTestTimeTable.updateMany({
                where: {
                    schoolSlug,
                    periodicTestClassConfigurationSlug: {
                        in: configurationSlugs,
                    },
                },
                data: {
                    status: "inactive",
                    isActive: false,
                    deletedAt,
                },
            });

            await tx.periodicTestClassConfiguration.updateMany({
                where: {
                    schoolSlug,
                    periodicTestSlug,
                },
                data: {
                    status: "inactive",
                    isActive: false,
                    deletedAt,
                },
            });
        }

        return tx.periodicTest.update({
            where: {
                slug: periodicTestSlug,
            },
            data: {
                status: "inactive",
                isActive: false,
                deletedAt,
            },
            include: {
                session: true,
                board: true,
            },
        });
    });
};

export const restorePeriodicTestRepo = async ({
    schoolSlug,
    periodicTestSlug,
}) => {
    return prisma.$transaction(async (tx) => {
        const periodicTest =
            await tx.periodicTest.findFirst({
                where: {
                    schoolSlug,
                    slug: periodicTestSlug,
                },
            });

        if (!periodicTest) {
            return null;
        }

        const configurations =
            await tx.periodicTestClassConfiguration.findMany({
                where: {
                    schoolSlug,
                    periodicTestSlug,
                },
                select: {
                    slug: true,
                },
            });

        const configurationSlugs =
            configurations.map((item) => item.slug);

        if (configurationSlugs.length > 0) {
            await tx.periodicTestClassConfiguration.updateMany({
                where: {
                    schoolSlug,
                    periodicTestSlug,
                },
                data: {
                    status: "active",
                    isActive: true,
                    deletedAt: null,
                },
            });

            await tx.periodicTestTimeTable.updateMany({
                where: {
                    schoolSlug,
                    periodicTestClassConfigurationSlug: {
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

        return tx.periodicTest.update({
            where: {
                slug: periodicTestSlug,
            },
            data: {
                status: "active",
                isActive: true,
                deletedAt: null,
            },
            include: {
                session: true,
                board: true,
            },
        });
    });
};