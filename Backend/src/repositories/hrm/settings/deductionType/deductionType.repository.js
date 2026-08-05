import prisma from "../../../../config/prisma.js";

export const createDeductionTypeRepo = async (data) => {
  return prisma.hrmDeductionType.create({
    data,
  });
};

export const findDuplicateDeductionTypeRepo = async ({
  schoolSlug,
  value,
  excludeSlug,
}) => {
  return prisma.hrmDeductionType.findFirst({
    where: {
      schoolSlug,
      deductionType: value,
      ...(excludeSlug ? { NOT: { slug: excludeSlug } } : {}),
    },
  });
};

export const getDeductionTypeListRepo = async ({ schoolSlug, status, search }) => {
  return prisma.hrmDeductionType.findMany({
    where: {
      schoolSlug,
      ...(status ? { status } : {}),
      ...(search
        ? {
            deductionType: {
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

export const getDeductionTypeBySlugRepo = async ({ schoolSlug, slug }) => {
  return prisma.hrmDeductionType.findFirst({
    where: {
      schoolSlug,
      slug,
    },
  });
};

export const updateDeductionTypeRepo = async ({ slug, data }) => {
  return prisma.hrmDeductionType.update({
    where: { slug },
    data,
  });
};

export const deleteDeductionTypeRepo = async ({ slug }) => {
  return prisma.hrmDeductionType.update({
    where: { slug },
    data: {
      status: "inactive",
      isActive: false,
      deletedAt: new Date(),
    },
  });
};

export const restoreDeductionTypeRepo = async ({ slug }) => {
  return prisma.hrmDeductionType.update({
    where: { slug },
    data: {
      status: "active",
      isActive: true,
      deletedAt: null,
    },
  });
};
