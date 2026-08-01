export const buildTermExamScopeKey = ({
    sectionSlug = null,
    streamSlug = null,
}) => {
    const parts = [];

    if (sectionSlug) {
        parts.push(
            `SECTION:${sectionSlug}`,
        );
    }

    if (streamSlug) {
        parts.push(
            `STREAM:${streamSlug}`,
        );
    }

    return parts.length
        ? parts.join("|")
        : "CLASS";
};

export const getTermExamRequestMetadata =
    (req) => {
        const forwardedFor =
            req.headers[
            "x-forwarded-for"
            ];

        const forwardedIp =
            Array.isArray(
                forwardedFor,
            )
                ? forwardedFor[0]
                : forwardedFor
                    ?.split(",")[0]
                    ?.trim();

        return {
            requestMethod:
                req.method || null,

            requestUrl:
                req.originalUrl ||
                req.url ||
                null,

            ipAddress:
                forwardedIp ||
                req.ip ||
                req.socket
                    ?.remoteAddress ||
                null,

            userAgent:
                req.headers[
                "user-agent"
                ] || null,
        };
    };

export const getTermExamAuditActorSnapshot =
    (user) => {
        return {
            actorSlug:
                user?.slug || null,

            actorName:
                user?.name || null,

            actorEmail:
                user?.email || null,

            actorRole:
                user?.role || null,
        };
    };

export const buildTermExamChangedFields =
    ({
        oldData = null,
        newData = null,
    }) => {
        const keys = new Set([
            ...Object.keys(
                oldData || {},
            ),

            ...Object.keys(
                newData || {},
            ),
        ]);

        const changedFields = [];

        for (const key of keys) {
            const previousValue =
                oldData?.[key] ?? null;

            const newValue =
                newData?.[key] ?? null;

            if (
                JSON.stringify(
                    previousValue,
                ) !==
                JSON.stringify(
                    newValue,
                )
            ) {
                changedFields.push(
                    key,
                );
            }
        }

        return changedFields;
    };