import prisma from "../../../../config/prisma.js";

export const getLoanSettingRepo = async ({ schoolSlug, db = prisma }) => {
  return db.hrmLoanSetting.findUnique({
    where: {
      schoolSlug,
    },
  });
};

export const upsertLoanSettingRepo = async ({
  slug,
  schoolSlug,
  data,
  db = prisma,
}) => {
  return db.hrmLoanSetting.upsert({
    where: {
      schoolSlug,
    },

    update: {
      ...data,

      status: "active",
      isActive: true,
      deletedAt: null,
    },

    create: {
      slug,
      schoolSlug,

      ...data,

      status: "active",
      isActive: true,
    },
  });
};
