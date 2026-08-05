import { randomUUID } from "crypto";

import {
  createLoanInterestRepo,
  findDuplicateLoanInterestRepo,
  getLoanInterestListRepo,
  getLoanInterestBySlugRepo,
  updateLoanInterestRepo,
  deleteLoanInterestRepo,
  restoreLoanInterestRepo,
} from "../../../../repositories/hrm/settings/loanInterest/loanInterest.repository.js";

export const createLoanInterestService = async ({ schoolSlug, payload }) => {
  const duplicateValue = payload.durationMonths;

  const duplicate = await findDuplicateLoanInterestRepo({
    schoolSlug,
    value: duplicateValue,
  });

  if (duplicate) {
    throw new Error("Loan interest already exists");
  }

  return createLoanInterestRepo({
    slug: randomUUID(),
    schoolSlug,
    durationMonths: payload.durationMonths,
    annualInterest: payload.annualInterest,
  });
};

export const getLoanInterestListService = async ({ schoolSlug, query }) => {
  return getLoanInterestListRepo({
    schoolSlug,
    status: query.status,
    search: query.search?.trim(),
  });
};

export const getLoanInterestBySlugService = async ({ schoolSlug, slug }) => {
  const existing = await getLoanInterestBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Loan interest not found");
  }

  return existing;
};

export const updateLoanInterestService = async ({ schoolSlug, slug, payload }) => {
  const existing = await getLoanInterestBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Loan interest not found");
  }

  const duplicateValue = payload.durationMonths !== undefined ? payload.durationMonths : existing.durationMonths;


  const duplicate = await findDuplicateLoanInterestRepo({
    schoolSlug,
    value: duplicateValue,
    excludeSlug: slug,
  });

  if (duplicate) {
    throw new Error("Loan interest already exists");
  }

  return updateLoanInterestRepo({
    slug,
    data: {
      ...(payload.durationMonths !== undefined ? { durationMonths: payload.durationMonths } : {}),
      ...(payload.annualInterest !== undefined ? { annualInterest: payload.annualInterest } : {}),
    },
  });
};

export const deleteLoanInterestService = async ({ schoolSlug, slug }) => {
  const existing = await getLoanInterestBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Loan interest not found");
  }

  if (!existing.isActive) {
    throw new Error("Loan interest is already inactive");
  }

  return deleteLoanInterestRepo({ slug });
};

export const restoreLoanInterestService = async ({ schoolSlug, slug }) => {
  const existing = await getLoanInterestBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Loan interest not found");
  }

  if (existing.isActive) {
    throw new Error("Loan interest is already active");
  }

  return restoreLoanInterestRepo({ slug });
};
