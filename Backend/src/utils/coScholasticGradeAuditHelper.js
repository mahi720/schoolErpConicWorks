export const buildCoScholasticScopeKey = ({ sectionSlug = null, streamSlug = null }) => {
    const parts = [];

    if (sectionSlug) parts.push(`SECTION:${sectionSlug}`);
    if (streamSlug) parts.push(`STREAM:${streamSlug}`);

    return parts.length ? parts.join("|") : "CLASS";
};

export const getCoScholasticRequestMetadata = (req) => {
    const forwardedHeader = req.headers["x-forwarded-for"];
    const forwardedFor = Array.isArray(forwardedHeader) ? forwardedHeader.join(",") : forwardedHeader || null;

    return {
        ipAddress: (Array.isArray(forwardedHeader) ? forwardedHeader[0] : forwardedHeader?.split(",")[0]?.trim()) || req.ip || req.socket?.remoteAddress || null,
        forwardedFor,
        userAgent: req.headers["user-agent"] || null,
        requestMethod: req.method || null,
        requestUrl: req.originalUrl || req.url || null,
        requestId: req.headers["x-request-id"] || req.headers["request-id"] || null,
        deviceIdentifier: req.headers["x-device-id"] || req.headers["device-id"] || null,
    };
};

export const getCoScholasticAuditActor = (user) => ({
    performedBySlug: user?.slug || null,
    actorName: user?.name || null,
    actorEmail: user?.email || null,
    actorRole: user?.role || null,
});

export const buildCoScholasticChangedFields = ({ oldData = null, newData = null }) => {
    const keys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);

    return [...keys].filter((key) => JSON.stringify(oldData?.[key] ?? null) !== JSON.stringify(newData?.[key] ?? null));
};
