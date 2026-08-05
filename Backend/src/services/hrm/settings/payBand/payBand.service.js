import { randomUUID } from "crypto";
import { removeLocalFile } from "../../../../utils/hrmSettingsHelpers.js";
import {
  findDuplicatePayBandRepo,
  createPayBandRepo,
  getPayBandsRepo,
  getPayBandBySlugRepo,
  updatePayBandRepo,
  deletePayBandRepo,
  restorePayBandRepo,
} from "../../../../repositories/hrm/settings/payBand/payBand.repository.js";

const getUploadedPath = (file) => file ? `/uploads/hrm/pay-bands/${file.filename}` : undefined;

export const createPayBandService = async ({ schoolSlug, payload, file }) => {
  const payBandName = payload.payBandName.trim();
  const duplicate = await findDuplicatePayBandRepo({ schoolSlug, payBandName });

  if (duplicate) throw new Error("Pay band already exists");

  return createPayBandRepo({
    slug: randomUUID(),
    schoolSlug,
    payBandName,
    image: getUploadedPath(file) ?? null,
  });
};

export const getPayBandsService = async ({ schoolSlug, query }) => {
  return getPayBandsRepo({
    schoolSlug,
    status: query.status,
    search: query.search?.trim(),
  });
};

export const getPayBandBySlugService = async ({ schoolSlug, slug }) => {
  const existing = await getPayBandBySlugRepo({ schoolSlug, slug });
  if (!existing) throw new Error("Pay band not found");
  return existing;
};

export const updatePayBandService = async ({ schoolSlug, slug, payload, file }) => {
  const existing = await getPayBandBySlugRepo({ schoolSlug, slug });
  if (!existing) throw new Error("Pay band not found");

  const payBandName = payload.payBandName?.trim() ?? existing.payBandName;
  const duplicate = await findDuplicatePayBandRepo({ schoolSlug, payBandName, excludeSlug: slug });
  if (duplicate) throw new Error("Pay band already exists");

  const newImage = getUploadedPath(file);
  const data = {
    payBandName,
    ...(newImage ? { image: newImage } : {}),
  };

  const updated = await updatePayBandRepo({ slug, data });

  if (newImage && existing.image) {
    removeLocalFile(existing.image);
  }

  return updated;
};

export const deletePayBandService = async ({ schoolSlug, slug }) => {
  const existing = await getPayBandBySlugRepo({ schoolSlug, slug });
  if (!existing) throw new Error("Pay band not found");
  if (!existing.isActive) throw new Error("Pay band is already inactive");
  return deletePayBandRepo({ slug });
};

export const restorePayBandService = async ({ schoolSlug, slug }) => {
  const existing = await getPayBandBySlugRepo({ schoolSlug, slug });
  if (!existing) throw new Error("Pay band not found");
  if (existing.isActive) throw new Error("Pay band is already active");
  return restorePayBandRepo({ slug });
};
