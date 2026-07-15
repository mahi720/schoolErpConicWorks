import crypto from "crypto";

import {
    findStudentByAdmissionNumberRepo,
    createStudentRepo,
    findSessionByNameRepo,
    findBoardByTitleRepo,
    findClassByTitleRepo,
} from "../../../repositories/academic/addNewStudent/student.repository.js";

const generateSlug = () => crypto.randomUUID();

const formatStudent = (student) => ({
    slug: student.slug,

    admissionNumber: student.admissionNumber,
    admissionDate: student.admissionDate,

    admissionSession: student.admissionSession?.name,
    currentSession: student.currentSession?.name,

    board: student.board?.title,

    admissionClass: student.admissionClass?.classTitle,
    admissionClassType: student.admissionClass?.classType,

    currentClass: student.currentClass?.classTitle,
    currentClassType: student.currentClass?.classType,

    sponsorshipType: student.sponsorshipType,
    sponsorshipRemarks: student.sponsorshipRemarks,

    studentName: student.studentName,
    fatherName: student.fatherName,
    motherName: student.motherName,

    aadhaarNumber: student.aadhaarNumber,
    apaarId: student.apaarId,
    penNumber: student.penNumber,
    sats: student.sats,

    dob: student.dob,
    placeOfBirth: student.placeOfBirth,

    caste: student.caste,
    category: student.category,
    religion: student.religion,
    gender: student.gender,

    phone: student.phone,
    motherPhone: student.motherPhone,
    email: student.email,

    state: student.state,
    district: student.district,
    city: student.city,
    address: student.address,

    motherTongue: student.motherTongue,
    secondLanguage: student.secondLanguage,
    bloodGroup: student.bloodGroup,

    profileImage: student.profileImage,

    previousSchoolInfo: student.previousSchoolInfo,

    status: student.status,
    isActive: student.isActive,

    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
});

export const createStudentService = async (body, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }


    // Duplicate Admission Number


    const existingStudent =
        await findStudentByAdmissionNumberRepo(
            schoolSlug,
            body.admissionNumber.trim()
        );

    if (existingStudent) {
        throw new Error(
            "Admission number already exists"
        );
    }


    // Admission Session


    const admissionSession =
        await findSessionByNameRepo(
            schoolSlug,
            body.admissionSession.trim()
        );

    if (!admissionSession) {
        throw new Error(
            "Admission session not found"
        );
    }


    // Current Session


    const currentSession =
        await findSessionByNameRepo(
            schoolSlug,
            body.currentSession.trim()
        );

    if (!currentSession) {
        throw new Error(
            "Current session not found"
        );
    }


    // Board


    const board =
        await findBoardByTitleRepo(
            schoolSlug,
            body.board.trim()
        );

    if (!board) {
        throw new Error("Board not found");
    }


    // Admission Class


    const admissionClass =
        await findClassByTitleRepo({
            schoolSlug,
            boardSlug: board.slug,
            classTitle: body.admissionClass.trim(),
        });

    if (!admissionClass) {
        throw new Error(
            "Admission class not found"
        );
    }


    // Current Class


    const currentClass =
        await findClassByTitleRepo({
            schoolSlug,
            boardSlug: board.slug,
            classTitle: body.currentClass.trim(),
        });

    if (!currentClass) {
        throw new Error(
            "Current class not found"
        );
    }


    // Student Data


    const studentData = {
        slug: generateSlug(),

        schoolSlug,

        admissionNumber:
            body.admissionNumber.trim(),

        admissionDate: new Date(
            body.admissionDate
        ),

        admissionSessionSlug:
            admissionSession.slug,

        currentSessionSlug:
            currentSession.slug,

        boardSlug: board.slug,

        admissionClassSlug:
            admissionClass.slug,

        currentClassSlug:
            currentClass.slug,

        sponsorshipType:
            body.sponsorshipType || null,

        sponsorshipRemarks:
            body.sponsorshipRemarks || null,

        studentName:
            body.studentName.trim(),

        fatherName:
            body.fatherName.trim(),

        motherName:
            body.motherName.trim(),

        aadhaarNumber:
            body.aadhaarNumber || null,

        apaarId:
            body.apaarId || null,

        penNumber:
            body.penNumber || null,

        sats:
            body.sats || null,

        dob: body.dob
            ? new Date(body.dob)
            : null,

        placeOfBirth:
            body.placeOfBirth || null,

        caste:
            body.caste || null,

        category:
            body.category || null,

        religion:
            body.religion || null,

        gender:
            body.gender,

        phone:
            body.phone || null,

        motherPhone:
            body.motherPhone || null,

        email:
            body.email || null,

        state:
            body.state || null,

        district:
            body.district || null,

        city:
            body.city || null,

        address:
            body.address || null,

        motherTongue:
            body.motherTongue || null,

        secondLanguage:
            body.secondLanguage || null,

        bloodGroup:
            body.bloodGroup || null,

        profileImage:
            body.profileImage || null,

        status:
            body.status || "active",

        isActive: true,
    };

    // Previous School

    let previousSchoolData = null;

    const hasPreviousData =
        body.previousSchool ||
        body.schoolAddress ||
        body.previousBoard ||
        body.previousResult;

    if (hasPreviousData) {
        previousSchoolData = {
            slug: generateSlug(),

            previousSchool:
                body.previousSchool || null,

            schoolAddress:
                body.schoolAddress || null,

            previousBoard:
                body.previousBoard || null,

            previousResult:
                body.previousResult || null,
        };
    }

    const student =
        await createStudentRepo(
            studentData,
            previousSchoolData
        );

    return formatStudent(student);
};

export const getStudentsService = async (user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const students = await getStudentsRepo(schoolSlug);

    return students.map(formatStudent);
};

export const getStudentBySlugService = async (
    slug,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const student = await getStudentBySlugRepo(
        slug,
        schoolSlug
    );

    if (!student) {
        throw new Error("Student not found");
    }

    return formatStudent(student);
};

export const updateStudentService = async (
    slug,
    body,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const existingStudent =
        await getStudentBySlugRepo(
            slug,
            schoolSlug
        );

    if (!existingStudent) {
        throw new Error("Student not found");
    }


    // Admission Number Duplicate


    if (
        body.admissionNumber &&
        body.admissionNumber.trim() !==
        existingStudent.admissionNumber
    ) {
        const duplicate =
            await findStudentByAdmissionNumberRepo(
                schoolSlug,
                body.admissionNumber.trim()
            );

        if (
            duplicate &&
            duplicate.slug !== existingStudent.slug
        ) {
            throw new Error(
                "Admission number already exists"
            );
        }
    }


    // Admission Session


    let admissionSessionSlug =
        existingStudent.admissionSessionSlug;

    if (body.admissionSession) {
        const session =
            await findSessionByNameRepo(
                schoolSlug,
                body.admissionSession.trim()
            );

        if (!session) {
            throw new Error(
                "Admission session not found"
            );
        }

        admissionSessionSlug = session.slug;
    }


    // Current Session


    let currentSessionSlug =
        existingStudent.currentSessionSlug;

    if (body.currentSession) {
        const session =
            await findSessionByNameRepo(
                schoolSlug,
                body.currentSession.trim()
            );

        if (!session) {
            throw new Error(
                "Current session not found"
            );
        }

        currentSessionSlug = session.slug;
    }


    // Board


    let boardSlug =
        existingStudent.boardSlug;

    if (body.board) {
        const board =
            await findBoardByTitleRepo(
                schoolSlug,
                body.board.trim()
            );

        if (!board) {
            throw new Error("Board not found");
        }

        boardSlug = board.slug;
    }


    // Admission Class


    let admissionClassSlug =
        existingStudent.admissionClassSlug;

    if (body.admissionClass) {
        const cls =
            await findClassByTitleRepo({
                schoolSlug,
                boardSlug,
                classTitle:
                    body.admissionClass.trim(),
            });

        if (!cls) {
            throw new Error(
                "Admission class not found"
            );
        }

        admissionClassSlug = cls.slug;
    }


    // Current Class


    let currentClassSlug =
        existingStudent.currentClassSlug;

    if (body.currentClass) {
        const cls =
            await findClassByTitleRepo({
                schoolSlug,
                boardSlug,
                classTitle:
                    body.currentClass.trim(),
            });

        if (!cls) {
            throw new Error(
                "Current class not found"
            );
        }

        currentClassSlug = cls.slug;
    }


    // Student Update Object


    const studentData = {
        admissionNumber:
            body.admissionNumber?.trim() ??
            existingStudent.admissionNumber,

        admissionDate: body.admissionDate
            ? new Date(body.admissionDate)
            : existingStudent.admissionDate,

        admissionSessionSlug,

        currentSessionSlug,

        boardSlug,

        admissionClassSlug,

        currentClassSlug,

        sponsorshipType:
            body.sponsorshipType ??
            existingStudent.sponsorshipType,

        sponsorshipRemarks:
            body.sponsorshipRemarks ??
            existingStudent.sponsorshipRemarks,

        studentName:
            body.studentName ??
            existingStudent.studentName,

        fatherName:
            body.fatherName ??
            existingStudent.fatherName,

        motherName:
            body.motherName ??
            existingStudent.motherName,

        aadhaarNumber:
            body.aadhaarNumber ??
            existingStudent.aadhaarNumber,

        apaarId:
            body.apaarId ??
            existingStudent.apaarId,

        penNumber:
            body.penNumber ??
            existingStudent.penNumber,

        sats:
            body.sats ??
            existingStudent.sats,

        dob:
            body.dob !== undefined
                ? body.dob
                    ? new Date(body.dob)
                    : null
                : existingStudent.dob,

        placeOfBirth:
            body.placeOfBirth ??
            existingStudent.placeOfBirth,

        caste:
            body.caste ??
            existingStudent.caste,

        category:
            body.category ??
            existingStudent.category,

        religion:
            body.religion ??
            existingStudent.religion,

        gender:
            body.gender ??
            existingStudent.gender,

        phone:
            body.phone ??
            existingStudent.phone,

        motherPhone:
            body.motherPhone ??
            existingStudent.motherPhone,

        email:
            body.email ??
            existingStudent.email,

        state:
            body.state ??
            existingStudent.state,

        district:
            body.district ??
            existingStudent.district,

        city:
            body.city ??
            existingStudent.city,

        address:
            body.address ??
            existingStudent.address,

        motherTongue:
            body.motherTongue ??
            existingStudent.motherTongue,

        secondLanguage:
            body.secondLanguage ??
            existingStudent.secondLanguage,

        bloodGroup:
            body.bloodGroup ??
            existingStudent.bloodGroup,

        profileImage:
            body.profileImage ??
            existingStudent.profileImage,

        status:
            body.status ??
            existingStudent.status,
    };

    let previousSchoolData = null;

    if (
        body.previousSchool !== undefined ||
        body.schoolAddress !== undefined ||
        body.previousBoard !== undefined ||
        body.previousResult !== undefined
    ) {
        previousSchoolData = {
            previousSchool:
                body.previousSchool ?? null,

            schoolAddress:
                body.schoolAddress ?? null,

            previousBoard:
                body.previousBoard ?? null,

            previousResult:
                body.previousResult ?? null,
        };
    }

    const updatedStudent =
        await updateStudentRepo(
            existingStudent.id,
            studentData,
            previousSchoolData
        );

    return formatStudent(updatedStudent);
};

export const deleteStudentService = async (
    slug,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const student = await getStudentBySlugRepo(
        slug,
        schoolSlug
    );

    if (!student) {
        throw new Error("Student not found");
    }

    await deleteStudentRepo(student.id);

    return {
        slug: student.slug,
    };
};

export const restoreStudentService = async (
    slug,
    user
) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const deletedStudent =
        await getDeletedStudentRepo(
            slug,
            schoolSlug
        );

    if (!deletedStudent) {
        throw new Error(
            "Deleted student not found"
        );
    }

    const restoredStudent =
        await restoreStudentRepo(
            deletedStudent.id
        );

    const student =
        await getStudentBySlugRepo(
            restoredStudent.slug,
            schoolSlug
        );

    return formatStudent(student);
};