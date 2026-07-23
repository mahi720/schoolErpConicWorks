import { create } from "zustand";
import toast from "react-hot-toast";

import { studentAcademicMappingApi } from "../../../api/academic/studentAcademicMapping/studentAcademicMappingApi";

const initialSelectionState = {
    selectedSession: "",
    selectedBoard: "",
    selectedClass: "",
    selectedSection: "",
    selectedStream: "",
};

/*
|--------------------------------------------------------------------------
| Mapping Slug Helper
|--------------------------------------------------------------------------
|
| Backend PATCH route ko student slug nahi,
| StudentAcademicRollSectionStreamMapping ka slug chahiye.
|
*/

const getMappingSlug = (student) => {
    return (
        student?.mappingSlug ||
        student?.academicMappingSlug ||
        student?.academicMapping?.slug ||
        null
    );
};

/*
|--------------------------------------------------------------------------
| Parse Formatted Roll Number
|--------------------------------------------------------------------------
|
| UKG-001 =>
|
| basePrefix: UKG-
| startNumber: 1
| paddingLength: 3
|
*/

const parseFormattedRollNumber = (
    formattedRollNumber,
) => {
    const normalizedValue =
        String(
            formattedRollNumber || "",
        ).trim();

    const match =
        normalizedValue.match(
            /^(.*?)(\d+)$/,
        );

    if (!match) {
        return null;
    }

    const basePrefix =
        match[1] || "";

    const numericPart =
        match[2];

    const startNumber =
        Number(numericPart);

    if (
        !Number.isInteger(
            startNumber,
        ) ||
        startNumber <= 0
    ) {
        return null;
    }

    return {
        basePrefix,
        startNumber,
        paddingLength:
            numericPart.length,
    };
};

/*
|--------------------------------------------------------------------------
| Generate Roll Payload
|--------------------------------------------------------------------------
|
| UKG-001:
|
| Student 1:
| prefix = UKG-00
| rollNumber = 1
|
| Student 10:
| prefix = UKG-0
| rollNumber = 10
|
| Backend concatenation:
| UKG-00 + 1 = UKG-001
| UKG-0 + 10 = UKG-010
|
*/

const generateRollPayload = ({
    basePrefix,
    rollNumber,
    paddingLength,
}) => {
    const numberText =
        String(rollNumber);

    const paddedNumber =
        numberText.padStart(
            paddingLength,
            "0",
        );

    const leadingZeroPart =
        paddedNumber.slice(
            0,
            Math.max(
                0,
                paddedNumber.length -
                numberText.length,
            ),
        );

    return {
        rollNumberPrefix:
            `${basePrefix}${leadingZeroPart}`,

        rollNumber,
    };
};

export const useStudentAcademicMappingStore = create(
    (set, get) => ({
        /*
        |--------------------------------------------------------------------------
        | Data States
        |--------------------------------------------------------------------------
        */

        academicSetup: null,

        boards: [],
        classes: [],
        sections: [],
        streams: [],

        unmappedStudents: [],
        mappedStudents: [],

        selectedMapping: null,

        /*
        |--------------------------------------------------------------------------
        | Loading States
        |--------------------------------------------------------------------------
        */

        loading: false,
        setupLoading: false,
        studentLoading: false,
        mappedStudentLoading: false,
        submitLoading: false,

        /*
        |--------------------------------------------------------------------------
        | Selection States
        |--------------------------------------------------------------------------
        */

        ...initialSelectionState,

        /*
        |--------------------------------------------------------------------------
        | Last Used Filters
        |--------------------------------------------------------------------------
        */

        lastUnmappedFilters: null,
        lastMappedFilters: null,

        /*
        |--------------------------------------------------------------------------
        | Basic Selection Actions
        |--------------------------------------------------------------------------
        */

        setSelectedSession: (session) => {
            set({
                selectedSession: session,

                selectedBoard: "",
                selectedClass: "",
                selectedSection: "",
                selectedStream: "",

                classes: [],
                sections: [],
                streams: [],

                unmappedStudents: [],
                mappedStudents: [],
            });
        },

        setSelectedBoard: (boardTitle) => {
            const { boards } = get();

            const selectedBoardData =
                boards.find(
                    (board) =>
                        board.title ===
                        boardTitle,
                );

            set({
                selectedBoard: boardTitle,

                selectedClass: "",
                selectedSection: "",
                selectedStream: "",

                classes:
                    selectedBoardData?.classes ||
                    [],

                sections: [],
                streams: [],

                unmappedStudents: [],
                mappedStudents: [],
            });
        },

        setSelectedClass: (classTitle) => {
            const { classes } = get();

            const selectedClassData =
                classes.find(
                    (classItem) =>
                        classItem.classTitle ===
                        classTitle,
                );

            set({
                selectedClass: classTitle,

                selectedSection: "",
                selectedStream: "",

                sections:
                    selectedClassData?.sections ||
                    [],

                streams:
                    selectedClassData?.streams ||
                    [],

                unmappedStudents: [],
                mappedStudents: [],
            });
        },

        setSelectedSection: (
            sectionSlug,
        ) => {
            set({
                selectedSection:
                    sectionSlug,
            });
        },

        setSelectedStream: (
            streamSlug,
        ) => {
            set({
                selectedStream:
                    streamSlug,
            });
        },

        setSelectedMapping: (
            mapping,
        ) => {
            set({
                selectedMapping: mapping,
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Fetch Dropdown Setup
        |--------------------------------------------------------------------------
        */

        fetchAcademicSetup: async (
            session,
        ) => {
            try {
                set({
                    setupLoading: true,

                    academicSetup: null,
                    boards: [],
                    classes: [],
                    sections: [],
                    streams: [],

                    selectedBoard: "",
                    selectedClass: "",
                    selectedSection: "",
                    selectedStream: "",

                    unmappedStudents: [],
                    mappedStudents: [],
                });

                const res =
                    await studentAcademicMappingApi.getSetup(
                        {
                            session,
                        },
                    );

                const setupData =
                    res?.data || null;

                set({
                    academicSetup:
                        setupData,

                    boards:
                        setupData?.boards ||
                        [],

                    selectedSession:
                        session,
                });
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to fetch academic setup",
                );

                set({
                    academicSetup: null,
                    boards: [],
                });
            } finally {
                set({
                    setupLoading: false,
                });
            }
        },

        /*
        |--------------------------------------------------------------------------
        | Fetch Unmapped Students
        |--------------------------------------------------------------------------
        */

        fetchUnmappedStudents: async (
            params = {},
        ) => {
            try {
                set({
                    studentLoading: true,
                    lastUnmappedFilters:
                        params,
                });

                const res =
                    await studentAcademicMappingApi.getUnmappedStudents(
                        params,
                    );

                set({
                    unmappedStudents:
                        res?.data
                            ?.students ||
                        [],
                });
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to fetch unmapped students",
                );

                set({
                    unmappedStudents: [],
                });
            } finally {
                set({
                    studentLoading: false,
                });
            }
        },

        /*
        |--------------------------------------------------------------------------
        | Fetch Mapped Students
        |--------------------------------------------------------------------------
        */

        fetchMappedStudents: async (
            params = {},
        ) => {
            try {
                set({
                    mappedStudentLoading:
                        true,

                    lastMappedFilters:
                        params,
                });

                const res =
                    await studentAcademicMappingApi.getMappedStudents(
                        params,
                    );

                set({
                    mappedStudents:
                        res?.data || [],
                });
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to fetch mapped students",
                );

                set({
                    mappedStudents: [],
                });
            } finally {
                set({
                    mappedStudentLoading:
                        false,
                });
            }
        },

        /*
        |--------------------------------------------------------------------------
        | Refresh Last Mapped List
        |--------------------------------------------------------------------------
        */

        refreshMappedStudents:
            async () => {
                const {
                    lastMappedFilters,
                } = get();

                if (!lastMappedFilters) {
                    return;
                }

                await get().fetchMappedStudents(
                    lastMappedFilters,
                );
            },

        /*
        |--------------------------------------------------------------------------
        | Get Mapping By Slug
        |--------------------------------------------------------------------------
        */

        fetchMappingBySlug: async (
            slug,
        ) => {
            try {
                set({
                    loading: true,
                    selectedMapping: null,
                });

                const res =
                    await studentAcademicMappingApi.getBySlug(
                        slug,
                    );

                set({
                    selectedMapping:
                        res?.data || null,
                });

                return res?.data || null;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to fetch student mapping",
                );

                return null;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        /*
        |--------------------------------------------------------------------------
        | Create / Assign Section
        |--------------------------------------------------------------------------
        |
        | Unmapped student ka academic mapping create hoga.
        |
        */

        createStudentMappings:
            async (payload) => {
                try {
                    set({
                        submitLoading: true,
                    });

                    const res =
                        await studentAcademicMappingApi.create(
                            payload,
                        );

                    toast.success(
                        res?.message ||
                        "Students mapped successfully",
                    );

                    const selectedStudentSlugs =
                        new Set(
                            payload.students.map(
                                (
                                    student,
                                ) =>
                                    student.studentSlug,
                            ),
                        );

                    set((state) => ({
                        unmappedStudents:
                            state.unmappedStudents.filter(
                                (
                                    student,
                                ) =>
                                    !selectedStudentSlugs.has(
                                        student.slug,
                                    ),
                            ),
                    }));

                    const {
                        lastMappedFilters,
                    } = get();

                    if (
                        lastMappedFilters
                    ) {
                        await get().fetchMappedStudents(
                            lastMappedFilters,
                        );
                    }

                    return true;
                } catch (error) {
                    toast.error(
                        error?.response
                            ?.data?.message ||
                        "Failed to map students",
                    );

                    return false;
                } finally {
                    set({
                        submitLoading:
                            false,
                    });
                }
            },

        /*
        |--------------------------------------------------------------------------
        | Update Single Mapping
        |--------------------------------------------------------------------------
        */

        updateStudentMapping:
            async (slug, payload) => {
                try {
                    set({
                        submitLoading: true,
                    });

                    const res =
                        await studentAcademicMappingApi.update(
                            slug,
                            payload,
                        );

                    const updatedMapping =
                        res?.data;

                    set((state) => ({
                        mappedStudents:
                            state.mappedStudents.map(
                                (item) =>
                                    item.slug ===
                                        slug
                                        ? {
                                            ...item,
                                            ...updatedMapping,
                                        }
                                        : item,
                            ),

                        selectedMapping:
                            state
                                .selectedMapping
                                ?.slug ===
                                slug
                                ? updatedMapping
                                : state.selectedMapping,
                    }));

                    toast.success(
                        res?.message ||
                        "Student academic mapping updated successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        error?.response
                            ?.data?.message ||
                        "Failed to update student mapping",
                    );

                    return false;
                } finally {
                    set({
                        submitLoading:
                            false,
                    });
                }
            },

        /*
        |--------------------------------------------------------------------------
        | Assign Stream To Selected Students
        |--------------------------------------------------------------------------
        |
        | Har selected mapped student par PATCH request jayegi.
        |
        */

        assignStreamToStudents:
            async ({
                students,
                streamSlug,
            }) => {
                try {
                    set({
                        submitLoading: true,
                    });

                    if (
                        !Array.isArray(
                            students,
                        ) ||
                        !students.length
                    ) {
                        toast.error(
                            "Select at least one student",
                        );

                        return false;
                    }

                    if (!streamSlug) {
                        toast.error(
                            "Please select a stream",
                        );

                        return false;
                    }

                    const updateResults =
                        [];

                    for (
                        const student of
                        students
                    ) {
                        const mappingSlug =
                            getMappingSlug(
                                student,
                            );

                        if (
                            !mappingSlug
                        ) {
                            toast.error(
                                "Student mapping slug not found",
                            );

                            return false;
                        }

                        try {
                            const res =
                                await studentAcademicMappingApi.update(
                                    mappingSlug,
                                    {
                                        streamSlug,
                                    },
                                );

                            updateResults.push(
                                {
                                    success:
                                        true,

                                    mappingSlug,

                                    data:
                                        res?.data ||
                                        null,
                                },
                            );
                        } catch (error) {
                            updateResults.push(
                                {
                                    success:
                                        false,

                                    mappingSlug,

                                    error,
                                },
                            );

                            break;
                        }
                    }

                    const failedResult =
                        updateResults.find(
                            (result) =>
                                !result.success,
                        );

                    if (failedResult) {
                        toast.error(
                            failedResult
                                ?.error
                                ?.response
                                ?.data
                                ?.message ||
                            "Failed to assign stream",
                        );

                        return false;
                    }

                    const updatedMap =
                        new Map(
                            updateResults.map(
                                (
                                    result,
                                ) => [
                                        result.mappingSlug,
                                        result.data,
                                    ],
                            ),
                        );

                    set((state) => ({
                        mappedStudents:
                            state.mappedStudents.map(
                                (item) => {
                                    const updated =
                                        updatedMap.get(
                                            item.slug,
                                        );

                                    return updated
                                        ? {
                                            ...item,
                                            ...updated,
                                        }
                                        : item;
                                },
                            ),
                    }));

                    toast.success(
                        "Stream assigned successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        error?.response?.data
                            ?.message ||
                        "Failed to assign stream",
                    );

                    return false;
                } finally {
                    set({
                        submitLoading:
                            false,
                    });
                }
            },

        /*
        |--------------------------------------------------------------------------
        | Assign Bulk Roll Numbers
        |--------------------------------------------------------------------------
        |
        | Example:
        |
        | Prefix: LKG-
        | Start: 1
        |
        | Student 1 => LKG-1
        | Student 2 => LKG-2
        | Student 3 => LKG-3
        |
        */

        /*
|--------------------------------------------------------------------------
| Assign Bulk Roll Numbers
|--------------------------------------------------------------------------
|
| firstRollNumber: UKG-001
|
| Selected 10 students:
|
| UKG-001
| UKG-002
| UKG-003
| ...
| UKG-010
|
*/

        assignBulkRollNumbers: async ({
            students = [],
            rollNumberPrefix,
            rollNumberStartFrom,
        }) => {
            try {
                set({
                    submitLoading: true,
                });

                /*
                |--------------------------------------------------------------------------
                | Validate Students
                |--------------------------------------------------------------------------
                */

                if (
                    !Array.isArray(students) ||
                    !students.length
                ) {
                    toast.error(
                        "Select at least one student",
                    );

                    return false;
                }

                const normalizedPrefix =
                    String(
                        rollNumberPrefix || "",
                    ).trim();

                const startText =
                    String(
                        rollNumberStartFrom || "",
                    ).trim();

                const startNumber =
                    Number(startText);

                if (!normalizedPrefix) {
                    toast.error(
                        "Roll number prefix is required",
                    );

                    return false;
                }

                if (
                    !/^\d+$/.test(
                        startText,
                    ) ||
                    !Number.isInteger(
                        startNumber,
                    ) ||
                    startNumber <= 0
                ) {
                    toast.error(
                        "Enter a valid starting roll number",
                    );

                    return false;
                }

                /*
                |--------------------------------------------------------------------------
                | Preserve Padding
                |--------------------------------------------------------------------------
                |
                | 001 => paddingLength 3
                |
                */

                const paddingLength =
                    startText.length;

                /*
                |--------------------------------------------------------------------------
                | Prepare All Requests
                |--------------------------------------------------------------------------
                */

                const requests =
                    students.map(
                        (
                            student,
                            index,
                        ) => {
                            const mappingSlug =
                                student.mappingSlug ||
                                student.academicMappingSlug ||
                                student
                                    .academicMapping
                                    ?.slug;

                            if (!mappingSlug) {
                                throw new Error(
                                    `Mapping slug missing for ${student.studentName || "student"}`,
                                );
                            }

                            const currentNumber =
                                startNumber +
                                index;

                            const paddedNumber =
                                String(
                                    currentNumber,
                                ).padStart(
                                    paddingLength,
                                    "0",
                                );

                            /*
                             * DB mein rollNumber Int hai.
                             *
                             * Formatted output preserve karne ke liye prefix mein
                             * required leading zeros attach karenge.
                             *
                             * Example:
                             *
                             * UKG- + 001
                             *
                             * rollNumberPrefix = UKG-00
                             * rollNumber = 1
                             *
                             * Response formatting:
                             * UKG-00 + 1 = UKG-001
                             */

                            const numericText =
                                String(
                                    currentNumber,
                                );

                            const leadingZeros =
                                paddedNumber.slice(
                                    0,
                                    paddedNumber.length -
                                    numericText.length,
                                );

                            const payload = {
                                rollNumberPrefix:
                                    `${normalizedPrefix}${leadingZeros}`,

                                rollNumber:
                                    currentNumber,
                            };

                            return studentAcademicMappingApi
                                .update(
                                    mappingSlug,
                                    payload,
                                )
                                .then((res) => ({
                                    mappingSlug,

                                    payload,

                                    response:
                                        res,
                                }));
                        },
                    );

                /*
                |--------------------------------------------------------------------------
                | Run All Requests
                |--------------------------------------------------------------------------
                |
                | Promise.allSettled ensures one failed request does not stop the rest.
                |
                */

                const results =
                    await Promise.allSettled(
                        requests,
                    );

                const successfulResults =
                    results.filter(
                        (result) =>
                            result.status ===
                            "fulfilled",
                    );

                const failedResults =
                    results.filter(
                        (result) =>
                            result.status ===
                            "rejected",
                    );

                /*
                |--------------------------------------------------------------------------
                | Update Local State
                |--------------------------------------------------------------------------
                */

                if (
                    successfulResults.length
                ) {
                    const updatedMappings =
                        new Map();

                    successfulResults.forEach(
                        (result) => {
                            const {
                                mappingSlug,
                                payload,
                                response,
                            } = result.value;

                            const responseData =
                                response?.data
                                    ?.data ||
                                response?.data ||
                                {};

                            updatedMappings.set(
                                mappingSlug,
                                {
                                    ...responseData,

                                    rollNumberPrefix:
                                        responseData.rollNumberPrefix ??
                                        payload.rollNumberPrefix,

                                    rollNumber:
                                        responseData.rollNumber ??
                                        payload.rollNumber,

                                    formattedRollNumber:
                                        responseData.formattedRollNumber ||
                                        `${payload.rollNumberPrefix}${payload.rollNumber}`,
                                },
                            );
                        },
                    );

                    set((state) => ({
                        mappedStudents:
                            state.mappedStudents.map(
                                (mapping) => {
                                    const update =
                                        updatedMappings.get(
                                            mapping.slug,
                                        );

                                    if (!update) {
                                        return mapping;
                                    }

                                    return {
                                        ...mapping,
                                        ...update,
                                    };
                                },
                            ),
                    }));
                }

                /*
                |--------------------------------------------------------------------------
                | Failed Requests
                |--------------------------------------------------------------------------
                */

                if (
                    failedResults.length
                ) {
                    const firstError =
                        failedResults[0]
                            ?.reason;

                    toast.error(
                        firstError?.response
                            ?.data?.message ||
                        `${successfulResults.length} assigned, ${failedResults.length} failed`,
                    );

                    return false;
                }

                toast.success(
                    `${successfulResults.length} roll numbers assigned successfully`,
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    error?.message ||
                    "Failed to assign roll numbers",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        /*
        |--------------------------------------------------------------------------
        | Update Single Student Roll Number
        |--------------------------------------------------------------------------
        */

        /*
|--------------------------------------------------------------------------
| Update Single Student Roll Number
|--------------------------------------------------------------------------
*/

        updateStudentRollNumber: async ({
            mappingSlug,
            formattedRollNumber,
        }) => {
            try {
                set({
                    submitLoading: true,
                });

                if (!mappingSlug) {
                    toast.error(
                        "Student mapping not found",
                    );

                    return false;
                }

                const normalizedValue =
                    String(
                        formattedRollNumber ||
                        "",
                    ).trim();

                const match =
                    normalizedValue.match(
                        /^(.*?)(\d+)$/,
                    );

                if (!match) {
                    toast.error(
                        "Enter a valid roll number like UKG-001",
                    );

                    return false;
                }

                const basePrefix =
                    match[1] || "";

                const numericText =
                    match[2];

                const rollNumber =
                    Number(numericText);

                const numberText =
                    String(rollNumber);

                const leadingZeros =
                    numericText.slice(
                        0,
                        Math.max(
                            0,
                            numericText.length -
                            numberText.length,
                        ),
                    );

                const payload = {
                    rollNumberPrefix:
                        `${basePrefix}${leadingZeros}`,

                    rollNumber,
                };

                const res =
                    await studentAcademicMappingApi.update(
                        mappingSlug,
                        payload,
                    );

                const responseData =
                    res?.data?.data ||
                    res?.data ||
                    {};

                /*
                |--------------------------------------------------------------------------
                | Immediate Zustand Update
                |--------------------------------------------------------------------------
                */

                set((state) => ({
                    mappedStudents:
                        state.mappedStudents.map(
                            (mapping) =>
                                mapping.slug ===
                                    mappingSlug
                                    ? {
                                        ...mapping,

                                        ...responseData,

                                        rollNumberPrefix:
                                            responseData.rollNumberPrefix ??
                                            payload.rollNumberPrefix,

                                        rollNumber:
                                            responseData.rollNumber ??
                                            payload.rollNumber,

                                        formattedRollNumber:
                                            responseData.formattedRollNumber ||
                                            normalizedValue,
                                    }
                                    : mapping,
                        ),
                }));

                toast.success(
                    res?.message ||
                    "Roll number updated successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to update roll number",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        /*
        |--------------------------------------------------------------------------
        | Soft Delete Mapping
        |--------------------------------------------------------------------------
        */

        deleteStudentMapping:
            async (slug) => {
                try {
                    set({
                        submitLoading: true,
                    });

                    const res =
                        await studentAcademicMappingApi.delete(
                            slug,
                        );

                    const deletedMapping =
                        res?.data;

                    set((state) => ({
                        mappedStudents:
                            state.mappedStudents.map(
                                (item) =>
                                    item.slug ===
                                        slug
                                        ? {
                                            ...item,

                                            status:
                                                "inactive",

                                            isActive:
                                                false,

                                            deletedAt:
                                                deletedMapping?.deletedAt ||
                                                new Date().toISOString(),
                                        }
                                        : item,
                            ),

                        selectedMapping:
                            state
                                .selectedMapping
                                ?.slug ===
                                slug
                                ? {
                                    ...state.selectedMapping,

                                    status:
                                        "inactive",

                                    isActive:
                                        false,

                                    deletedAt:
                                        deletedMapping?.deletedAt ||
                                        new Date().toISOString(),
                                }
                                : state.selectedMapping,
                    }));

                    toast.success(
                        res?.message ||
                        "Student academic mapping deleted successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        error?.response?.data
                            ?.message ||
                        "Failed to delete student mapping",
                    );

                    return false;
                } finally {
                    set({
                        submitLoading:
                            false,
                    });
                }
            },

        /*
        |--------------------------------------------------------------------------
        | Restore Mapping
        |--------------------------------------------------------------------------
        */

        restoreStudentMapping:
            async (slug) => {
                try {
                    set({
                        submitLoading: true,
                    });

                    const res =
                        await studentAcademicMappingApi.restore(
                            slug,
                        );

                    const restoredMapping =
                        res?.data;

                    set((state) => ({
                        mappedStudents:
                            state.mappedStudents.map(
                                (item) =>
                                    item.slug ===
                                        slug
                                        ? {
                                            ...item,
                                            ...restoredMapping,

                                            status:
                                                "active",

                                            isActive:
                                                true,

                                            deletedAt:
                                                null,
                                        }
                                        : item,
                            ),

                        selectedMapping:
                            state
                                .selectedMapping
                                ?.slug ===
                                slug
                                ? {
                                    ...state.selectedMapping,
                                    ...restoredMapping,

                                    status:
                                        "active",

                                    isActive:
                                        true,

                                    deletedAt:
                                        null,
                                }
                                : state.selectedMapping,
                    }));

                    toast.success(
                        res?.message ||
                        "Student academic mapping restored successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        error?.response?.data
                            ?.message ||
                        "Failed to restore student mapping",
                    );

                    return false;
                } finally {
                    set({
                        submitLoading:
                            false,
                    });
                }
            },

        /*
        |--------------------------------------------------------------------------
        | Reset Students
        |--------------------------------------------------------------------------
        */

        resetStudentLists: () => {
            set({
                unmappedStudents: [],
                mappedStudents: [],

                lastUnmappedFilters:
                    null,

                lastMappedFilters:
                    null,
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Reset Complete Store
        |--------------------------------------------------------------------------
        */

        resetStudentAcademicMappingStore:
            () => {
                set({
                    academicSetup: null,

                    boards: [],
                    classes: [],
                    sections: [],
                    streams: [],

                    unmappedStudents: [],
                    mappedStudents: [],

                    selectedMapping: null,

                    loading: false,
                    setupLoading: false,
                    studentLoading: false,
                    mappedStudentLoading:
                        false,

                    submitLoading: false,

                    ...initialSelectionState,

                    lastUnmappedFilters:
                        null,

                    lastMappedFilters:
                        null,
                });
            },
    }),
);