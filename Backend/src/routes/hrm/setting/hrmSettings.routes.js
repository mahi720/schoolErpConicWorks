import { Router } from "express";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";

import departmentRoutes from "./department/department.routes.js";
import designationRoutes from "./designation/designation.routes.js";
import shiftRoutes from "./shift/shift.routes.js";
import basicSettingRoutes from "./basicSetting/basicSetting.routes.js";
import payBandRoutes from "./payBand/payBand.routes.js";
import payBandStructureRoutes from "./payBandStructure/payBandStructure.routes.js";
import authorizedPersonRoutes from "./authorizedPerson/authorizedPerson.routes.js";
import earningTypeRoutes from "./earningType/earningType.routes.js";
import deductionTypeRoutes from "./deductionType/deductionType.routes.js";
import identityDocumentTypeRoutes from "./identityDocumentType/identityDocumentType.routes.js";
import degreeDocumentTypeRoutes from "./degreeDocumentType/degreeDocumentType.routes.js";
import employeeLetterTypeRoutes from "./employeeLetterType/employeeLetterType.routes.js";
import leaveTypeRoutes from "./leaveType/leaveType.routes.js";
import loanInterestRoutes from "./loanInterest/loanInterest.routes.js";
import loanSettingRoutes from "./loanSetting/loanSetting.routes.js";

const router = Router();

router.use(authMiddleware);

router.use("/departments", departmentRoutes);
router.use("/designations", designationRoutes);
router.use("/shifts", shiftRoutes);
router.use("/basic-settings", basicSettingRoutes);
router.use("/pay-bands", payBandRoutes);
router.use("/pay-band-structures", payBandStructureRoutes);
router.use("/authorized-persons", authorizedPersonRoutes);
router.use("/earning-types", earningTypeRoutes);
router.use("/deduction-types", deductionTypeRoutes);
router.use("/identity-document-types", identityDocumentTypeRoutes);
router.use("/degree-document-types", degreeDocumentTypeRoutes);
router.use("/employee-letter-types", employeeLetterTypeRoutes);
router.use("/leave-types", leaveTypeRoutes);
router.use("/loan-interests", loanInterestRoutes);
router.use("/loan-setting", loanSettingRoutes);


export default router;