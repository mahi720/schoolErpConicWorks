import { loginUserService, refreshAuthService } from "../../services/auth.service.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js"

export const login = async (req, res) => {
    try {
        const { rememberMe } = req.body;

        const result = await loginUserService(req.body);

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: rememberMe
                ? 7 * 24 * 60 * 60 * 1000
                : 24 * 60 * 60 * 1000,
        });

        return successResponse(res, 200, "Login successful", {
            accessToken: result.accessToken,
            user: result.user,
        });
    } catch (error) {
        return errorResponse(res, 401, error.message);
    }
};

export const refreshAuth = async (req, res) => {
    try {
        const result = await refreshAuthService(req.cookies.refreshToken);

        return successResponse(res, 200, "Auth refreshed", {
            accessToken: result.accessToken,
            user: result.user,
        });
    } catch (error) {
        return errorResponse(res, 401, error.message);
    }
};

export const me = async (req, res) => {
    try {
        const result = await refreshAuthService(req.cookies.refreshToken);

        return successResponse(res, 200, "User authenticated", {
            accessToken: result.accessToken,
            user: result.user,
        });
    } catch (error) {
        return errorResponse(res, 401, error.message);
    }
};

export const logout = async (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        secure: false,
        sameSite: "lax",
        path: "/",
    });

    return successResponse(res, 200, "Logout successful");
};