import { randomUUID } from "crypto";
import {
  getLoanSettingRepo,
  upsertLoanSettingRepo,
} from "../../../../repositories/hrm/settings/loanSetting/loanSetting.repository.js";

export const getLoanSettingService = async ({ schoolSlug }) => {
  return getLoanSettingRepo({ schoolSlug });
};

export const saveLoanSettingService = async ({ schoolSlug, payload }) => {
  return upsertLoanSettingRepo({
    slug: randomUUID(),
    schoolSlug,
    forecloseInterest: payload.forecloseInterest,
  });
};
