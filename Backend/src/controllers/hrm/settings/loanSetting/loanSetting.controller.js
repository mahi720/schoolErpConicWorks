import {
  successResponse,
  errorResponse,
} from "../../../../utils/apiResponse.js";

import {
  getLoanSettingService,
  saveLoanSettingService,
} from "../../../../services/hrm/settings/loanSetting/loanSetting.service.js";

export const getLoanSettingController = async (req, res) => {
  try {
    const data = await getLoanSettingService({
      schoolSlug: req.user.schoolSlug,
    });

    return successResponse(res, 200, "Loan setting fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const saveLoanSettingController = async (req, res) => {
  try {
    const data = await saveLoanSettingService({
      schoolSlug: req.user.schoolSlug,

      payload: req.body,
    });

    return successResponse(res, 200, "Loan setting saved successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};
