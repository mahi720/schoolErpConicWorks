import { z } from "zod";

export const overtimeRequestInitialValues = {
    description: "",
    appointedBy: "",
    date: "",
    hoursSpent: "",
};

export const createOvertimeRequestSchema = z.object({
    description: z
        .string()
        .trim()
        .min(
            1,
            "Description is required",
        )
        .max(
            500,
            "Description cannot exceed 500 characters",
        ),

    appointedBy: z
        .string()
        .trim()
        .min(
            1,
            "Appointed by is required",
        ),

    date: z
        .string()
        .trim()
        .min(
            1,
            "Date is required",
        )
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Please select a valid date",
        ),

    hoursSpent: z.coerce
        .number({
            invalid_type_error:
                "Hours spent is required",
        })
        .positive(
            "Hours spent must be greater than 0",
        )
        .max(
            24,
            "Hours spent cannot exceed 24 hours",
        ),
});

export const approveOvertimeRequestSchema =
    z.object({
        remark: z
            .string()
            .trim()
            .min(
                1,
                "Remark is required",
            )
            .max(
                500,
                "Remark cannot exceed 500 characters",
            ),
    });

export const rejectOvertimeRequestSchema =
    z.object({
        remark: z
            .string()
            .trim()
            .min(
                1,
                "Remark is required",
            )
            .max(
                500,
                "Remark cannot exceed 500 characters",
            ),
    });

export const buildOvertimeRequestPayload = (
    form,
) => ({
    description:
        form?.description?.trim() || "",

    appointedBy:
        form?.appointedBy?.trim() || "",

    date:
        form?.date || "",

    hoursSpent:
        form?.hoursSpent === "" ||
            form?.hoursSpent === null ||
            form?.hoursSpent === undefined
            ? ""
            : Number(
                form.hoursSpent,
            ),
});

export const buildOvertimeActionPayload = (
    remark,
) => ({
    remark:
        typeof remark === "string"
            ? remark.trim()
            : "",
});

export const buildApproveOvertimeRequestPayload = (
    remark,
) =>
    buildOvertimeActionPayload(
        remark,
    );

export const buildRejectOvertimeRequestPayload = (
    remark,
) =>
    buildOvertimeActionPayload(
        remark,
    );

export const validateOvertimeRequestForm = (
    form,
) => {
    const payload =
        buildOvertimeRequestPayload(
            form,
        );

    return createOvertimeRequestSchema.safeParse(
        payload,
    );
};

export const validateApproveOvertimeRequest = (
    remark,
) => {
    const payload =
        buildOvertimeActionPayload(
            remark,
        );

    return approveOvertimeRequestSchema.safeParse(
        payload,
    );
};

export const validateRejectOvertimeRequest = (
    remark,
) => {
    const payload =
        buildOvertimeActionPayload(
            remark,
        );

    return rejectOvertimeRequestSchema.safeParse(
        payload,
    );
};