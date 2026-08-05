import { randomUUID } from "crypto";

import {
  createDegreeDocumentTypeRepo,
  findDuplicateDegreeDocumentTypeRepo,
  getDegreeDocumentTypeListRepo,
  getDegreeDocumentTypeBySlugRepo,
  updateDegreeDocumentTypeRepo,
  deleteDegreeDocumentTypeRepo,
  restoreDegreeDocumentTypeRepo,
} from "../../../../repositories/hrm/settings/degreeDocumentType/degreeDocumentType.repository.js";

export const createDegreeDocumentTypeService = async ({ schoolSlug, payload }) => {
  const duplicateValue = payload.documentName.trim();

  const duplicate = await findDuplicateDegreeDocumentTypeRepo({
    schoolSlug,
    value: duplicateValue,
  });

  if (duplicate) {
    throw new Error("Degree document type already exists");
  }

  return createDegreeDocumentTypeRepo({
    slug: randomUUID(),
    schoolSlug,
    documentName: payload.documentName.trim(),
  });
};

export const getDegreeDocumentTypeListService = async ({ schoolSlug, query }) => {
  return getDegreeDocumentTypeListRepo({
    schoolSlug,
    status: query.status,
    search: query.search?.trim(),
  });
};

export const getDegreeDocumentTypeBySlugService = async ({ schoolSlug, slug }) => {
  const existing = await getDegreeDocumentTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Degree document type not found");
  }

  return existing;
};

export const updateDegreeDocumentTypeService = async ({ schoolSlug, slug, payload }) => {
  const existing = await getDegreeDocumentTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Degree document type not found");
  }

  const duplicateValue = payload.documentName !== undefined ? payload.documentName.trim() : existing.documentName;


  const duplicate = await findDuplicateDegreeDocumentTypeRepo({
    schoolSlug,
    value: duplicateValue,
    excludeSlug: slug,
  });

  if (duplicate) {
    throw new Error("Degree document type already exists");
  }

  return updateDegreeDocumentTypeRepo({
    slug,
    data: {
      ...(payload.documentName !== undefined ? { documentName: payload.documentName.trim() } : {}),
    },
  });
};

export const deleteDegreeDocumentTypeService = async ({ schoolSlug, slug }) => {
  const existing = await getDegreeDocumentTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Degree document type not found");
  }

  if (!existing.isActive) {
    throw new Error("Degree document type is already inactive");
  }

  return deleteDegreeDocumentTypeRepo({ slug });
};

export const restoreDegreeDocumentTypeService = async ({ schoolSlug, slug }) => {
  const existing = await getDegreeDocumentTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Degree document type not found");
  }

  if (existing.isActive) {
    throw new Error("Degree document type is already active");
  }

  return restoreDegreeDocumentTypeRepo({ slug });
};
