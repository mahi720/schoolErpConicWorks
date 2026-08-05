import { randomUUID } from "crypto";
import {
  findAuthorizedDesignationRepo,
  findDuplicateAuthorizedPersonRepo,
  createAuthorizedPersonRepo,
  getAuthorizedPersonsRepo,
  getAuthorizedPersonBySlugRepo,
  updateAuthorizedPersonRepo,
  deleteAuthorizedPersonRepo,
  restoreAuthorizedPersonRepo,
} from "../../../../repositories/hrm/settings/authorizedPerson/authorizedPerson.repository.js";

const verifyDesignation = async ({ schoolSlug, designationSlug }) => {
  const designation = await findAuthorizedDesignationRepo({ schoolSlug, designationSlug });

  if (!designation) {
    throw new Error("Active designation not found");
  }
};

export const createAuthorizedPersonService = async ({ schoolSlug, payload }) => {
  await verifyDesignation({ schoolSlug, designationSlug: payload.designationSlug });

  const personName = payload.personName.trim();
  const duplicate = await findDuplicateAuthorizedPersonRepo({
    schoolSlug,
    designationSlug: payload.designationSlug,
    personName,
  });

  if (duplicate) {
    throw new Error("Authorized person already exists for this designation");
  }

  return createAuthorizedPersonRepo({
    slug: randomUUID(),
    schoolSlug,
    designationSlug: payload.designationSlug,
    personName,
  });
};

export const getAuthorizedPersonsService = async ({ schoolSlug, query }) => {
  return getAuthorizedPersonsRepo({
    schoolSlug,
    designationSlug: query.designationSlug,
    status: query.status,
    search: query.search?.trim(),
  });
};

export const getAuthorizedPersonBySlugService = async ({ schoolSlug, slug }) => {
  const existing = await getAuthorizedPersonBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Authorized person not found");
  }

  return existing;
};

export const updateAuthorizedPersonService = async ({ schoolSlug, slug, payload }) => {
  const existing = await getAuthorizedPersonBySlugRepo({ schoolSlug, slug });

  if (!existing) {
    throw new Error("Authorized person not found");
  }

  const designationSlug = payload.designationSlug ?? existing.designationSlug;
  const personName = payload.personName?.trim() ?? existing.personName;

  await verifyDesignation({ schoolSlug, designationSlug });

  const duplicate = await findDuplicateAuthorizedPersonRepo({
    schoolSlug,
    designationSlug,
    personName,
    excludeSlug: slug,
  });

  if (duplicate) {
    throw new Error("Authorized person already exists for this designation");
  }

  return updateAuthorizedPersonRepo({
    slug,
    data: {
      designationSlug,
      personName,
    },
  });
};

export const deleteAuthorizedPersonService = async ({ schoolSlug, slug }) => {
  const existing = await getAuthorizedPersonBySlugRepo({ schoolSlug, slug });

  if (!existing) throw new Error("Authorized person not found");
  if (!existing.isActive) throw new Error("Authorized person is already inactive");

  return deleteAuthorizedPersonRepo({ slug });
};

export const restoreAuthorizedPersonService = async ({ schoolSlug, slug }) => {
  const existing = await getAuthorizedPersonBySlugRepo({ schoolSlug, slug });

  if (!existing) throw new Error("Authorized person not found");
  if (existing.isActive) throw new Error("Authorized person is already active");

  return restoreAuthorizedPersonRepo({ slug });
};
