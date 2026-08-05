import { successResponse, errorResponse } from "../../../../utils/apiResponse.js";
import {
  createDegreeDocumentTypeService,
  getDegreeDocumentTypeListService,
  getDegreeDocumentTypeBySlugService,
  updateDegreeDocumentTypeService,
  deleteDegreeDocumentTypeService,
  restoreDegreeDocumentTypeService,
} from "../../../../services/hrm/settings/degreeDocumentType/degreeDocumentType.service.js";

export const createDegreeDocumentTypeController = async (req, res) => {
  try {
    const data = await createDegreeDocumentTypeService({
      schoolSlug: req.user.schoolSlug,
      payload: req.body,
    });

    return successResponse(res, 201, "Degree document type created successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getDegreeDocumentTypeListController = async (req, res) => {
  try {
    const data = await getDegreeDocumentTypeListService({
      schoolSlug: req.user.schoolSlug,
      query: req.query,
    });

    return successResponse(res, 200, "Degree document type list fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getDegreeDocumentTypeBySlugController = async (req, res) => {
  try {
    const data = await getDegreeDocumentTypeBySlugService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Degree document type fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

export const updateDegreeDocumentTypeController = async (req, res) => {
  try {
    const data = await updateDegreeDocumentTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
      payload: req.body,
    });

    return successResponse(res, 200, "Degree document type updated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const deleteDegreeDocumentTypeController = async (req, res) => {
  try {
    const data = await deleteDegreeDocumentTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Degree document type inactivated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const restoreDegreeDocumentTypeController = async (req, res) => {
  try {
    const data = await restoreDegreeDocumentTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Degree document type restored successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};
