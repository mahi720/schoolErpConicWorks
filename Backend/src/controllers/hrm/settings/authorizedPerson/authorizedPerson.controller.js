import { successResponse, errorResponse } from "../../../../utils/apiResponse.js";
import {
  createAuthorizedPersonService,
  getAuthorizedPersonsService,
  getAuthorizedPersonBySlugService,
  updateAuthorizedPersonService,
  deleteAuthorizedPersonService,
  restoreAuthorizedPersonService,
} from "../../../../services/hrm/settings/authorizedPerson/authorizedPerson.service.js";

export const createAuthorizedPersonController = async (req, res) => {
  try {
    const data = await createAuthorizedPersonService({ schoolSlug: req.user.schoolSlug, payload: req.body });
    return successResponse(res, 201, "Authorized person created successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getAuthorizedPersonsController = async (req, res) => {
  try {
    const data = await getAuthorizedPersonsService({ schoolSlug: req.user.schoolSlug, query: req.query });
    return successResponse(res, 200, "Authorized persons fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getAuthorizedPersonBySlugController = async (req, res) => {
  try {
    const data = await getAuthorizedPersonBySlugService({ schoolSlug: req.user.schoolSlug, slug: req.params.slug });
    return successResponse(res, 200, "Authorized person fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

export const updateAuthorizedPersonController = async (req, res) => {
  try {
    const data = await updateAuthorizedPersonService({ schoolSlug: req.user.schoolSlug, slug: req.params.slug, payload: req.body });
    return successResponse(res, 200, "Authorized person updated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const deleteAuthorizedPersonController = async (req, res) => {
  try {
    const data = await deleteAuthorizedPersonService({ schoolSlug: req.user.schoolSlug, slug: req.params.slug });
    return successResponse(res, 200, "Authorized person inactivated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const restoreAuthorizedPersonController = async (req, res) => {
  try {
    const data = await restoreAuthorizedPersonService({ schoolSlug: req.user.schoolSlug, slug: req.params.slug });
    return successResponse(res, 200, "Authorized person restored successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};
