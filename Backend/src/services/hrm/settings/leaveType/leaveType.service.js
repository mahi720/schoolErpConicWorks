import { randomUUID } from "crypto";

import {
  createLeaveTypeRepo,
  findDuplicateLeaveTypeRepo,
  getLeaveTypeListRepo,
  getLeaveTypeBySlugRepo,
  updateLeaveTypeRepo,
  deleteLeaveTypeRepo,
  restoreLeaveTypeRepo,
} from "../../../../repositories/hrm/settings/leaveType/leaveType.repository.js";

export const createLeaveTypeService = async ({ schoolSlug, payload }) => {
  const duplicateValue = payload.leaveType.trim().toUpperCase();

  const duplicate = await findDuplicateLeaveTypeRepo({
    schoolSlug,
    value: duplicateValue,
  });

  if (duplicate) {
    throw new Error("Leave type already exists");
  }

  return createLeaveTypeRepo({
    slug: randomUUID(),
    schoolSlug,
    leaveType: payload.leaveType.trim().toUpperCase(),
    daysPerYear: payload.daysPerYear,
    uptoYear: payload.uptoYear,
    daysPerYearAfterYear: payload.daysPerYearAfterYear,
    carryForward: payload.carryForward,
    maximumValue: payload.maximumValue,
    leaveValue: payload.leaveValue,
  });
};

export const getLeaveTypeListService = async ({ schoolSlug, query }) => {
  return getLeaveTypeListRepo({
    schoolSlug,
    status: query.status,
    search: query.search?.trim(),
  });
};

export const getLeaveTypeBySlugService = async ({ schoolSlug, slug }) => {
  const existing = await getLeaveTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Leave type not found");
  }

  return existing;
};

export const updateLeaveTypeService = async ({ schoolSlug, slug, payload }) => {
  const existing = await getLeaveTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Leave type not found");
  }

  const duplicateValue = payload.leaveType !== undefined ? payload.leaveType.trim().toUpperCase() : existing.leaveType;


  const duplicate = await findDuplicateLeaveTypeRepo({
    schoolSlug,
    value: duplicateValue,
    excludeSlug: slug,
  });

  if (duplicate) {
    throw new Error("Leave type already exists");
  }

  return updateLeaveTypeRepo({
    slug,
    data: {
      ...(payload.leaveType !== undefined ? { leaveType: payload.leaveType.trim().toUpperCase() } : {}),
      ...(payload.daysPerYear !== undefined ? { daysPerYear: payload.daysPerYear } : {}),
      ...(payload.uptoYear !== undefined ? { uptoYear: payload.uptoYear } : {}),
      ...(payload.daysPerYearAfterYear !== undefined ? { daysPerYearAfterYear: payload.daysPerYearAfterYear } : {}),
      ...(payload.carryForward !== undefined ? { carryForward: payload.carryForward } : {}),
      ...(payload.maximumValue !== undefined ? { maximumValue: payload.maximumValue } : {}),
      ...(payload.leaveValue !== undefined ? { leaveValue: payload.leaveValue } : {}),
    },
  });
};

export const deleteLeaveTypeService = async ({ schoolSlug, slug }) => {
  const existing = await getLeaveTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Leave type not found");
  }

  if (!existing.isActive) {
    throw new Error("Leave type is already inactive");
  }

  return deleteLeaveTypeRepo({ slug });
};

export const restoreLeaveTypeService = async ({ schoolSlug, slug }) => {
  const existing = await getLeaveTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Leave type not found");
  }

  if (existing.isActive) {
    throw new Error("Leave type is already active");
  }

  return restoreLeaveTypeRepo({ slug });
};
