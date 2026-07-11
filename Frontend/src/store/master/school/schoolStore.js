import { create } from "zustand";
import toast from "react-hot-toast";

import { schoolApi } from "../../../api/master/school/schoolApi";

export const useSchoolStore = create((set, get) => ({
    schools: [],
    schoolData: null,
    selectedSchool: null,

    loading: false,
    submitLoading: false,

    setSelectedSchool: (school) => {
        set({
            selectedSchool: school,
        });
    },

    fetchSchools: async () => {
        try {
            set({
                loading: true,
            });

            const res = await schoolApi.getAll();

            set({
                schools: res.data?.data || [],
            });
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch schools",
            );
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchMySchool: async () => {
        try {
            set({
                loading: true,
            });

            const res = await schoolApi.getMySchool();

            set({
                schoolData: res.data?.data || null,
            });

            return res.data?.data || null;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch school information",
            );

            return null;
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchSchoolBySlug: async (slug) => {
        try {
            set({
                loading: true,
            });

            const res = await schoolApi.getBySlug(slug);

            set({
                selectedSchool: res.data?.data || null,
            });

            return res.data?.data || null;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch school",
            );

            return null;
        } finally {
            set({
                loading: false,
            });
        }
    },

    createSchool: async (formData) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await schoolApi.create(formData);
            const newSchool = res.data?.data;

            if (newSchool) {
                set((state) => ({
                    schools: [newSchool, ...state.schools],
                }));
            }

            toast.success(
                res.data?.message ||
                "School created successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to create school",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    updateSchool: async (slug, formData) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await schoolApi.update(
                slug,
                formData,
            );

            const updatedSchool = res.data?.data;

            if (updatedSchool) {
                set((state) => ({
                    schools: state.schools.map((school) =>
                        school.slug === slug
                            ? updatedSchool
                            : school,
                    ),

                    selectedSchool:
                        state.selectedSchool?.slug === slug
                            ? updatedSchool
                            : state.selectedSchool,

                    schoolData:
                        state.schoolData?.slug === slug
                            ? updatedSchool
                            : state.schoolData,
                }));
            }

            toast.success(
                res.data?.message ||
                "School updated successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to update school",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    updateMySchool: async (formData) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await schoolApi.updateMySchool(
                formData,
            );

            const updatedSchool = res.data?.data;

            set((state) => ({
                schoolData: updatedSchool || state.schoolData,

                schools: updatedSchool
                    ? state.schools.map((school) =>
                        school.slug === updatedSchool.slug
                            ? updatedSchool
                            : school,
                    )
                    : state.schools,
            }));

            toast.success(
                res.data?.message ||
                "School information updated successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to update school information",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    deleteSchool: async (slug) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await schoolApi.delete(slug);
            const deletedSchool = res.data?.data;

            set((state) => ({
                schools: state.schools.map((school) =>
                    school.slug === slug
                        ? deletedSchool
                        : school,
                ),

                schoolData:
                    state.schoolData?.slug === slug
                        ? deletedSchool
                        : state.schoolData,
            }));

            toast.success(
                res.data?.message ||
                "School deactivated successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to deactivate school",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    restoreSchool: async (slug) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await schoolApi.restore(slug);
            const restoredSchool = res.data?.data;

            set((state) => ({
                schools: state.schools.map((school) =>
                    school.slug === slug
                        ? restoredSchool
                        : school,
                ),

                schoolData:
                    state.schoolData?.slug === slug
                        ? restoredSchool
                        : state.schoolData,
            }));

            toast.success(
                res.data?.message ||
                "School restored successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to restore school",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },
}));