import { errorResponse } from "../../utils/apiResponse.js";

export const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return errorResponse(res, 400, "Validation failed", result.error.flatten().fieldErrors);
        }

        req.body = result.data;
        next();
    };
};