import prisma from "../../../../config/prisma.js";

export const createDegreeDocumentTypeRepo = async (data) => {
  return prisma.hrmDegreeDocumentType.create({
    data,
  });
};

export const findDuplicateDegreeDocumentTypeRepo = async ({
  schoolSlug,
  value,
  excludeSlug,
}) => {
  return prisma.hrmDegreeDocumentType.findFirst({
    where: {
      schoolSlug,
      documentName: value,
      ...(excludeSlug ? { NOT: { slug: excludeSlug } } : {}),
    },
  });
};

export const getDegreeDocumentTypeListRepo = async ({ schoolSlug, status, search }) => {
  return prisma.hrmDegreeDocumentType.findMany({
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

export const getDegreeDocumentTypeBySlugRepo = async ({ schoolSlug, slug }) => {
  return prisma.hrmDegreeDocumentType.findFirst({
    where: {
      schoolSlug,
      slug,
    },
  });
};

export const updateDegreeDocumentTypeRepo = async ({ slug, data }) => {
  return prisma.hrmDegreeDocumentType.update({
    where: { slug },
    data,
  });
};

export const deleteDegreeDocumentTypeRepo = async ({ slug }) => {
  return prisma.hrmDegreeDocumentType.update({
    where: { slug },
    data: {
      status: "inactive",
      isActive: false,
      deletedAt: new Date(),
    },
  });
};

export const restoreDegreeDocumentTypeRepo = async ({ slug }) => {
  return prisma.hrmDegreeDocumentType.update({
    where: { slug },
    data: {
      status: "active",
      isActive: true,
      deletedAt: null,
    },
  });
};
