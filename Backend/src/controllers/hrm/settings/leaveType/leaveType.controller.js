import { successResponse, errorResponse } from "../../../../utils/apiResponse.js";
import {
  createLeaveTypeService,
  getLeaveTypeListService,
  getLeaveTypeBySlugService,
  updateLeaveTypeService,
  deleteLeaveTypeService,
  restoreLeaveTypeService,
} from "../../../../services/hrm/settings/leaveType/leaveType.service.js";

export const createLeaveTypeController = async (req, res) => {
  try {
    const data = await createLeaveTypeService({
      schoolSlug: req.user.schoolSlug,
      payload: req.body,
    });

    return successResponse(res, 201, "Leave type created successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getLeaveTypeListController = async (req, res) => {
  try {
    const data = await getLeaveTypeListService({
      schoolSlug: req.user.schoolSlug,
      query: req.query,
    });

    return successResponse(res, 200, "Leave type list fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getLeaveTypeBySlugController = async (req, res) => {
  try {
    const data = await getLeaveTypeBySlugService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Leave type fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

export const updateLeaveTypeController = async (req, res) => {
  try {
    const data = await updateLeaveTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
      payload: req.body,
    });

    return successResponse(res, 200, "Leave type updated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const deleteLeaveTypeController = async (req, res) => {
  try {
    const data = await deleteLeaveTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Leave type inactivated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const restoreLeaveTypeController = async (req, res) => {
  try {
    const data = await restoreLeaveTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Leave type restored successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};
