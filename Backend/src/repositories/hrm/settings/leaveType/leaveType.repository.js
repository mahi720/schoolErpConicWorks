import prisma from "../../../../config/prisma.js";

export const createLeaveTypeRepo = async (data) => {
  return prisma.hrmLeaveType.create({
    data,
  });
};

export const findDuplicateLeaveTypeRepo = async ({
  schoolSlug,
  value,
  excludeSlug,
}) => {
  return prisma.hrmLeaveType.findFirst({
    where: {
      schoolSlug,
      leaveType: value,
      ...(excludeSlug ? { NOT: { slug: excludeSlug } } : {}),
    },
  });
};

export const getLeaveTypeListRepo = async ({ schoolSlug, status, search }) => {
  return prisma.hrmLeaveType.findMany({
    where: {
      schoolSlug,
      ...(status ? { status } : {}),
      ...(search
        ? {
            leaveType: {
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

export const getLeaveTypeBySlugRepo = async ({ schoolSlug, slug }) => {
  return prisma.hrmLeaveType.findFirst({
    where: {
      schoolSlug,
      slug,
    },
  });
};

export const updateLeaveTypeRepo = async ({ slug, data }) => {
  return prisma.hrmLeaveType.update({
    where: { slug },
    data,
  });
};

export const deleteLeaveTypeRepo = async ({ slug }) => {
  return prisma.hrmLeaveType.update({
    where: { slug },
    data: {
      status: "inactive",
      isActive: false,
      deletedAt: new Date(),
    },
  });
};

export const restoreLeaveTypeRepo = async ({ slug }) => {
  return prisma.hrmLeaveType.update({
    where: { slug },
    data: {
      status: "active",
      isActive: true,
      deletedAt: null,
    },
  });
};
