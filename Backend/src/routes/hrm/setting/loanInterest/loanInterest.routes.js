import { Router } from "express";
import { validate } from "../../../../middleware/validate/validate.middleware.js";
import {
  createLoanInterestController,
  getLoanInterestListController,
  getLoanInterestBySlugController,
  updateLoanInterestController,
  deleteLoanInterestController,
  restoreLoanInterestController,
} from "../../../../controllers/hrm/settings/loanInterest/loanInterest.controller.js";
import {
  createLoanInterestSchema,
  updateLoanInterestSchema,
} from "../../../../validations/hrm/settings/loanInterest/loanInterest.validation.js";

const router = Router();

router.post("/", validate(createLoanInterestSchema), createLoanInterestController);
router.get("/", getLoanInterestListController);
router.get("/:slug", getLoanInterestBySlugController);
router.patch("/:slug", validate(updateLoanInterestSchema), updateLoanInterestController);
router.delete("/:slug", deleteLoanInterestController);
router.patch("/:slug/restore", restoreLoanInterestController);

export default router;
