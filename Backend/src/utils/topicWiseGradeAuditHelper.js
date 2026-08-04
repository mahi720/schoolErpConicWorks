export const buildTopicWiseGradeScopeKey = ({
    sectionSlug = null,
    streamSlug = null,
}) => {
    const parts = [];

    if (sectionSlug) {
        parts.push(`SECTION:${sectionSlug}`);
    }

    if (streamSlug) {
        parts.push(`STREAM:${streamSlug}`);
    }

    return parts.length ? parts.join("|") : "CLASS";
};

export const getTopicWiseGradeRequestMetadata = (req) => {
    const forwardedForHeader = req.headers["x-forwarded-for"];

    return {
        ipAddress:
            (Array.isArray(forwardedForHeader)
                ? forwardedForHeader[0]
                : forwardedForHeader?.split(",")[0]?.trim()) ||
            req.ip ||
            req.socket?.remoteAddress ||
            null,
        forwardedFor: Array.isArray(forwardedForHeader)
            ? forwardedForHeader.join(",")
            : forwardedForHeader || null,
        userAgent: req.headers["user-agent"] || null,
        requestMethod: req.method || null,
        requestUrl: req.originalUrl || req.url || null,
        requestId:
            req.headers["x-request-id"] ||
            req.headers["request-id"] ||
            null,
        deviceIdentifier:
            req.headers["x-device-id"] ||
            req.headers["device-id"] ||
            null,
    };
};

export const getTopicWiseGradeAuditActor = (user) => {
    return {
        performedBySlug: user?.slug || null,
        actorName: user?.name || null,
        actorEmail: user?.email || null,
        actorRole: user?.role || null,
    };
};

export const buildTopicWiseGradeChangedFields = ({
    oldData = null,
    newData = null,
}) => {
    const keys = new Set([
        ...Object.keys(oldData || {}),
        ...Object.keys(newData || {}),
    ]);

    return [...keys].filter(
        (key) =>
            JSON.stringify(oldData?.[key] ?? null) !==
            JSON.stringify(newData?.[key] ?? null),
    );
};
