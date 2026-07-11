import { z } from "zod";

export const primaryPaymentSchema = z.object({
    clientId: z
        .string()
        .trim()
        .min(1, "Client ID is required"),

    merchantId: z
        .string()
        .trim()
        .min(1, "Merchant ID is required"),

    secretKey: z
        .string()
        .trim()
        .min(1, "Secret key is required"),
});

export const otherPaymentSchema = z.object({
    otherClientId: z
        .string()
        .trim()
        .min(1, "Client ID is required"),

    otherMerchantId: z
        .string()
        .trim()
        .min(1, "Merchant ID is required"),

    otherSecretKey: z
        .string()
        .trim()
        .min(1, "Secret key is required"),
});