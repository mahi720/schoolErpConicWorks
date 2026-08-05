import { randomUUID } from "crypto";

import {
  createEarningTypeRepo,
  findDuplicateEarningTypeRepo,
  getEarningTypeListRepo,
  getEarningTypeBySlugRepo,
  updateEarningTypeRepo,
  deleteEarningTypeRepo,
  restoreEarningTypeRepo,
} from "../../../../repositories/hrm/settings/earningType/earningType.repository.js";

export const createEarningTypeService = async ({ schoolSlug, payload }) => {
  const duplicateValue = payload.earningType.trim().toUpperCase();

  const duplicate = await findDuplicateEarningTypeRepo({
    schoolSlug,
    value: duplicateValue,
  });

  if (duplicate) {
    throw new Error("Earning type already exists");
  }

  return createEarningTypeRepo({
    slug: randomUUID(),
    schoolSlug,
    earningType: payload.earningType.trim().toUpperCase(),
    valueType: payload.valueType,
    value: payload.value,
  });
};

export const getEarningTypeListService = async ({ schoolSlug, query }) => {
  return getEarningTypeListRepo({
    schoolSlug,
    status: query.status,
    search: query.search?.trim(),
  });
};

export const getEarningTypeBySlugService = async ({ schoolSlug, slug }) => {
  const existing = await getEarningTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Earning type not found");
  }

  return existing;
};

export const updateEarningTypeService = async ({ schoolSlug, slug, payload }) => {
  const existing = await getEarningTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Earning type not found");
  }

  const duplicateValue = payload.earningType !== undefined ? payload.earningType.trim().toUpperCase() : existing.earningType;


  const duplicate = await findDuplicateEarningTypeRepo({
    schoolSlug,
    value: duplicateValue,
    excludeSlug: slug,
  });

  if (duplicate) {
    throw new Error("Earning type already exists");
  }

  return updateEarningTypeRepo({
    slug,
    data: {
      ...(payload.earningType !== undefined ? { earningType: payload.earningType.trim().toUpperCase() } : {}),
      ...(payload.valueType !== undefined ? { valueType: payload.valueType } : {}),
      ...(payload.value !== undefined ? { value: payload.value } : {}),
    },
  });
};

export const deleteEarningTypeService = async ({ schoolSlug, slug }) => {
  const existing = await getEarningTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Earning type not found");
  }

  if (!existing.isActive) {
    throw new Error("Earning type is already inactive");
  }

  return deleteEarningTypeRepo({ slug });
};

export const restoreEarningTypeService = async ({ schoolSlug, slug }) => {
  const existing = await getEarningTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Earning type not found");
  }

  if (existing.isActive) {
    throw new Error("Earning type is already active");
  }

  return restoreEarningTypeRepo({ slug });
};
