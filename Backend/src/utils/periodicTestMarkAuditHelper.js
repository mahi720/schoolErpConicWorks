import { randomUUID } from "crypto";

const normalizeForwardedFor = (value) => {
    if (!value) return null;

    if (Array.isArray(value)) {
        return value.join(", ");
    }

    return String(value);
};

export const getPeriodicTestRequestMetadata = (req) => {
    const forwardedFor =
        req.headers["x-forwarded-for"] || null;

    const ipAddress =
        req.ip ||
        req.socket?.remoteAddress ||
        req.connection?.remoteAddress ||
        null;

    return {
        ipAddress,
        forwardedFor:
            normalizeForwardedFor(forwardedFor),
        userAgent:
            req.headers["user-agent"] || null,
        requestMethod: req.method || null,
        requestPath:
            req.originalUrl || req.url || null,
        requestId:
            req.headers["x-request-id"] ||
            req.id ||
            null,
        deviceIdentifier:
            req.headers["x-device-id"] ||
            req.headers["device-identifier"] ||
            null,
    };
};

export const getAuditActorSnapshot = (user) => {
    return {
        performedBySlug: user?.slug || null,
        actorName: user?.name || null,
        actorEmail: user?.email || null,
        actorRole: user?.role || null,
    };
};

export const buildPeriodicTestScopeKey = ({
    sectionSlug,
    streamSlug,
}) => {
    if (sectionSlug && streamSlug) {
        return `SECTION:${sectionSlug}|STREAM:${streamSlug}`;
    }

    if (sectionSlug) {
        return `SECTION:${sectionSlug}`;
    }

    if (streamSlug) {
        return `STREAM:${streamSlug}`;
    }

    return "CLASS";
};

export const buildChangedFields = ({
    oldData,
    newData,
}) => {
    const changedFields = {};

    const keys = new Set([
        ...Object.keys(oldData || {}),
        ...Object.keys(newData || {}),
    ]);

    for (const key of keys) {
        const previousValue = oldData?.[key] ?? null;
        const newValue = newData?.[key] ?? null;

        if (
            JSON.stringify(previousValue) !==
            JSON.stringify(newValue)
        ) {
            changedFields[key] = {
                previousValue,
                newValue,
            };
        }
    }

    return changedFields;
};

export const buildBasePeriodicTestAuditData = ({
    context,
    actor,
    requestMetadata,
    action,
    result = "SUCCESS",
    requestBody,
    remarks,
    errorMessage,
}) => {
    return {
        slug: randomUUID(),
        schoolSlug: context.schoolSlug,
        submissionSlug:
            context.submissionSlug || null,
        studentMarkSlug:
            context.studentMarkSlug || null,
        periodicTestSlug:
            context.periodicTestSlug || null,
        classSlug: context.classSlug || null,
        classSubjectSlug:
            context.classSubjectSlug || null,
        sectionSlug: context.sectionSlug || null,
        streamSlug: context.streamSlug || null,
        studentSlug: context.studentSlug || null,

        performedBySlug:
            actor.performedBySlug || null,
        action,
        result,

        actorName: actor.actorName || null,
        actorEmail: actor.actorEmail || null,
        actorRole: actor.actorRole || null,

        periodicTestTitle:
            context.periodicTestTitle || null,
        academicYear:
            context.academicYear || null,
        boardTitle:
            context.boardTitle || null,
        classTitle:
            context.classTitle || null,
        subjectTitle:
            context.subjectTitle || null,
        studyMode:
            context.studyMode || null,
        sectionTitle:
            context.sectionTitle || null,
        streamTitle:
            context.streamTitle || null,

        studentName:
            context.studentName || null,
        admissionNumber:
            context.admissionNumber || null,
        rollNo: context.rollNo ?? null,

        remarks: remarks || null,
        requestBody: requestBody || null,

        ipAddress:
            requestMetadata.ipAddress || null,
        forwardedFor:
            requestMetadata.forwardedFor || null,
        userAgent:
            requestMetadata.userAgent || null,
        requestMethod:
            requestMetadata.requestMethod || null,
        requestPath:
            requestMetadata.requestPath || null,
        requestId:
            requestMetadata.requestId || null,
        deviceIdentifier:
            requestMetadata.deviceIdentifier || null,

        errorMessage: errorMessage || null,
    };
};