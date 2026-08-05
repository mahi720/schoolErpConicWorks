import prisma from "../../../../config/prisma.js";

const payBandInclude = {
  _count: {
    select: {
      structures: true,
    },
  },
};

export const findDuplicatePayBandRepo = async ({ schoolSlug, payBandName, excludeSlug }) => {
  return prisma.hrmPayBand.findFirst({
    where: {
      schoolSlug,
      payBandName,
      ...(excludeSlug ? { NOT: { slug: excludeSlug } } : {}),
    },
  });
};

export const createPayBandRepo = async (data) => {
  return prisma.hrmPayBand.create({ data, include: payBandInclude });
};

export const getPayBandsRepo = async ({ schoolSlug, status, search }) => {
  return prisma.hrmPayBand.findMany({
    where: {
      schoolSlug,
      ...(status ? { status } : {}),
      ...(search ? { payBandName: { contains: search } } : {}),
    },
    include: payBandInclude,
    orderBy: { createdAt: "desc" },
  });
};

export const getPayBandBySlugRepo = async ({ schoolSlug, slug }) => {
  return prisma.hrmPayBand.findFirst({
    where: { schoolSlug, slug },
    include: payBandInclude,
  });
};

export const updatePayBandRepo = async ({ slug, data }) => {
  return prisma.hrmPayBand.update({ where: { slug }, data, include: payBandInclude });
};

export const deletePayBandRepo = async ({ slug }) => {
  return prisma.hrmPayBand.update({
    where: { slug },
    data: { status: "inactive", isActive: false, deletedAt: new Date() },
  });
};

export const restorePayBandRepo = async ({ slug }) => {
  return prisma.hrmPayBand.update({
    where: { slug },
    data: { status: "active", isActive: true, deletedAt: null },
  });
};
