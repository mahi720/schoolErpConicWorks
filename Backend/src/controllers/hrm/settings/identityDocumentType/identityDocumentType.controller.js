import { successResponse, errorResponse } from "../../../../utils/apiResponse.js";
import {
  createIdentityDocumentTypeService,
  getIdentityDocumentTypeListService,
  getIdentityDocumentTypeBySlugService,
  updateIdentityDocumentTypeService,
  deleteIdentityDocumentTypeService,
  restoreIdentityDocumentTypeService,
} from "../../../../services/hrm/settings/identityDocumentType/identityDocumentType.service.js";

export const createIdentityDocumentTypeController = async (req, res) => {
  try {
    const data = await createIdentityDocumentTypeService({
      schoolSlug: req.user.schoolSlug,
      payload: req.body,
    });

    return successResponse(res, 201, "Identity document type created successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getIdentityDocumentTypeListController = async (req, res) => {
  try {
    const data = await getIdentityDocumentTypeListService({
      schoolSlug: req.user.schoolSlug,
      query: req.query,
    });

    return successResponse(res, 200, "Identity document type list fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getIdentityDocumentTypeBySlugController = async (req, res) => {
  try {
    const data = await getIdentityDocumentTypeBySlugService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Identity document type fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

export const updateIdentityDocumentTypeController = async (req, res) => {
  try {
    const data = await updateIdentityDocumentTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
      payload: req.body,
    });

    return successResponse(res, 200, "Identity document type updated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const deleteIdentityDocumentTypeController = async (req, res) => {
  try {
    const data = await deleteIdentityDocumentTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Identity document type inactivated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const restoreIdentityDocumentTypeController = async (req, res) => {
  try {
    const data = await restoreIdentityDocumentTypeService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Identity document type restored successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};
