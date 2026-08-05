import prisma from "../../../../config/prisma.js";

export const createIdentityDocumentTypeRepo = async (data) => {
  return prisma.hrmIdentityDocumentType.create({
    data,
  });
};

export const findDuplicateIdentityDocumentTypeRepo = async ({
  schoolSlug,
  value,
  excludeSlug,
}) => {
  return prisma.hrmIdentityDocumentType.findFirst({
    where: {
      schoolSlug,
      documentName: value,
      ...(excludeSlug ? { NOT: { slug: excludeSlug } } : {}),
    },
  });
};

export const getIdentityDocumentTypeListRepo = async ({ schoolSlug, status, search }) => {
  return prisma.hrmIdentityDocumentType.findMany({
    where: {
      schoolSlug,
      ...(status ? { status } : {}),
      ...(search
        ? {
            documentName: {
              contains: search,
            },
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getIdentityDocumentTypeBySlugRepo = async ({ schoolSlug, slug }) => {
  return prisma.hrmIdentityDocumentType.findFirst({
    where: {
      schoolSlug,
      slug,
    },
  });
};

export const updateIdentityDocumentTypeRepo = async ({ slug, data }) => {
  return prisma.hrmIdentityDocumentType.update({
    where: { slug },
    data,
  });
};

export const deleteIdentityDocumentTypeRepo = async ({ slug }) => {
  return prisma.hrmIdentityDocumentType.update({
    where: { slug },
    data: {
      status: "inactive",
      isActive: false,
      deletedAt: new Date(),
    },
  });
};

export const restoreIdentityDocumentTypeRepo = async ({ slug }) => {
  return prisma.hrmIdentityDocumentType.update({
    where: { slug },
    data: {
      status: "active",
      isActive: true,
      deletedAt: null,
    },
  });
};
