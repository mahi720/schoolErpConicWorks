import { randomUUID } from "crypto";

import {
    findAdvancePolicyDepartmentByNameRepo,
    findAdvancePolicyDepartmentBySlugRepo,
    findDuplicateAdvancePolicyRepo,
    findActiveGlobalAdvancePolicyRepo,
    findActiveDepartmentAdvancePolicyRepo,
    createAdvancePolicyRepo,
    getAdvancePoliciesRepo,
    findAdvancePolicyBySlugRepo,
    updateAdvancePolicyRepo,
} from "../../../../repositories/HRM/settings/advancePolicy/advancePolicy.repository.js";

const normalizePolicyName = (value) => {
    return String(value || "")
        .trim()
        .replace(/\s+/g, " ");
};

const resolveActiveStatus = (value) => {
    if (value === "inactive") {
        return false;
    }

    if (value === "all") {
        return undefined;
    }

    return true;
};

const resolveDepartment = async ({ schoolSlug, department }) => {
    if (!department || String(department).trim().toUpperCase() === "ALL") {
        return null;
    }

    const value = String(department).trim();

    let departmentData = await findAdvancePolicyDepartmentBySlugRepo({
        schoolSlug,

        departmentSlug: value,
    });

    if (departmentData) {
        return departmentData;
    }

    departmentData = await findAdvancePolicyDepartmentByNameRepo({
        schoolSlug,

        departmentName: value,
    });

    if (!departmentData) {
        throw new Error("Department not found");
    }

    return departmentData;
};

const normalizePolicyValues = (payload) => {
    const calculationBasis = payload.calculationBasis;

    const interestType = payload.interestType;

    return {
        policyName: normalizePolicyName(payload.policyName),

        eligibilityAfterMonths: Number(payload.eligibilityAfterMonths ?? 6),

        calculationBasis,

        maximumSalaryMonths:
            calculationBasis === "FIXED"
                ? null
                : payload.maximumSalaryMonths !== null &&
                    payload.maximumSalaryMonths !== undefined
                    ? Number(payload.maximumSalaryMonths)
                    : null,

        maximumAmount:
            payload.maximumAmount !== null && payload.maximumAmount !== undefined
                ? Number(payload.maximumAmount)
                : null,

        minimumAmount:
            payload.minimumAmount !== null && payload.minimumAmount !== undefined
                ? Number(payload.minimumAmount)
                : null,

        maximumInstallments: Number(payload.maximumInstallments ?? 6),

        interestType,

        interestRate:
            interestType === "PERCENTAGE" ? Number(payload.interestRate || 0) : 0,

        flatInterestAmount:
            interestType === "FLAT" ? Number(payload.flatInterestAmount || 0) : null,

        allowMultipleAdvance: Boolean(payload.allowMultipleAdvance),

        approvalRequired: payload.approvalRequired !== false,
    };
};

const validateNormalizedPolicy = (data) => {
    if (
        ["BASIC", "GROSS"].includes(data.calculationBasis) &&
        (!data.maximumSalaryMonths || Number(data.maximumSalaryMonths) <= 0)
    ) {
        throw new Error(
            "Maximum salary months is required for Basic or Gross calculation",
        );
    }

    if (
        data.calculationBasis === "FIXED" &&
        (!data.maximumAmount || Number(data.maximumAmount) <= 0)
    ) {
        throw new Error("Maximum amount is required for Fixed calculation");
    }

    if (
        data.minimumAmount &&
        data.maximumAmount &&
        Number(data.minimumAmount) > Number(data.maximumAmount)
    ) {
        throw new Error("Minimum amount cannot be greater than maximum amount");
    }

    if (
        data.interestType === "FLAT" &&
        (!data.flatInterestAmount || Number(data.flatInterestAmount) <= 0)
    ) {
        throw new Error("Flat interest amount is required");
    }

    if (data.interestType === "PERCENTAGE" && Number(data.interestRate) <= 0) {
        throw new Error("Interest rate is required");
    }
};

const formatAdvancePolicy = (item) => {
    if (!item) {
        return null;
    }

    return {
        slug: item.slug,

        policyName: item.policyName,

        departmentSlug: item.departmentSlug,

        department: item.department?.departmentName || "ALL",

        eligibilityAfterMonths: item.eligibilityAfterMonths,

        calculationBasis: item.calculationBasis,

        maximumSalaryMonths:
            item.maximumSalaryMonths !== null
                ? Number(item.maximumSalaryMonths)
                : null,

        maximumAmount:
            item.maximumAmount !== null ? Number(item.maximumAmount) : null,

        minimumAmount:
            item.minimumAmount !== null ? Number(item.minimumAmount) : null,

        maximumInstallments: item.maximumInstallments,

        interestType: item.interestType,

        interestRate: Number(item.interestRate || 0),

        flatInterestAmount:
            item.flatInterestAmount !== null ? Number(item.flatInterestAmount) : null,

        allowMultipleAdvance: item.allowMultipleAdvance,

        approvalRequired: item.approvalRequired,

        status: item.status,

        isActive: item.isActive,

        deletedAt: item.deletedAt,

        createdAt: item.createdAt,

        updatedAt: item.updatedAt,
    };
};

export const createAdvancePolicyService = async ({ schoolSlug, payload }) => {
    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const department = await resolveDepartment({
        schoolSlug,

        department: payload.department,
    });

    const normalized = normalizePolicyValues(payload);

    validateNormalizedPolicy(normalized);

    const duplicate = await findDuplicateAdvancePolicyRepo({
        schoolSlug,

        policyName: normalized.policyName,

        departmentSlug: department?.slug || null,
    });

    if (duplicate) {
        throw new Error(
            "Advance policy with this name already exists for selected department",
        );
    }

    if (department) {
        const existingDepartmentPolicy =
            await findActiveDepartmentAdvancePolicyRepo({
                schoolSlug,

                departmentSlug: department.slug,
            });

        if (existingDepartmentPolicy) {
            throw new Error(
                "An active advance policy already exists for this department",
            );
        }
    } else {
        const globalPolicy = await findActiveGlobalAdvancePolicyRepo({
            schoolSlug,
        });

        if (globalPolicy) {
            throw new Error("An active global advance policy already exists");
        }
    }

    const created = await createAdvancePolicyRepo({
        slug: randomUUID(),

        schoolSlug,

        departmentSlug: department?.slug || null,

        ...normalized,

        status: "active",

        isActive: true,

        deletedAt: null,
    });

    return formatAdvancePolicy(created);
};

export const getAdvancePoliciesService = async ({ schoolSlug, query = {} }) => {
    let departmentSlug;

    if (query.department && query.department !== "all") {
        const department = await resolveDepartment({
            schoolSlug,

            department: query.department,
        });

        departmentSlug = department?.slug;
    }

    const rows = await getAdvancePoliciesRepo({
        schoolSlug,

        search: query.search?.trim() || undefined,

        departmentSlug,

        calculationBasis: query.calculationBasis || undefined,

        interestType: query.interestType || undefined,

        isActive: resolveActiveStatus(query.status),
    });

    return rows.map(formatAdvancePolicy);
};

export const getAdvancePolicyBySlugService = async ({ schoolSlug, slug }) => {
    const policy = await findAdvancePolicyBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!policy) {
        throw new Error("Advance policy not found");
    }

    return formatAdvancePolicy(policy);
};

export const updateAdvancePolicyService = async ({
    schoolSlug,
    slug,
    payload,
}) => {
    const existing = await findAdvancePolicyBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!existing) {
        throw new Error("Advance policy not found");
    }

    if (!existing.isActive) {
        throw new Error("Inactive advance policy cannot be edited");
    }

    let department = null;

    if (Object.prototype.hasOwnProperty.call(payload, "department")) {
        department = await resolveDepartment({
            schoolSlug,

            department: payload.department,
        });
    } else if (existing.departmentSlug) {
        department = {
            slug: existing.departmentSlug,
        };
    }

    const mergedPayload = {
        policyName: payload.policyName ?? existing.policyName,

        eligibilityAfterMonths:
            payload.eligibilityAfterMonths ?? existing.eligibilityAfterMonths,

        calculationBasis: payload.calculationBasis ?? existing.calculationBasis,

        maximumSalaryMonths:
            payload.maximumSalaryMonths !== undefined
                ? payload.maximumSalaryMonths
                : existing.maximumSalaryMonths,

        maximumAmount:
            payload.maximumAmount !== undefined
                ? payload.maximumAmount
                : existing.maximumAmount,

        minimumAmount:
            payload.minimumAmount !== undefined
                ? payload.minimumAmount
                : existing.minimumAmount,

        maximumInstallments:
            payload.maximumInstallments ?? existing.maximumInstallments,

        interestType: payload.interestType ?? existing.interestType,

        interestRate:
            payload.interestRate !== undefined
                ? payload.interestRate
                : existing.interestRate,

        flatInterestAmount:
            payload.flatInterestAmount !== undefined
                ? payload.flatInterestAmount
                : existing.flatInterestAmount,

        allowMultipleAdvance:
            payload.allowMultipleAdvance ?? existing.allowMultipleAdvance,

        approvalRequired: payload.approvalRequired ?? existing.approvalRequired,
    };

    const normalized = normalizePolicyValues(mergedPayload);

    validateNormalizedPolicy(normalized);

    const duplicate = await findDuplicateAdvancePolicyRepo({
        schoolSlug,

        policyName: normalized.policyName,

        departmentSlug: department?.slug || null,

        excludeSlug: slug,
    });

    if (duplicate) {
        throw new Error(
            "Advance policy with this name already exists for selected department",
        );
    }

    if (department) {
        const activePolicy = await findActiveDepartmentAdvancePolicyRepo({
            schoolSlug,

            departmentSlug: department.slug,

            excludeSlug: slug,
        });

        if (activePolicy) {
            throw new Error(
                "Another active advance policy already exists for this department",
            );
        }
    } else {
        const globalPolicy = await findActiveGlobalAdvancePolicyRepo({
            schoolSlug,

            excludeSlug: slug,
        });

        if (globalPolicy) {
            throw new Error("Another active global advance policy already exists");
        }
    }

    const updated = await updateAdvancePolicyRepo({
        slug,

        data: {
            departmentSlug: department?.slug || null,

            ...normalized,
        },
    });

    return formatAdvancePolicy(updated);
};

export const deleteAdvancePolicyService = async ({ schoolSlug, slug }) => {
    const existing = await findAdvancePolicyBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!existing) {
        throw new Error("Advance policy not found");
    }

    if (!existing.isActive) {
        throw new Error("Advance policy is already deleted");
    }

    const updated = await updateAdvancePolicyRepo({
        slug,

        data: {
            status: "inactive",

            isActive: false,

            deletedAt: new Date(),
        },
    });

    return formatAdvancePolicy(updated);
};

export const restoreAdvancePolicyService = async ({ schoolSlug, slug }) => {
    const existing = await findAdvancePolicyBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!existing) {
        throw new Error("Advance policy not found");
    }

    if (existing.isActive) {
        throw new Error("Advance policy is already active");
    }

    if (existing.departmentSlug) {
        const activePolicy = await findActiveDepartmentAdvancePolicyRepo({
            schoolSlug,

            departmentSlug: existing.departmentSlug,

            excludeSlug: slug,
        });

        if (activePolicy) {
            throw new Error(
                "Cannot restore because another active advance policy exists for this department",
            );
        }
    } else {
        const globalPolicy = await findActiveGlobalAdvancePolicyRepo({
            schoolSlug,

            excludeSlug: slug,
        });

        if (globalPolicy) {
            throw new Error(
                "Cannot restore because another active global advance policy already exists",
            );
        }
    }

    const updated = await updateAdvancePolicyRepo({
        slug,

        data: {
            status: "active",

            isActive: true,

            deletedAt: null,
        },
    });

    return formatAdvancePolicy(updated);
};
