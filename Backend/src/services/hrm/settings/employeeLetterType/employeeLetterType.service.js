import { randomUUID } from "crypto";

import {
  createEmployeeLetterTypeRepo,
  findDuplicateEmployeeLetterTypeRepo,
  getEmployeeLetterTypeListRepo,
  getEmployeeLetterTypeBySlugRepo,
  updateEmployeeLetterTypeRepo,
  deleteEmployeeLetterTypeRepo,
  restoreEmployeeLetterTypeRepo,
} from "../../../../repositories/hrm/settings/employeeLetterType/employeeLetterType.repository.js";

export const createEmployeeLetterTypeService = async ({ schoolSlug, payload }) => {
  const duplicateValue = payload.letterTypeName.trim();

  const duplicate = await findDuplicateEmployeeLetterTypeRepo({
    schoolSlug,
    value: duplicateValue,
  });

  if (duplicate) {
    throw new Error("Employee letter type already exists");
  }

  return createEmployeeLetterTypeRepo({
    slug: randomUUID(),
    schoolSlug,
    letterTypeName: payload.letterTypeName.trim(),
    letterContent: payload.letterContent,
  });
};

export const getEmployeeLetterTypeListService = async ({ schoolSlug, query }) => {
  return getEmployeeLetterTypeListRepo({
    schoolSlug,
    status: query.status,
    search: query.search?.trim(),
  });
};

export const getEmployeeLetterTypeBySlugService = async ({ schoolSlug, slug }) => {
  const existing = await getEmployeeLetterTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Employee letter type not found");
  }

  return existing;
};

export const updateEmployeeLetterTypeService = async ({ schoolSlug, slug, payload }) => {
  const existing = await getEmployeeLetterTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Employee letter type not found");
  }

  const duplicateValue = payload.letterTypeName !== undefined ? payload.letterTypeName.trim() : existing.letterTypeName;


  const duplicate = await findDuplicateEmployeeLetterTypeRepo({
    schoolSlug,
    value: duplicateValue,
    excludeSlug: slug,
  });

  if (duplicate) {
    throw new Error("Employee letter type already exists");
  }

  return updateEmployeeLetterTypeRepo({
    slug,
    data: {
      ...(payload.letterTypeName !== undefined ? { letterTypeName: payload.letterTypeName.trim() } : {}),
      ...(payload.letterContent !== undefined ? { letterContent: payload.letterContent } : {}),
    },
  });
};

export const deleteEmployeeLetterTypeService = async ({ schoolSlug, slug }) => {
  const existing = await getEmployeeLetterTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Employee letter type not found");
  }

  if (!existing.isActive) {
    throw new Error("Employee letter type is already inactive");
  }

  return deleteEmployeeLetterTypeRepo({ slug });
};

export const restoreEmployeeLetterTypeService = async ({ schoolSlug, slug }) => {
  const existing = await getEmployeeLetterTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Employee letter type not found");
  }

  if (existing.isActive) {
    throw new Error("Employee letter type is already active");
  }

  return restoreEmployeeLetterTypeRepo({ slug });
};
