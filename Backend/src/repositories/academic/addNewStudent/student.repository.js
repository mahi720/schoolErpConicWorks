import prisma from "../../../config/prisma.js";

// Student

export const findStudentByAdmissionNumberRepo = async (
    schoolSlug,
    admissionNumber
) => {
    return prisma.student.findFirst({
        where: {
            schoolSlug,
            admissionNumber,
        },
    });
};

export const createStudentRepo = async (
    studentData,
    previousSchoolData
) => {
    return prisma.$transaction(async (tx) => {
        const student = await tx.student.create({
            data: studentData,
        });

        if (previousSchoolData) {
            await tx.previousSchoolInfo.create({
                data: {
                    ...previousSchoolData,
                    studentSlug: student.slug,
                },
            });
        }

        return tx.student.findUnique({
            where: {
                id: student.id,
            },
            include: {
                admissionSession: {
                    select: {
                        name: true,
                    },
                },

                currentSession: {
                    select: {
                        name: true,
                    },
                },

                board: {
                    select: {
                        title: true,
                    },
                },

                admissionClass: {
                    select: {
                        classTitle: true,
                        classType: true,
                    },
                },

                currentClass: {
                    select: {
                        classTitle: true,
                        classType: true,
                    },
                },

                previousSchoolInfo: true,
            },
        });
    });
};

export const getStudentsRepo = async ({
    schoolSlug,
    status = "active",
    boardSlug,
    currentClassSlug,
    currentSessionSlug,
    category,
    sponsorshipType,
    gender,
    search,
}) => {
    const where = {
        schoolSlug,
    };

    /*
     * Active students
     */
    if (status === "active") {
        where.status = "active";
        where.isActive = true;
        where.deletedAt = null;
    }

    /*
     * Inactive/deleted students
     */
    if (status === "inactive") {
        where.status = "inactive";
        where.isActive = false;
        where.deletedAt = {
            not: null,
        };
    }

    /*
     * status === "all"
     * Is case me active/inactive condition nahi लगेगी.
     */

    if (boardSlug) {
        where.boardSlug = boardSlug;
    }

    if (currentClassSlug) {
        where.currentClassSlug = currentClassSlug;
    }

    if (currentSessionSlug) {
        where.currentSessionSlug =
            currentSessionSlug;
    }

    if (category) {
        where.category = category;
    }

    if (sponsorshipType) {
        where.sponsorshipType =
            sponsorshipType;
    }

    if (gender) {
        where.gender = gender;
    }

    if (search?.trim()) {
        const searchText = search.trim();

        where.OR = [
            {
                admissionNumber: {
                    contains: searchText,
                },
            },
            {
                studentName: {
                    contains: searchText,
                },
            },
            {
                fatherName: {
                    contains: searchText,
                },
            },
            {
                motherName: {
                    contains: searchText,
                },
            },
            {
                phone: {
                    contains: searchText,
                },
            },
            {
                motherPhone: {
                    contains: searchText,
                },
            },
            {
                email: {
                    contains: searchText,
                },
            },
            {
                aadhaarNumber: {
                    contains: searchText,
                },
            },
            {
                apaarId: {
                    contains: searchText,
                },
            },
            {
                penNumber: {
                    contains: searchText,
                },
            },
        ];
    }

    return prisma.student.findMany({
        where,

        include: {
            admissionSession: {
                select: {
                    name: true,
                },
            },

            currentSession: {
                select: {
                    name: true,
                },
            },

            board: {
                select: {
                    title: true,
                },
            },

            admissionClass: {
                select: {
                    classTitle: true,
                    classType: true,
                },
            },

            currentClass: {
                select: {
                    classTitle: true,
                    classType: true,
                },
            },

            previousSchoolInfo: true,
        },

        orderBy:
            status === "inactive"
                ? {
                    deletedAt: "desc",
                }
                : {
                    createdAt: "desc",
                },
    });
};

export const getStudentBySlugRepo = async (
    slug,
    schoolSlug,
    includeDeleted = false
) => {
    return prisma.student.findFirst({
        where: {
            slug,
            schoolSlug,

            ...(!includeDeleted && {
                isActive: true,
                deletedAt: null,
            }),
        },

        include: {
            admissionSession: {
                select: {
                    name: true,
                },
            },

            currentSession: {
                select: {
                    name: true,
                },
            },

            board: {
                select: {
                    title: true,
                },
            },

            admissionClass: {
                select: {
                    classTitle: true,
                    classType: true,
                },
            },

            currentClass: {
                select: {
                    classTitle: true,
                    classType: true,
                },
            },

            previousSchoolInfo: true,

            documents: true,
            health: true,
            healthAssessments: true,
            otherInformation: true,
            attendance: true,
            promotions: true,
            academicMapping: true,
        },
    });
};

export const updateStudentRepo = async (
    id,
    studentData,
    previousSchoolData
) => {
    return prisma.$transaction(async (tx) => {
        const student = await tx.student.update({
            where: {
                id,
            },
            data: studentData,
        });

        if (previousSchoolData) {
            const existingPrevious =
                await tx.previousSchoolInfo.findFirst({
                    where: {
                        studentSlug: student.slug,
                    },
                });

            if (existingPrevious) {
                await tx.previousSchoolInfo.update({
                    where: {
                        id: existingPrevious.id,
                    },
                    data: previousSchoolData,
                });
            } else {
                await tx.previousSchoolInfo.create({
                    data: {
                        ...previousSchoolData,
                        studentSlug: student.slug,
                    },
                });
            }
        }

        return tx.student.findUnique({
            where: {
                id: student.id,
            },

            include: {
                admissionSession: {
                    select: {
                        name: true,
                    },
                },

                currentSession: {
                    select: {
                        name: true,
                    },
                },

                board: {
                    select: {
                        title: true,
                    },
                },

                admissionClass: {
                    select: {
                        classTitle: true,
                        classType: true,
                    },
                },

                currentClass: {
                    select: {
                        classTitle: true,
                        classType: true,
                    },
                },

                previousSchoolInfo: true,
            },
        });
    });
};

export const deleteStudentRepo = async (id) => {
    return prisma.student.update({
        where: {
            id,
        },

        data: {
            status: "inactive",
            isActive: false,
            deletedAt: new Date(),
        },

        include: {
            admissionSession: {
                select: {
                    name: true,
                },
            },

            currentSession: {
                select: {
                    name: true,
                },
            },

            board: {
                select: {
                    title: true,
                },
            },

            admissionClass: {
                select: {
                    classTitle: true,
                    classType: true,
                },
            },

            currentClass: {
                select: {
                    classTitle: true,
                    classType: true,
                },
            },

            previousSchoolInfo: true,
        },
    });
};

export const getDeletedStudentRepo = async (
    slug,
    schoolSlug
) => {
    return prisma.student.findFirst({
        where: {
            slug,
            schoolSlug,
            isActive: false,
            deletedAt: {
                not: null,
            },
        },
    });
};

export const restoreStudentRepo = async (id) => {
    return prisma.student.update({
        where: {
            id,
        },
        data: {
            isActive: true,
            deletedAt: null,
            status: "active",
        },
        include: {
            admissionSession: {
                select: {
                    name: true,
                },
            },
            currentSession: {
                select: {
                    name: true,
                },
            },
            board: {
                select: {
                    title: true,
                },
            },
            admissionClass: {
                select: {
                    classTitle: true,
                    classType: true,
                },
            },
            currentClass: {
                select: {
                    classTitle: true,
                    classType: true,
                },
            },
            previousSchoolInfo: true,
        },
    });
};

// Master Lookup

export const findSessionByNameRepo = async (
    schoolSlug,
    name
) => {
    return prisma.session.findFirst({
        where: {
            schoolSlug,
            name,
            isActive: true,
            deletedAt: null,
        },
    });
};

export const findBoardByTitleRepo = async (
    schoolSlug,
    title
) => {
    return prisma.board.findFirst({
        where: {
            schoolSlug,
            title,
            isActive: true,
            deletedAt: null,
        },
    });
};

export const findClassByTitleRepo = async ({
    schoolSlug,
    boardSlug,
    classTitle,
}) => {
    return prisma.class.findFirst({
        where: {
            schoolSlug,
            boardSlug,
            classTitle,
            isActive: true,
            deletedAt: null,
        },
    });
};