import prisma from "../../../../config/prisma.js";

export const findStructurePayBandRepo = async ({ schoolSlug, payBandSlug }) => {
  return prisma.hrmPayBand.findFirst({
    where: { schoolSlug, slug: payBandSlug, isActive: true },
  });
};

export const findEarningTypeForStructureRepo = async ({ schoolSlug, slug }) => {
  return prisma.hrmEarningType.findFirst({
    where: { schoolSlug, slug, isActive: true },
  });
};

export const findDeductionTypeForStructureRepo = async ({ schoolSlug, slug }) => {
  return prisma.hrmDeductionType.findFirst({
    where: { schoolSlug, slug, isActive: true },
  });
};

export const getPayBandStructureRepo = async ({ schoolSlug, payBandSlug }) => {
  return prisma.hrmPayBandStructure.findMany({
    where: { schoolSlug, payBandSlug, isActive: true },
    include: { earningType: true, deductionType: true },
    orderBy: [{ componentType: "asc" }, { displayOrder: "asc" }],
  });
};

export const replacePayBandStructureRepo = async ({ schoolSlug, payBandSlug, rows }) => {
  return prisma.$transaction(async (tx) => {
    await tx.hrmPayBandStructure.deleteMany({
      where: { schoolSlug, payBandSlug },
    });

    for (const row of rows) {
      await tx.hrmPayBandStructure.create({ data: row });
    }

    return tx.hrmPayBandStructure.findMany({
      where: { schoolSlug, payBandSlug },
      include: { earningType: true, deductionType: true },
      orderBy: [{ componentType: "asc" }, { displayOrder: "asc" }],
    });
  });
};
