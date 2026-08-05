import prisma from "../../../../config/prisma.js";

export const createEmployeeLetterTypeRepo = async (data) => {
  return prisma.hrmEmployeeLetterType.create({
    data,
  });
};

export const findDuplicateEmployeeLetterTypeRepo = async ({
  schoolSlug,
  value,
  excludeSlug,
}) => {
  return prisma.hrmEmployeeLetterType.findFirst({
    where: {
      schoolSlug,
      letterTypeName: value,
      ...(excludeSlug ? { NOT: { slug: excludeSlug } } : {}),
    },
  });
};

export const getEmployeeLetterTypeListRepo = async ({ schoolSlug, status, search }) => {
  return prisma.hrmEmployeeLetterType.findMany({
    where: {
      schoolSlug,
      ...(status ? { status } : {}),
      ...(search
        ? {
            letterTypeName: {
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

export const getEmployeeLetterTypeBySlugRepo = async ({ schoolSlug, slug }) => {
  return prisma.hrmEmployeeLetterType.findFirst({
    where: {
      schoolSlug,
      slug,
    },
  });
};

export const updateEmployeeLetterTypeRepo = async ({ slug, data }) => {
  return prisma.hrmEmployeeLetterType.update({
    where: { slug },
    data,
  });
};

export const deleteEmployeeLetterTypeRepo = async ({ slug }) => {
  return prisma.hrmEmployeeLetterType.update({
    where: { slug },
    data: {
      status: "inactive",
      isActive: false,
      deletedAt: new Date(),
    },
  });
};

export const restoreEmployeeLetterTypeRepo = async ({ slug }) => {
  return prisma.hrmEmployeeLetterType.update({
    where: { slug },
    data: {
      status: "active",
      isActive: true,
      deletedAt: null,
    },
  });
};
