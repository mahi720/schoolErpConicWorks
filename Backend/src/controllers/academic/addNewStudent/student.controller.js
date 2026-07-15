import {
    createStudentService,
    getStudentsService,
    getStudentBySlugService,
    updateStudentService,
    deleteStudentService,
    restoreStudentService,
} from "../../../services/academic/addNewStudent/student.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";


// Create Student

export const createStudent = async (req, res) => {
    try {
        const student = await createStudentService(
            req.body,
            req.user
        );

        return successResponse(
            res,
            201,
            "Student created successfully",
            student
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message
        );
    }
};


// Get All Students


export const getStudents = async (req, res) => {
    try {
        const students = await getStudentsService(
            req.user
        );

        return successResponse(
            res,
            200,
            "Students fetched successfully",
            students
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message
        );
    }
};


// Get Student By Slug


export const getStudentBySlug = async (
    req,
    res
) => {
    try {
        const student =
            await getStudentBySlugService(
                req.params.slug,
                req.user
            );

        return successResponse(
            res,
            200,
            "Student fetched successfully",
            student
        );
    } catch (error) {
        return errorResponse(
            res,
            404,
            error.message
        );
    }
};


// Update Student


export const updateStudent = async (
    req,
    res
) => {
    try {
        const student =
            await updateStudentService(
                req.params.slug,
                req.body,
                req.user
            );

        return successResponse(
            res,
            200,
            "Student updated successfully",
            student
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message
        );
    }
};


// Delete Student


export const deleteStudent = async (
    req,
    res
) => {
    try {
        await deleteStudentService(
            req.params.slug,
            req.user
        );

        return successResponse(
            res,
            200,
            "Student deleted successfully"
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message
        );
    }
};


// Restore Student


export const restoreStudent = async (
    req,
    res
) => {
    try {
        const student =
            await restoreStudentService(
                req.params.slug,
                req.user
            );

        return successResponse(
            res,
            200,
            "Student restored successfully",
            student
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message
        );
    }
};