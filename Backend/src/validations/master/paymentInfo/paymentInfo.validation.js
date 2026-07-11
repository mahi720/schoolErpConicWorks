import { z } from "zod";

const nullableCredential = z.preprocess(
    (value) => {
        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {
            return null;
        }

        return String(value).trim();
    },
    z.string().nullable().optional(),
);

export const createPaymentInfoSchema = z.object({
    primaryClientId: nullableCredential,
    primaryMerchantId: nullableCredential,
    primarySecretKey: nullableCredential,

    otherClientId: nullableCredential,
    otherMerchantId: nullableCredential,
    otherSecretKey: nullableCredential,
});

export const updatePaymentInfoSchema = z
    .object({
        type: z.enum(["primary", "other"]).optional(),

        primaryClientId: nullableCredential,
        primaryMerchantId: nullableCredential,
        primarySecretKey: nullableCredential,

        otherClientId: nullableCredential,
        otherMerchantId: nullableCredential,
        otherSecretKey: nullableCredential,
    })
    .refine(
        (data) =>
            data.primaryClientId !== undefined ||
            data.primaryMerchantId !== undefined ||
            data.primarySecretKey !== undefined ||
            data.otherClientId !== undefined ||
            data.otherMerchantId !== undefined ||
            data.otherSecretKey !== undefined,
        {
            message: "At least one payment field is required",
        },
    );