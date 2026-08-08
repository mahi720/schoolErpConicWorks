import { randomUUID } from "crypto";

import {
  findStructurePayBandRepo,
  findEarningTypeForStructureRepo,
  findDeductionTypeForStructureRepo,
  getPayBandStructureRepo,
  savePayBandStructureRepo,
} from "../../../../repositories/hrm/settings/payBandStructure/payBandStructure.repository.js";

const verifyPayBand = async ({
  schoolSlug,
  payBandSlug,
}) => {
  const payBand =
    await findStructurePayBandRepo({
      schoolSlug,
      payBandSlug,
    });

  if (!payBand) {
    throw new Error(
      "Active pay band not found",
    );
  }

  return payBand;
};

const verifyAndResolveRows = async ({
  schoolSlug,
  structures,
}) => {
  const resolved = [];

  for (const row of structures) {
    if (row.isBasicPay) {
      resolved.push({
        ...row,

        earningTypeSlug:
          null,

        deductionTypeSlug:
          null,

        earningType:
          null,

        deductionType:
          null,

        calculationType:
          "FIXED",
      });

      continue;
    }

    if (
      row.componentType ===
      "EARNING"
    ) {
      const earningType =
        await findEarningTypeForStructureRepo({
          schoolSlug,
          slug:
            row.earningTypeSlug,
        });

      if (!earningType) {
        throw new Error(
          "Active earning type not found",
        );
      }

      resolved.push({
        ...row,

        earningType,

        deductionType:
          null,
      });

      continue;
    }

    const deductionType =
      await findDeductionTypeForStructureRepo({
        schoolSlug,
        slug:
          row.deductionTypeSlug,
      });

    if (!deductionType) {
      throw new Error(
        "Active deduction type not found",
      );
    }

    resolved.push({
      ...row,

      earningType:
        null,

      deductionType,
    });
  }

  return resolved;
};

export const getPayBandStructureService =
  async ({
    schoolSlug,
    payBandSlug,
  }) => {
    await verifyPayBand({
      schoolSlug,
      payBandSlug,
    });

    return getPayBandStructureRepo({
      schoolSlug,
      payBandSlug,
    });
  };

export const savePayBandStructureService =
  async ({
    schoolSlug,
    payBandSlug,
    payload,
  }) => {
    await verifyPayBand({
      schoolSlug,
      payBandSlug,
    });

    const resolvedRows =
      await verifyAndResolveRows({
        schoolSlug,

        structures:
          payload.structures,
      });

    const basicPayRow =
      resolvedRows.find(
        (row) =>
          row.componentType ===
          "EARNING" &&
          row.isBasicPay ===
          true,
      );

    if (!basicPayRow) {
      throw new Error(
        "BASIC PAY is required in structure",
      );
    }

    if (
      basicPayRow.calculationType !==
      "FIXED"
    ) {
      throw new Error(
        "BASIC PAY must be fixed",
      );
    }

    const basicPay =
      Number(
        basicPayRow.value,
      );

    const earningRows =
      resolvedRows
        .filter(
          (row) =>
            row.componentType ===
            "EARNING",
        )
        .sort(
          (a, b) =>
            a.displayOrder -
            b.displayOrder,
        );

    const deductionRows =
      resolvedRows
        .filter(
          (row) =>
            row.componentType ===
            "DEDUCTION",
        )
        .sort(
          (a, b) =>
            a.displayOrder -
            b.displayOrder,
        );

    let grossEarning = 0;

    const finalRows = [];

    for (
      const row of earningRows
    ) {
      const baseAmount =
        row.calculationBase ===
          "GROSS_EARNING"
          ? grossEarning
          : basicPay;

      const calculatedAmount =
        row.calculationType ===
          "PERCENT"
          ? (
            Number(
              row.value,
            ) /
            100
          ) *
          baseAmount
          : Number(
            row.value,
          );

      grossEarning +=
        calculatedAmount;

      finalRows.push({
        // Existing row → same slug.
        // New row → new slug.
        slug:
          row.slug ||
          randomUUID(),

        schoolSlug,

        payBandSlug,

        isBasicPay:
          Boolean(
            row.isBasicPay,
          ),

        earningTypeSlug:
          row.isBasicPay
            ? null
            : row.earningTypeSlug,

        deductionTypeSlug:
          null,

        componentType:
          "EARNING",

        calculationType:
          row.isBasicPay
            ? "FIXED"
            : row.calculationType,

        value:
          row.value,

        calculatedAmount,

        calculationBase:
          row.calculationBase,

        displayOrder:
          row.displayOrder,
      });
    }

    for (
      const row of deductionRows
    ) {
      const baseAmount =
        row.calculationBase ===
          "GROSS_EARNING"
          ? grossEarning
          : basicPay;

      let calculatedAmount =
        row.calculationType ===
          "PERCENT"
          ? (
            Number(
              row.value,
            ) /
            100
          ) *
          baseAmount
          : Number(
            row.value,
          );

      if (
        row.deductionType
          .maximumValue !==
        null &&
        calculatedAmount >
        Number(
          row.deductionType
            .maximumValue,
        )
      ) {
        calculatedAmount =
          Number(
            row.deductionType
              .maximumValue,
          );
      }

      finalRows.push({
        // Existing row → same slug.
        // New row → new slug.
        slug:
          row.slug ||
          randomUUID(),

        schoolSlug,

        payBandSlug,

        isBasicPay:
          false,

        earningTypeSlug:
          null,

        deductionTypeSlug:
          row.deductionTypeSlug,

        componentType:
          "DEDUCTION",

        calculationType:
          row.calculationType,

        value:
          row.value,

        calculatedAmount,

        calculationBase:
          row.calculationBase,

        displayOrder:
          row.displayOrder,
      });
    }

    return savePayBandStructureRepo({
      schoolSlug,

      payBandSlug,

      rows:
        finalRows,
    });
  };