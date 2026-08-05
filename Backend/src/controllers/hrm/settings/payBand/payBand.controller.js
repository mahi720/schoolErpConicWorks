import { successResponse, errorResponse } from "../../../../utils/apiResponse.js";
import {
  createPayBandService,
  getPayBandsService,
  getPayBandBySlugService,
  updatePayBandService,
  deletePayBandService,
  restorePayBandService,
} from "../../../../services/hrm/settings/payBand/payBand.service.js";

export const createPayBandController = async (req, res) => {
  try {
    const data = await createPayBandService({ schoolSlug: req.user.schoolSlug, payload: req.body, file: req.file });
    return successResponse(res, 201, "Pay band created successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getPayBandsController = async (req, res) => {
  try {
    const data = await getPayBandsService({ schoolSlug: req.user.schoolSlug, query: req.query });
    return successResponse(res, 200, "Pay bands fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getPayBandBySlugController = async (req, res) => {
  try {
    const data = await getPayBandBySlugService({ schoolSlug: req.user.schoolSlug, slug: req.params.slug });
    return successResponse(res, 200, "Pay band fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

export const updatePayBandController = async (req, res) => {
  try {
    const data = await updatePayBandService({ schoolSlug: req.user.schoolSlug, slug: req.params.slug, payload: req.body, file: req.file });
    return successResponse(res, 200, "Pay band updated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const deletePayBandController = async (req, res) => {
  try {
    const data = await deletePayBandService({ schoolSlug: req.user.schoolSlug, slug: req.params.slug });
    return successResponse(res, 200, "Pay band inactivated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const restorePayBandController = async (req, res) => {
  try {
    const data = await restorePayBandService({ schoolSlug: req.user.schoolSlug, slug: req.params.slug });
    return successResponse(res, 200, "Pay band restored successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};
