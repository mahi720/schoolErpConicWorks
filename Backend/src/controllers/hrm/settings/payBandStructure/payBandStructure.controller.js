import { successResponse, errorResponse } from "../../../../utils/apiResponse.js";
import {
  getPayBandStructureService,
  savePayBandStructureService,
} from "../../../../services/hrm/settings/payBandStructure/payBandStructure.service.js";

export const getPayBandStructureController = async (req, res) => {
  try {
    const data = await getPayBandStructureService({ schoolSlug: req.user.schoolSlug, payBandSlug: req.params.payBandSlug });
    return successResponse(res, 200, "Pay band structure fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const savePayBandStructureController = async (req, res) => {
  try {
    const data = await savePayBandStructureService({ schoolSlug: req.user.schoolSlug, payBandSlug: req.params.payBandSlug, payload: req.body });
    return successResponse(res, 200, "Pay band structure saved successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};
