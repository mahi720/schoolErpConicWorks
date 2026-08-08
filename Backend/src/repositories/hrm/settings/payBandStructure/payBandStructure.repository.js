import prisma from "../../../../config/prisma.js";

export const findStructurePayBandRepo = async ({
  schoolSlug,
  payBandSlug,
}) => {
  return prisma.hrmPayBand.findFirst({
    where: {
      schoolSlug,
      slug: payBandSlug,
      isActive: true,
    },
  });
};

export const findEarningTypeForStructureRepo = async ({
  schoolSlug,
  slug,
}) => {
  return prisma.hrmEarningType.findFirst({
    where: {
      schoolSlug,
      slug,
      isActive: true,
    },
  });
};

export const findDeductionTypeForStructureRepo = async ({
  schoolSlug,
  slug,
}) => {
  return prisma.hrmDeductionType.findFirst({
    where: {
      schoolSlug,
      slug,
      isActive: true,
    },
  });
};

export const getPayBandStructureRepo = async ({
  schoolSlug,
  payBandSlug,
}) => {
  return prisma.hrmPayBandStructure.findMany({
    where: {
      schoolSlug,
      payBandSlug,
      isActive: true,
    },

    include: {
      earningType: true,
      deductionType: true,
    },

    orderBy: [
      {
        componentType: "asc",
      },
      {
        displayOrder: "asc",
      },
    ],
  });
};

export const savePayBandStructureRepo = async ({
  schoolSlug,
  payBandSlug,
  rows,
}) => {
  return prisma.$transaction(async (tx) => {
    const existingRows =
      await tx.hrmPayBandStructure.findMany({
        where: {
          schoolSlug,
          payBandSlug,
        },

        select: {
          slug: true,
        },
      });

    const incomingExistingSlugs =
      rows
        .filter((row) => row.slug)
        .map((row) => row.slug);

    const removedSlugs =
      existingRows
        .map((item) => item.slug)
        .filter(
          (slug) =>
            !incomingExistingSlugs.includes(
              slug,
            ),
        );

    if (removedSlugs.length > 0) {
      await tx.hrmPayBandStructure.deleteMany({
        where: {
          schoolSlug,
          payBandSlug,

          slug: {
            in: removedSlugs,
          },
        },
      });
    }

    for (const row of rows) {
      const {
        slug,
        ...data
      } = row;

      if (slug) {
        const existing =
          await tx.hrmPayBandStructure.findFirst({
            where: {
              slug,
              schoolSlug,
              payBandSlug,
            },

            select: {
              slug: true,
            },
          });

        if (existing) {
          await tx.hrmPayBandStructure.update({
            where: {
              slug,
            },

            data,
          });

          continue;
        }
      }

      await tx.hrmPayBandStructure.create({
        data: {
          ...data,

          slug,
        },
      });
    }

    return tx.hrmPayBandStructure.findMany({
      where: {
        schoolSlug,
        payBandSlug,
        isActive: true,
      },

      include: {
        earningType: true,
        deductionType: true,
      },

      orderBy: [
        {
          componentType: "asc",
        },
        {
          displayOrder: "asc",
        },
      ],
    });
  });
};