import { randomUUID } from "crypto";

import {
  createIdentityDocumentTypeRepo,
  findDuplicateIdentityDocumentTypeRepo,
  getIdentityDocumentTypeListRepo,
  getIdentityDocumentTypeBySlugRepo,
  updateIdentityDocumentTypeRepo,
  deleteIdentityDocumentTypeRepo,
  restoreIdentityDocumentTypeRepo,
} from "../../../../repositories/hrm/settings/identityDocumentType/identityDocumentType.repository.js";

export const createIdentityDocumentTypeService = async ({ schoolSlug, payload }) => {
  const duplicateValue = payload.documentName.trim();

  const duplicate = await findDuplicateIdentityDocumentTypeRepo({
    schoolSlug,
    value: duplicateValue,
  });

  if (duplicate) {
    throw new Error("Identity document type already exists");
  }

  return createIdentityDocumentTypeRepo({
    slug: randomUUID(),
    schoolSlug,
    documentName: payload.documentName.trim(),
  });
};

export const getIdentityDocumentTypeListService = async ({ schoolSlug, query }) => {
  return getIdentityDocumentTypeListRepo({
    schoolSlug,
    status: query.status,
    search: query.search?.trim(),
  });
};

export const getIdentityDocumentTypeBySlugService = async ({ schoolSlug, slug }) => {
  const existing = await getIdentityDocumentTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Identity document type not found");
  }

  return existing;
};

export const updateIdentityDocumentTypeService = async ({ schoolSlug, slug, payload }) => {
  const existing = await getIdentityDocumentTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Identity document type not found");
  }

  const duplicateValue = payload.documentName !== undefined ? payload.documentName.trim() : existing.documentName;


  const duplicate = await findDuplicateIdentityDocumentTypeRepo({
    schoolSlug,
    value: duplicateValue,
    excludeSlug: slug,
  });

  if (duplicate) {
    throw new Error("Identity document type already exists");
  }

  return updateIdentityDocumentTypeRepo({
    slug,
    data: {
      ...(payload.documentName !== undefined ? { documentName: payload.documentName.trim() } : {}),
    },
  });
};

export const deleteIdentityDocumentTypeService = async ({ schoolSlug, slug }) => {
  const existing = await getIdentityDocumentTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Identity document type not found");
  }

  if (!existing.isActive) {
    throw new Error("Identity document type is already inactive");
  }

  return deleteIdentityDocumentTypeRepo({ slug });
};

export const restoreIdentityDocumentTypeService = async ({ schoolSlug, slug }) => {
  const existing = await getIdentityDocumentTypeBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Identity document type not found");
  }

  if (existing.isActive) {
    throw new Error("Identity document type is already active");
  }

  return restoreIdentityDocumentTypeRepo({ slug });
};
