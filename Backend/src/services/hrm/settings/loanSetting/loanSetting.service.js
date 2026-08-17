import { randomUUID } from "crypto";

import {
  getLoanSettingRepo,
  upsertLoanSettingRepo,
} from "../../../../repositories/hrm/settings/loanSetting/loanSetting.repository.js";

const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatLoanSetting = (setting) => {
  if (!setting) {
    return null;
  }

  return {
    ...setting,

    eligibilityAfterMonths: toNumber(setting.eligibilityAfterMonths),

    maximumSalaryMultiple: toNumber(setting.maximumSalaryMultiple),

    minimumLoanAmount:
      setting.minimumLoanAmount === null ||
        setting.minimumLoanAmount === undefined
        ? null
        : toNumber(setting.minimumLoanAmount),

    maximumLoanAmount:
      setting.maximumLoanAmount === null ||
        setting.maximumLoanAmount === undefined
        ? null
        : toNumber(setting.maximumLoanAmount),

    forecloseInterest: toNumber(setting.forecloseInterest),
  };
};

export const getLoanSettingService = async ({ schoolSlug }) => {
  if (!schoolSlug) {
    throw new Error("School is required");
  }

  const setting = await getLoanSettingRepo({
    schoolSlug,
  });

  return formatLoanSetting(setting);
};

export const saveLoanSettingService = async ({ schoolSlug, payload }) => {
  if (!schoolSlug) {
    throw new Error("School is required");
  }

  const minimumLoanAmount =
    payload.minimumLoanAmount === null ||
      payload.minimumLoanAmount === undefined
      ? null
      : Number(payload.minimumLoanAmount);

  const maximumLoanAmount =
    payload.maximumLoanAmount === null ||
      payload.maximumLoanAmount === undefined
      ? null
      : Number(payload.maximumLoanAmount);

  if (
    minimumLoanAmount !== null &&
    maximumLoanAmount !== null &&
    minimumLoanAmount > maximumLoanAmount
  ) {
    throw new Error(
      "Minimum loan amount cannot be greater than maximum loan amount",
    );
  }

  const data = {
    eligibilityAfterMonths: Number(payload.eligibilityAfterMonths),

    salaryBasis: payload.salaryBasis,

    maximumSalaryMultiple: Number(payload.maximumSalaryMultiple),

    minimumLoanAmount,

    maximumLoanAmount,

    allowMultipleLoan: payload.allowMultipleLoan,

    approvalRequired: payload.approvalRequired,

    forecloseInterest: Number(payload.forecloseInterest),
  };

  const setting = await upsertLoanSettingRepo({
    slug: randomUUID(),

    schoolSlug,

    data,
  });

  return formatLoanSetting(setting);
};
