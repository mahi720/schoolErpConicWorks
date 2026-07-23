import API from "../../../api/axios/axios";

const STUDENT_ACADEMIC_MAPPING_URL =
    "/student-academic-mappings";

export const studentAcademicMappingApi = {
    /*
    |--------------------------------------------------------------------------
    | Dropdown Setup
    |--------------------------------------------------------------------------
    |
    | ClassSectionStreamMapping table se:
    | board → class → section → stream
    |
    */

    getSetup: async (params = {}) => {
        const response = await API.get(
            `${STUDENT_ACADEMIC_MAPPING_URL}/setup`,
            {
                params,
            },
        );

        return response.data;
    },

    /*
    |--------------------------------------------------------------------------
    | Before Mapping Students
    |--------------------------------------------------------------------------
    |
    | Student table se unmapped students
    |
    */

    getUnmappedStudents: async (params = {}) => {
        const response = await API.get(
            `${STUDENT_ACADEMIC_MAPPING_URL}/unmapped-students`,
            {
                params,
            },
        );

        return response.data;
    },

    /*
    |--------------------------------------------------------------------------
    | After Mapping Students
    |--------------------------------------------------------------------------
    |
    | StudentAcademicRollSectionStreamMapping table se data
    |
    */

    getMappedStudents: async (params = {}) => {
        const response = await API.get(
            `${STUDENT_ACADEMIC_MAPPING_URL}/mapped-students`,
            {
                params,
            },
        );

        return response.data;
    },

    /*
    |--------------------------------------------------------------------------
    | Get Mapping By Slug
    |--------------------------------------------------------------------------
    */

    getBySlug: async (slug) => {
        const response = await API.get(
            `${STUDENT_ACADEMIC_MAPPING_URL}/${slug}`,
        );

        return response.data;
    },

    /*
    |--------------------------------------------------------------------------
    | Create / Bulk Section Mapping
    |--------------------------------------------------------------------------
    */

    create: async (payload) => {
        const response = await API.post(
            STUDENT_ACADEMIC_MAPPING_URL,
            payload,
        );

        return response.data;
    },

    /*
    |--------------------------------------------------------------------------
    | Update Single Mapping
    |--------------------------------------------------------------------------
    |
    | Is endpoint se:
    | - section update
    | - stream update
    | - roll number update
    | - prefix update
    |
    */

    update: async (slug, payload) => {
        const response = await API.patch(
            `${STUDENT_ACADEMIC_MAPPING_URL}/${slug}`,
            payload,
        );

        return response.data;
    },

    /*
    |--------------------------------------------------------------------------
    | Soft Delete Mapping
    |--------------------------------------------------------------------------
    */

    delete: async (slug) => {
        const response = await API.delete(
            `${STUDENT_ACADEMIC_MAPPING_URL}/${slug}`,
        );

        return response.data;
    },

    /*
    |--------------------------------------------------------------------------
    | Restore Mapping
    |--------------------------------------------------------------------------
    */

    restore: async (slug) => {
        const response = await API.patch(
            `${STUDENT_ACADEMIC_MAPPING_URL}/${slug}/restore`,
        );

        return response.data;
    },
};