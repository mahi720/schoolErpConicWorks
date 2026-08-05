import { randomUUID } from "crypto";

import {
  createDeductionTypeRepo,
  findDuplicateDeductionTypeRepo,
  getDeductionTypeListRepo,
  getDeductionTypeBySlugRepo,
  updateDeductionTypeRepo,
  deleteDeductionTypeRepo,
  restoreDeductionTypeRepo,
} from "../../../../repositories/hrm/settings/deductionType/deductionType.repository.js";

export const createDeductionTypeService = async ({ schoolSlug, payload }) => {
  const duplicateValue = payload.deductionType.trim().toUpperCase();

  const duplicate = await findDuplicateDeductionTypeRepo({
    schoolSlug,
    value: duplicateValue,
  });

  if (duplicate) {
    throw new Error("Deduction type already exists");
  }

  return createDeductionTypeRepo({
    slug: randomUUID(),
    schoolSlug,
    deductionType: payload.deductionType.trim().toUpperCase(),
    valueType: payload.valueType,
    value: payload.value,
    maximumValue: payload.valueType === "PERCENT" ? payload.maximumValue ?? null : null,
  });
};

export const getDeductionTypeListService = async ({ schoolSlug, query }) => {
  return getDeductionTypeListRepo({
    schoolSlug,
    status: query.status,
    search: query.search?.trim(),
  });
};

export const getDeductionTypeBySlugService = async ({ schoolSlug, slug }) => {
  const existing = await getDeductionTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Deduction type not found");
  }

  return existing;
};

export const updateDeductionTypeService = async ({ schoolSlug, slug, payload }) => {
  const existing = await getDeductionTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Deduction type not found");
  }

  const duplicateValue = payload.deductionType !== undefined ? payload.deductionType.trim().toUpperCase() : existing.deductionType;
  const nextValueType = payload.valueType ?? existing.valueType;

  const duplicate = await findDuplicateDeductionTypeRepo({
    schoolSlug,
    value: duplicateValue,
    excludeSlug: slug,
  });

  if (duplicate) {
    throw new Error("Deduction type already exists");
  }

  return updateDeductionTypeRepo({
    slug,
    data: {
      ...(payload.deductionType !== undefined ? { deductionType: payload.deductionType.trim().toUpperCase() } : {}),
      ...(payload.valueType !== undefined ? { valueType: payload.valueType } : {}),
      ...(payload.value !== undefined ? { value: payload.value } : {}),
      maximumValue: nextValueType === "PERCENT" ? payload.maximumValue ?? existing.maximumValue : null,
    },
  });
};

export const deleteDeductionTypeService = async ({ schoolSlug, slug }) => {
  const existing = await getDeductionTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Deduction type not found");
  }

  if (!existing.isActive) {
    throw new Error("Deduction type is already inactive");
  }

  return deleteDeductionTypeRepo({ slug });
};

export const restoreDeductionTypeService = async ({ schoolSlug, slug }) => {
  const existing = await getDeductionTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Deduction type not found");
  }

  if (existing.isActive) {
    throw new Error("Deduction type is already active");
  }

  return restoreDeductionTypeRepo({ slug });
};
