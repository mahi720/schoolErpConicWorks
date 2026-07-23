import { z } from "zod";

export const ATTENDANCE_STATUS = {
    PRESENT: "P",
    ABSENT: "A",
    LEAVE: "L",
    HALF_DAY: "HD",
    HOLIDAY: "H",
};

export const ATTENDANCE_STATUS_OPTIONS = [
    {
        label: "Present",
        value: ATTENDANCE_STATUS.PRESENT,
    },
    {
        label: "Absent",
        value: ATTENDANCE_STATUS.ABSENT,
    },
    {
        label: "Leave",
        value: ATTENDANCE_STATUS.LEAVE,
    },
    {
        label: "Half Day",
        value: ATTENDANCE_STATUS.HALF_DAY,
    },
    {
        label: "Holiday",
        value: ATTENDANCE_STATUS.HOLIDAY,
    },
];

const attendanceStatusSchema = z.enum(
    [
        ATTENDANCE_STATUS.PRESENT,
        ATTENDANCE_STATUS.ABSENT,
        ATTENDANCE_STATUS.LEAVE,
        ATTENDANCE_STATUS.HALF_DAY,
        ATTENDANCE_STATUS.HOLIDAY,
    ],
    {
        message:
            "Please select a valid attendance status",
    },
);

const optionalSlugSchema = z
    .string()
    .trim()
    .min(1, "Invalid selected value")
    .max(50, "Invalid selected value")
    .nullable()
    .optional();

const remarksSchema = z
    .string()
    .trim()
    .max(
        255,
        "Remarks cannot exceed 255 characters",
    )
    .optional()
    .nullable()
    .transform((value) => value || null);

const attendanceDateSchema = z
    .string()
    .trim()
    .min(1, "Attendance date is required")
    .refine(
        (value) => {
            const datePattern =
                /^\d{4}-\d{2}-\d{2}$/;

            if (!datePattern.test(value)) {
                return false;
            }

            const date = new Date(
                `${value}T00:00:00`,
            );

            return !Number.isNaN(
                date.getTime(),
            );
        },
        {
            message:
                "Please select a valid attendance date",
        },
    );

export const attendanceStudentFilterSchema =
    z.object({
        session: z
            .string()
            .trim()
            .min(
                1,
                "Please select a session",
            ),

        board: z
            .string()
            .trim()
            .min(
                1,
                "Please select a board",
            ),

        classTitle: z
            .string()
            .trim()
            .min(
                1,
                "Please select a class",
            ),

        sectionSlug: optionalSlugSchema,

        streamSlug: optionalSlugSchema,

        attendanceDate:
            attendanceDateSchema,
    });

const attendanceStudentSchema = z.object({
    academicMappingSlug: z
        .string()
        .trim()
        .min(
            1,
            "Academic mapping is required",
        )
        .max(
            50,
            "Invalid academic mapping",
        ),

    attendanceStatus:
        attendanceStatusSchema,
});

export const markStudentAttendanceSchema =
    z
        .object({
            attendanceDate:
                attendanceDateSchema,

            students: z
                .array(
                    attendanceStudentSchema,
                )
                .min(
                    1,
                    "Please select at least one student",
                ),

            remarks: remarksSchema,
        })
        .superRefine(
            (data, context) => {
                const mappingSlugs =
                    data.students.map(
                        (student) =>
                            student.academicMappingSlug,
                    );

                const uniqueMappingSlugs =
                    new Set(mappingSlugs);

                if (
                    uniqueMappingSlugs.size !==
                    mappingSlugs.length
                ) {
                    context.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,
                        path: ["students"],
                        message:
                            "Duplicate students are not allowed",
                    });
                }
            },
        );

export const updateStudentAttendanceSchema =
    z.object({
        attendanceStatus:
            attendanceStatusSchema,

        remarks: remarksSchema,
    });

export const attendanceActionSchema =
    z.object({
        remarks: remarksSchema,
    });

export const monthlyAttendanceQuerySchema =
    z.object({
        academicMappingSlug: z
            .string()
            .trim()
            .min(
                1,
                "Academic mapping is required",
            )
            .max(
                50,
                "Invalid academic mapping",
            ),

        year: z.preprocess(
            (value) => {
                if (
                    value === "" ||
                    value === null ||
                    value === undefined
                ) {
                    return undefined;
                }

                return Number(value);
            },
            z
                .number({
                    message:
                        "Attendance year is required",
                })
                .int(
                    "Year must be a whole number",
                )
                .min(
                    2000,
                    "Invalid attendance year",
                )
                .max(
                    2100,
                    "Invalid attendance year",
                ),
        ),

        month: z.preprocess(
            (value) => {
                if (
                    value === "" ||
                    value === null ||
                    value === undefined
                ) {
                    return undefined;
                }

                return Number(value);
            },
            z
                .number({
                    message:
                        "Attendance month is required",
                })
                .int(
                    "Month must be a whole number",
                )
                .min(
                    1,
                    "Month must be between 1 and 12",
                )
                .max(
                    12,
                    "Month must be between 1 and 12",
                ),
        ),
    });

export const attendanceLogsQuerySchema =
    z.object({
        page: z.preprocess(
            (value) => {
                if (
                    value === "" ||
                    value === null ||
                    value === undefined
                ) {
                    return 1;
                }

                return Number(value);
            },
            z
                .number()
                .int()
                .positive(),
        ),

        limit: z.preprocess(
            (value) => {
                if (
                    value === "" ||
                    value === null ||
                    value === undefined
                ) {
                    return 10;
                }

                return Number(value);
            },
            z
                .number()
                .int()
                .min(1)
                .max(100),
        ),
    });

export const attendanceFilterDefaultValues = {
    session: "",
    board: "",
    classTitle: "",
    sectionSlug: null,
    streamSlug: null,
    attendanceDate: "",
};

export const markAttendanceDefaultValues = {
    attendanceDate: "",
    students: [],
    remarks: "",
};

export const updateAttendanceDefaultValues = {
    attendanceStatus:
        ATTENDANCE_STATUS.PRESENT,
    remarks: "",
};

export const attendanceActionDefaultValues = {
    remarks: "",
};