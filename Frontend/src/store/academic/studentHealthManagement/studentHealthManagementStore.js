import { create } from "zustand";
import toast from "react-hot-toast";

import { studentHealthManagementApi } from "../../../api/academic/studentHealthManagement/studentHealthManagementApi";

const getArrayData = (response) => {
    if (Array.isArray(response?.data?.data)) {
        return response.data.data;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response)) {
        return response;
    }

    return [];
};

export const useStudentHealthManagementStore = create(
    (set, get) => ({
        students: [],
        sessions: [],
        boards: [],
        classes: [],
        sections: [],

        selectedStudent: null,

        loading: false,
        filterLoading: false,
        submitLoading: false,

        currentAcademicYear: "",

        filters: {
            board: "",
            classTitle: "",
            section: "",
            academicYear: "",
            category: "",
            search: "",
        },

        setSelectedStudent: (student) => {
            set({
                selectedStudent: student,
            });
        },

        setFilter: (field, value) => {
            set((state) => ({
                filters: {
                    ...state.filters,
                    [field]: value,
                },
            }));
        },

        resetDependentFilters: (fields = []) => {
            set((state) => {
                const updatedFilters = {
                    ...state.filters,
                };

                fields.forEach((field) => {
                    updatedFilters[field] = "";
                });

                return {
                    filters: updatedFilters,
                };
            });
        },

        fetchSessions: async () => {
            try {
                set({
                    filterLoading: true,
                });

                const res =
                    await studentHealthManagementApi.getSessions();

                const sessions = getArrayData(res);

                set({
                    sessions,
                });

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch academic years",
                );

                return false;
            } finally {
                set({
                    filterLoading: false,
                });
            }
        },

        fetchBoards: async () => {
            try {
                set({
                    filterLoading: true,
                });

                const res =
                    await studentHealthManagementApi.getBoards();

                set({
                    boards: getArrayData(res),
                });

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch boards",
                );

                return false;
            } finally {
                set({
                    filterLoading: false,
                });
            }
        },

        fetchClasses: async () => {
            try {
                const { filters } = get();

                set({
                    classes: [],
                    sections: [],
                });

                if (!filters.academicYear || !filters.board) {
                    return true;
                }

                set({
                    filterLoading: true,
                });

                const res =
                    await studentHealthManagementApi.getClasses({
                        session: filters.academicYear,
                        board: filters.board,
                    });

                set({
                    classes: getArrayData(res),
                });

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch classes",
                );

                return false;
            } finally {
                set({
                    filterLoading: false,
                });
            }
        },

        fetchSections: async () => {
            try {
                const { filters } = get();

                set({
                    sections: [],
                });

                if (
                    !filters.academicYear ||
                    !filters.board ||
                    !filters.classTitle
                ) {
                    return true;
                }

                set({
                    filterLoading: true,
                });

                const res =
                    await studentHealthManagementApi.getClassMappings({
                        session: filters.academicYear,
                        board: filters.board,
                        classTitle: filters.classTitle,
                    });

                const mappings =
                    res?.data?.data ||
                    res?.data ||
                    [];

                const mappingList = Array.isArray(mappings)
                    ? mappings
                    : mappings
                        ? [mappings]
                        : [];

                const sectionMap = new Map();

                mappingList.forEach((mapping) => {
                    if (Array.isArray(mapping?.sections)) {
                        mapping.sections.forEach((section) => {
                            const sectionSlug =
                                section?.slug ||
                                section?.sectionSlug;

                            const sectionTitle =
                                section?.title ||
                                section?.sectionTitle ||
                                section?.name;

                            if (sectionSlug && sectionTitle) {
                                sectionMap.set(sectionSlug, {
                                    slug: sectionSlug,
                                    title: sectionTitle,
                                });
                            }
                        });
                    }

                    if (mapping?.section) {
                        const sectionSlug =
                            mapping.section?.slug ||
                            mapping.sectionSlug;

                        const sectionTitle =
                            mapping.section?.title ||
                            mapping.section?.sectionTitle ||
                            mapping.section?.name;

                        if (sectionSlug && sectionTitle) {
                            sectionMap.set(sectionSlug, {
                                slug: sectionSlug,
                                title: sectionTitle,
                            });
                        }
                    }
                });

                set({
                    sections: Array.from(sectionMap.values()),
                });

                return true;
            } catch (error) {
                set({
                    sections: [],
                });

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch sections",
                );

                return false;
            } finally {
                set({
                    filterLoading: false,
                });
            }
        },

        fetchStudents: async () => {
            try {
                const { filters } = get();

                set({
                    loading: true,
                    students: [],
                });

                const params = {};

                if (filters.academicYear) {
                    params.academicYear = filters.academicYear;
                }

                if (filters.board) {
                    params.board = filters.board;
                }

                if (filters.classTitle) {
                    params.classTitle = filters.classTitle;
                }

                if (filters.section) {
                    params.section = filters.section;
                }

                if (filters.category) {
                    params.category = filters.category;
                }

                if (filters.search?.trim()) {
                    params.search = filters.search.trim();
                }

                const res =
                    await studentHealthManagementApi.getStudents(
                        params,
                    );

                const responseData =
                    res?.data?.data || res?.data || {};

                set({
                    students: responseData?.students || [],
                    currentAcademicYear:
                        responseData?.academicYear || "",
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

        createHealthAssessment: async (payload) => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await studentHealthManagementApi.createHealthAssessment(
                        payload,
                    );

                toast.success(
                    res?.message ||
                    "Student health assessment created successfully",
                );

                await get().fetchStudents();

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to create health assessment",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        updateHealthAssessment: async (slug, payload) => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await studentHealthManagementApi.updateHealthAssessment(
                        slug,
                        payload,
                    );

                toast.success(
                    res?.message ||
                    "Student health assessment updated successfully",
                );

                await get().fetchStudents();

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to update health assessment",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        createOtherInformation: async (payload) => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await studentHealthManagementApi.createOtherInformation(
                        payload,
                    );

                toast.success(
                    res?.message ||
                    "Student other information created successfully",
                );

                await get().fetchStudents();

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to create other information",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        updateOtherInformation: async (slug, payload) => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await studentHealthManagementApi.updateOtherInformation(
                        slug,
                        payload,
                    );

                toast.success(
                    res?.message ||
                    "Student other information updated successfully",
                );

                await get().fetchStudents();

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to update other information",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },
    }),
);