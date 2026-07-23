import { create } from "zustand";
import toast from "react-hot-toast";

import { studentApi } from "../../../api/academic/addNewStudent/studentApi";

export const useStudentStore = create((set, get) => ({
    students: [],
    inactiveStudents: [],

    loading: false,
    inactiveLoading: false,
    submitLoading: false,

    selectedStudent: null,

    // Active students
    fetchStudents: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const res = await studentApi.getAll({
                ...params,
                status: "active",
            });

            set({
                students: Array.isArray(res.data?.data)
                    ? res.data.data
                    : [],
            });

            return true;
        } catch (error) {
            set({
                students: [],
            });

            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch students",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    // Inactive students
    fetchInactiveStudents: async (params = {}) => {
        try {
            set({
                inactiveLoading: true,
            });

            const res = await studentApi.getAll({
                ...params,
                status: "inactive",
            });

            set({
                inactiveStudents: Array.isArray(res.data?.data)
                    ? res.data.data
                    : [],
            });

            return true;
        } catch (error) {
            set({
                inactiveStudents: [],
            });

            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch inactive students",
            );

            return false;
        } finally {
            set({
                inactiveLoading: false,
            });
        }
    },

    fetchStudentBySlug: async (slug) => {
        try {
            set({
                loading: true,
            });

            const res =
                await studentApi.getBySlug(
                    slug,
                );

            set({
                selectedStudent:
                    res.data?.data || null,
            });

            return res.data?.data || null;
        } catch (error) {
            set({
                selectedStudent: null,
            });

            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch student",
            );

            return null;
        } finally {
            set({
                loading: false,
            });
        }
    },

    createStudent: async (payload) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await studentApi.create(payload);
            const createdStudent = res.data?.data;

            set({
                students: [
                    createdStudent,
                    ...get().students,
                ],
            });

            toast.success(
                res.data?.message ||
                "Student created successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to create student",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    updateStudent: async (slug, payload) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await studentApi.update(
                slug,
                payload,
            );

            const updatedStudent = res.data?.data;

            set({
                students: get().students.map((student) =>
                    student.slug === slug
                        ? updatedStudent
                        : student,
                ),

                selectedStudent:
                    get().selectedStudent?.slug === slug
                        ? updatedStudent
                        : get().selectedStudent,
            });

            toast.success(
                res.data?.message ||
                "Student updated successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to update student",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    deleteStudent: async (slug) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await studentApi.delete(slug);

            const deletedStudent = {
                ...get().students.find(
                    (student) => student.slug === slug,
                ),
                ...res.data?.data,
                status: "inactive",
                isActive: false,
                deletedAt:
                    res.data?.data?.deletedAt ||
                    new Date().toISOString(),
            };

            set({
                // Active list se remove
                students: get().students.filter(
                    (student) => student.slug !== slug,
                ),

                // Inactive list me add
                inactiveStudents: [
                    deletedStudent,
                    ...get().inactiveStudents.filter(
                        (student) => student.slug !== slug,
                    ),
                ],

                selectedStudent:
                    get().selectedStudent?.slug === slug
                        ? null
                        : get().selectedStudent,
            });

            toast.success(
                res.data?.message ||
                "Student deleted successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to delete student",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    restoreStudent: async (slug) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await studentApi.restore(slug);
            const restoredStudent = res.data?.data;

            set({
                // Inactive list se remove
                inactiveStudents:
                    get().inactiveStudents.filter(
                        (student) => student.slug !== slug,
                    ),

                // Active list me add
                students: get().students.some(
                    (student) => student.slug === slug,
                )
                    ? get().students.map((student) =>
                        student.slug === slug
                            ? restoredStudent
                            : student,
                    )
                    : [
                        restoredStudent,
                        ...get().students,
                    ],
            });

            toast.success(
                res.data?.message ||
                "Student restored successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to restore student",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    setSelectedStudent: (student) => {
        set({
            selectedStudent: student,
        });
    },

    clearSelectedStudent: () => {
        set({
            selectedStudent: null,
        });
    },

    clearStudents: () => {
        set({
            students: [],
            selectedStudent: null,
        });
    },

    clearInactiveStudents: () => {
        set({
            inactiveStudents: [],
        });
    },
}));