import {
    getWeeklyPlanClassesService,
    getWeeklyPlanSectionsService,
    getWeeklyPlanSubjectsService,
} from "../../../services/academic/weeklyPlan/weeklyPlanOptions.service.js";

import {
    errorResponse,
    successResponse,
} from "../../../utils/apiResponse.js";

const getWeeklyPlanAuthSchoolData = (req) => ({
    authSchoolSlug: req.user?.schoolSlug || null,
    schoolCode: req.user?.schoolCode || null,
});

/* -------------------------------------------------------------------------- */
/*                                GET CLASSES                                 */
/* -------------------------------------------------------------------------- */

export const getWeeklyPlanClassesController = async (
    req,
    res,
) => {
    try {
        const result =
            await getWeeklyPlanClassesService({
                ...getWeeklyPlanAuthSchoolData(req),

                session: req.query?.session,
                board: req.query?.board,
            });

        return successResponse(
            res,
            200,
            "Weekly plan classes fetched successfully",
            result,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

/* -------------------------------------------------------------------------- */
/*                               GET SECTIONS                                 */
/* -------------------------------------------------------------------------- */

export const getWeeklyPlanSectionsController = async (
    req,
    res,
) => {
    try {
        const result =
            await getWeeklyPlanSectionsService({
                ...getWeeklyPlanAuthSchoolData(req),

                classSlug: req.query?.classSlug,
            });

        return successResponse(
            res,
            200,
            "Weekly plan sections fetched successfully",
            result,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

/* -------------------------------------------------------------------------- */
/*                               GET SUBJECTS                                 */
/* -------------------------------------------------------------------------- */

export const getWeeklyPlanSubjectsController = async (
    req,
    res,
) => {
    try {
        const result =
            await getWeeklyPlanSubjectsService({
                ...getWeeklyPlanAuthSchoolData(req),

                classSlug: req.query?.classSlug,
            });

        return successResponse(
            res,
            200,
            "Weekly plan subjects fetched successfully",
            result,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};