import { successResponse, errorResponse } from "../../../../utils/apiResponse.js";
import {
  createLoanInterestService,
  getLoanInterestListService,
  getLoanInterestBySlugService,
  updateLoanInterestService,
  deleteLoanInterestService,
  restoreLoanInterestService,
} from "../../../../services/hrm/settings/loanInterest/loanInterest.service.js";

export const createLoanInterestController = async (req, res) => {
  try {
    const data = await createLoanInterestService({
      schoolSlug: req.user.schoolSlug,
      payload: req.body,
    });

    return successResponse(res, 201, "Loan interest created successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getLoanInterestListController = async (req, res) => {
  try {
    const data = await getLoanInterestListService({
      schoolSlug: req.user.schoolSlug,
      query: req.query,
    });

    return successResponse(res, 200, "Loan interest list fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const getLoanInterestBySlugController = async (req, res) => {
  try {
    const data = await getLoanInterestBySlugService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Loan interest fetched successfully", data);
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

export const updateLoanInterestController = async (req, res) => {
  try {
    const data = await updateLoanInterestService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
      payload: req.body,
    });

    return successResponse(res, 200, "Loan interest updated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const deleteLoanInterestController = async (req, res) => {
  try {
    const data = await deleteLoanInterestService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Loan interest inactivated successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const restoreLoanInterestController = async (req, res) => {
  try {
    const data = await restoreLoanInterestService({
      schoolSlug: req.user.schoolSlug,
      slug: req.params.slug,
    });

    return successResponse(res, 200, "Loan interest restored successfully", data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};
