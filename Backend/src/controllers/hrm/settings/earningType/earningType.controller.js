import { successResponse, errorResponse } from "../../../../utils/apiResponse.js";
import {
  createEarningTypeService,
  getEarningTypeListService,
  getEarningTypeBySlugService,
  updateEarningTypeService,
  deleteEarningTypeService,
  restoreEarningTypeService,
} from "../../../../services/hrm/settings/earningType/earningType.service.js";

export const createEarningTypeController = async (req, res) => {
  try {
    const data = await createEarningTypeService({
      schoolSlug: req.user.schoolSlug,
      payload: req.body,
    });

    return successResponse(res, 201, "Earning type created successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getEarningTypeListController = async (req, res) => {
  try {
    const data = await getEarningTypeListService({
      schoolSlug: req.user.schoolSlug,
      query: req.query,
    });

    return successResponse(res, 200, "Earning type list fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getEarningTypeBySlugController = async (req, res) => {
  try {
    const data = await getEarningTypeBySlugService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Earning type fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

export const updateEarningTypeController = async (req, res) => {
  try {
    const data = await updateEarningTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
      payload: req.body,
    });

    return successResponse(res, 200, "Earning type updated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const deleteEarningTypeController = async (req, res) => {
  try {
    const data = await deleteEarningTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Earning type inactivated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const restoreEarningTypeController = async (req, res) => {
  try {
    const data = await restoreEarningTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Earning type restored successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};
