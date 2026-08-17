import prisma from "../../../../config/prisma.js";

export const createLoanInterestRepo = async (data) => {
  return prisma.hrmLoanInterest.create({
    data,
  });
};

export const findDuplicateLoanInterestRepo = async ({
  schoolSlug,
  value,
  excludeSlug,
}) => {
  return prisma.hrmLoanInterest.findFirst({
    where: {
      schoolSlug,
      durationMonths: value,
      ...(excludeSlug ? { NOT: { slug: excludeSlug } } : {}),
    },
  });
};

export const getLoanInterestListRepo = async ({
  schoolSlug,
  status,
  search,
}) => {
  return prisma.hrmLoanInterest.findMany({
    where: {
      schoolSlug,
      ...(status ? { status } : {}),
      ...(search
        ? {
          durationMonths: {
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

export const getLoanInterestBySlugRepo = async ({ schoolSlug, slug }) => {
  return prisma.hrmLoanInterest.findFirst({
    where: {
      schoolSlug,
      slug,
    },
  });
};

export const updateLoanInterestRepo = async ({ slug, data }) => {
  return prisma.hrmLoanInterest.update({
    where: { slug },
    data,
  });
};

export const deleteLoanInterestRepo = async ({ slug }) => {
  return prisma.hrmLoanInterest.update({
    where: { slug },
    data: {
      status: "inactive",
      isActive: false,
      deletedAt: new Date(),
    },
  });
};

export const restoreLoanInterestRepo = async ({ slug }) => {
  return prisma.hrmLoanInterest.update({
    where: { slug },
    data: {
      status: "active",
      isActive: true,
      deletedAt: null,
    },
  });
};
