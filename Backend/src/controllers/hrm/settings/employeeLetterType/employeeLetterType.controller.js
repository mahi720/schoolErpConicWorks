import { successResponse, errorResponse } from "../../../../utils/apiResponse.js";
import {
  createEmployeeLetterTypeService,
  getEmployeeLetterTypeListService,
  getEmployeeLetterTypeBySlugService,
  updateEmployeeLetterTypeService,
  deleteEmployeeLetterTypeService,
  restoreEmployeeLetterTypeService,
} from "../../../../services/hrm/settings/employeeLetterType/employeeLetterType.service.js";

export const createEmployeeLetterTypeController = async (req, res) => {
  try {
    const data = await createEmployeeLetterTypeService({
      schoolSlug: req.user.schoolSlug,
      payload: req.body,
    });

    return successResponse(res, 201, "Employee letter type created successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getEmployeeLetterTypeListController = async (req, res) => {
  try {
    const data = await getEmployeeLetterTypeListService({
      schoolSlug: req.user.schoolSlug,
      query: req.query,
    });

    return successResponse(res, 200, "Employee letter type list fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getEmployeeLetterTypeBySlugController = async (req, res) => {
  try {
    const data = await getEmployeeLetterTypeBySlugService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Employee letter type fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

export const updateEmployeeLetterTypeController = async (req, res) => {
  try {
    const data = await updateEmployeeLetterTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
      payload: req.body,
    });

    return successResponse(res, 200, "Employee letter type updated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const deleteEmployeeLetterTypeController = async (req, res) => {
  try {
    const data = await deleteEmployeeLetterTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Employee letter type inactivated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const restoreEmployeeLetterTypeController = async (req, res) => {
  try {
    const data = await restoreEmployeeLetterTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Employee letter type restored successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};
