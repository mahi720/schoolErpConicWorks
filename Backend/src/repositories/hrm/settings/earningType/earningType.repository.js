import prisma from "../../../../config/prisma.js";

export const createEarningTypeRepo = async (data) => {
  return prisma.hrmEarningType.create({
    data,
  });
};

export const findDuplicateEarningTypeRepo = async ({
  schoolSlug,
  value,
  excludeSlug,
}) => {
  return prisma.hrmEarningType.findFirst({
    where: {
      schoolSlug,
      earningType: value,
      ...(excludeSlug ? { NOT: { slug: excludeSlug } } : {}),
    },
  });
};

export const getEarningTypeListRepo = async ({ schoolSlug, status, search }) => {
  return prisma.hrmEarningType.findMany({
    where: {
      schoolSlug,
      ...(status ? { status } : {}),
      ...(search
        ? {
            earningType: {
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

export const getEarningTypeBySlugRepo = async ({ schoolSlug, slug }) => {
  return prisma.hrmEarningType.findFirst({
    where: {
      schoolSlug,
      slug,
    },
  });
};

export const updateEarningTypeRepo = async ({ slug, data }) => {
  return prisma.hrmEarningType.update({
    where: { slug },
    data,
  });
};

export const deleteEarningTypeRepo = async ({ slug }) => {
  return prisma.hrmEarningType.update({
    where: { slug },
    data: {
      status: "inactive",
      isActive: false,
      deletedAt: new Date(),
    },
  });
};

export const restoreEarningTypeRepo = async ({ slug }) => {
  return prisma.hrmEarningType.update({
    where: { slug },
    data: {
      status: "active",
      isActive: true,
      deletedAt: null,
    },
  });
};
