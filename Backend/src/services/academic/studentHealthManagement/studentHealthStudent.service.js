import {
    findHealthSessionByNameRepo,
    findActiveHealthSessionRepo,
    findHealthBoardByTitleRepo,
    findHealthClassByTitleRepo,
    findHealthSectionByTitleRepo,
    getHealthManagementStudentsRepo,
} from "../../../repositories/academic/studentHealthManagement/studentHealthStudent.repository.js";

export const getHealthManagementStudentsService = async (
    query,
    user,
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error(
            "School information not found",
        );
    }

    const {
        academicYear,
        board,
        classTitle,
        section,
        category,
        search,
    } = query;

    const sessionData =
        await findHealthSessionByNameRepo(
            schoolSlug,
            academicYear,
        );

    if (!sessionData) {
        throw new Error(
            "Selected academic year not found",
        );
    }

    let boardData = null;

    if (board) {
        boardData =
            await findHealthBoardByTitleRepo(
                schoolSlug,
                board,
            );

        if (!boardData) {
            throw new Error(
                "Selected board not found",
            );
        }
    }

    let classData = null;

    if (classTitle) {
        classData =
            await findHealthClassByTitleRepo({
                schoolSlug,
                boardSlug: boardData?.slug,
                classTitle,
            });

        if (!classData) {
            throw new Error(
                "Selected class not found",
            );
        }
    }

    let sectionData = null;

    if (section) {
        sectionData =
            await findHealthSectionByTitleRepo(
                schoolSlug,
                section,
            );

        if (!sectionData) {
            throw new Error(
                "Selected section not found",
            );
        }
    }

    const mappings =
        await getHealthManagementStudentsRepo({
            schoolSlug,
            sessionSlug: sessionData.slug,
            boardSlug: boardData?.slug,
            classSlug: classData?.slug,
            sectionSlug: sectionData?.slug,
            category:
                category || undefined,
            search:
                search?.trim() || undefined,
        });

    const students = mappings.map(
        (mapping) => {
            const student =
                mapping.student;

            const healthAssessment =
                student
                    ?.healthAssessments?.[0] ||
                null;

            const otherInformation =
                student?.otherInformation ||
                null;

            return {
                mappingSlug: mapping.slug,

                studentSlug:
                    student.slug,

                admissionNumber:
                    student.admissionNumber,

                studentName:
                    student.studentName,

                dob:
                    student.dob,

                phone:
                    student.phone,

                gender:
                    student.gender,

                category:
                    student.category,

                fatherName:
                    student.fatherName,

                motherName:
                    student.motherName,

                profileImage:
                    student.profileImage,

                rollNumber:
                    mapping.rollNumber,

                sectionSlug:
                    mapping.section?.slug ||
                    null,

                section:
                    mapping.section?.sectionTitle ||
                    "-",

                streamSlug:
                    mapping.stream?.slug ||
                    null,

                stream:
                    mapping.stream?.streamTitle ||
                    "-",

                sessionSlug:
                    mapping.session?.slug ||
                    null,

                academicYear:
                    mapping.session?.name ||
                    "-",

                boardSlug:
                    mapping.board?.slug ||
                    null,

                board:
                    mapping.board?.title ||
                    "-",

                classSlug:
                    mapping.class?.slug ||
                    null,

                classTitle:
                    mapping.class
                        ?.classTitle || "-",

                classType:
                    mapping.class
                        ?.classType || "-",

                academicStatus:
                    mapping.academicStatus,

                bloodGroup:
                    otherInformation
                        ?.studentBloodGroup ||
                    "-",

                healthAssessmentSlug:
                    healthAssessment?.slug ||
                    null,

                hasHealthAssessment:
                    Boolean(
                        healthAssessment,
                    ),

                otherInformationSlug:
                    otherInformation?.slug ||
                    null,

                hasOtherInformation:
                    Boolean(
                        otherInformation,
                    ),
            };
        },
    );

    return {
        total: students.length,
        students,
    };
};