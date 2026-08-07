import {
    importEmployeesService,
} from "../../../services/HRM/employee/employeeImportService.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const importEmployeesController =
    async (req, res) => {
        try {
            if (!req.file) {
                return errorResponse(
                    res,
                    400,
                    "Excel file is required",
                );
            }

            const data =
                await importEmployeesService({
                    schoolSlug:
                        req.user.schoolSlug,

                    schoolCode:
                        req.user.schoolCode,

                    fileBuffer:
                        req.file.buffer,
                });

            const message =
                data.failedCount > 0
                    ? `${data.successCount} employees imported, ${data.failedCount} failed`
                    : `${data.successCount} employees imported successfully`;

            return successResponse(
                res,
                200,
                message,
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };