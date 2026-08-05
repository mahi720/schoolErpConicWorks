import prisma from "../../../../config/prisma.js";

export const getLoanSettingRepo = async ({ schoolSlug }) => {
  return prisma.hrmLoanSetting.findUnique({ where: { schoolSlug } });
};

export const upsertLoanSettingRepo = async ({ slug, schoolSlug, forecloseInterest }) => {
  return prisma.hrmLoanSetting.upsert({
    where: { schoolSlug },
    update: {
      forecloseInterest,
      status: "active",
      isActive: true,
      deletedAt: null,
    },
    create: {
      slug,
      schoolSlug,
      forecloseInterest,
    },
  });
};
