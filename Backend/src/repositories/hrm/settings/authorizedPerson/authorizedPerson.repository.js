import prisma from "../../../../config/prisma.js";

const authorizedPersonInclude = {
  designation: {
    select: {
      slug: true,
      designationName: true,
      designationLevel: true,
      department: {
        select: {
          slug: true,
          departmentName: true,
        },
      },
    },
  },
};

export const findAuthorizedDesignationRepo = async ({ schoolSlug, designationSlug }) => {
  return prisma.hrmDesignation.findFirst({
    where: {
      schoolSlug,
      slug: designationSlug,
      isActive: true,
    },
  });
};

export const findDuplicateAuthorizedPersonRepo = async ({
  schoolSlug,
  designationSlug,
  personName,
  excludeSlug,
}) => {
  return prisma.hrmAuthorizedPerson.findFirst({
    where: {
      schoolSlug,
      designationSlug,
      personName,
      ...(excludeSlug ? { NOT: { slug: excludeSlug } } : {}),
    },
  });
};

export const createAuthorizedPersonRepo = async (data) => {
  return prisma.hrmAuthorizedPerson.create({
    data,
    include: authorizedPersonInclude,
  });
};

export const getAuthorizedPersonsRepo = async ({ schoolSlug, designationSlug, status, search }) => {
  return prisma.hrmAuthorizedPerson.findMany({
    where: {
      schoolSlug,
      ...(designationSlug ? { designationSlug } : {}),
      ...(status ? { status } : {}),
      ...(search ? { personName: { contains: search } } : {}),
    },
    include: authorizedPersonInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAuthorizedPersonBySlugRepo = async ({ schoolSlug, slug }) => {
  return prisma.hrmAuthorizedPerson.findFirst({
    where: { schoolSlug, slug },
    include: authorizedPersonInclude,
  });
};

export const updateAuthorizedPersonRepo = async ({ slug, data }) => {
  return prisma.hrmAuthorizedPerson.update({
    where: { slug },
    data,
    include: authorizedPersonInclude,
  });
};

export const deleteAuthorizedPersonRepo = async ({ slug }) => {
  return prisma.hrmAuthorizedPerson.update({
    where: { slug },
    data: {
      status: "inactive",
      isActive: false,
      deletedAt: new Date(),
    },
  });
};

export const restoreAuthorizedPersonRepo = async ({ slug }) => {
  return prisma.hrmAuthorizedPerson.update({
    where: { slug },
    data: {
      status: "active",
      isActive: true,
      deletedAt: null,
    },
  });
};
