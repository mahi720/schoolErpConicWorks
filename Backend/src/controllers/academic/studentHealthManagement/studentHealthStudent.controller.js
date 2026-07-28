import { getHealthManagementStudentsService } from "../../../services/academic/studentHealthManagement/studentHealthStudent.service.js";
import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const getHealthManagementStudentsController = async (
    req,
    res,
) => {
    try {
        const data =
            await getHealthManagementStudentsService(
                req.query,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Health management students fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};