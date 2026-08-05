import { successResponse, errorResponse } from "../../../../utils/apiResponse.js";
import {
  createDeductionTypeService,
  getDeductionTypeListService,
  getDeductionTypeBySlugService,
  updateDeductionTypeService,
  deleteDeductionTypeService,
  restoreDeductionTypeService,
} from "../../../../services/hrm/settings/deductionType/deductionType.service.js";

export const createDeductionTypeController = async (req, res) => {
  try {
    const data = await createDeductionTypeService({
      schoolSlug: req.user.schoolSlug,
      payload: req.body,
    });

    return successResponse(res, 201, "Deduction type created successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getDeductionTypeListController = async (req, res) => {
  try {
    const data = await getDeductionTypeListService({
      schoolSlug: req.user.schoolSlug,
      query: req.query,
    });

    return successResponse(res, 200, "Deduction type list fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getDeductionTypeBySlugController = async (req, res) => {
  try {
    const data = await getDeductionTypeBySlugService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Deduction type fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

export const updateDeductionTypeController = async (req, res) => {
  try {
    const data = await updateDeductionTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
      payload: req.body,
    });

    return successResponse(res, 200, "Deduction type updated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const deleteDeductionTypeController = async (req, res) => {
  try {
    const data = await deleteDeductionTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Deduction type inactivated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const restoreDeductionTypeController = async (req, res) => {
  try {
    const data = await restoreDeductionTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Deduction type restored successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};
