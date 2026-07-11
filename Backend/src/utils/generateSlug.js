import crypto from "crypto";

export const generateSlug = (prefix = "SLG") => {
    const random = crypto.randomBytes(6).toString("hex").toUpperCase();
    return `${prefix}-${random}`;
};