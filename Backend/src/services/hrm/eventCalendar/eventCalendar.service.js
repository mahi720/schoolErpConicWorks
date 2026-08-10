import {
    randomUUID,
} from "crypto";

import {
    createEventCalendarRepo,
    getEventCalendarsRepo,
    findEventCalendarBySlugRepo,
    updateEventCalendarRepo,
    deleteEventCalendarRepo,
    restoreEventCalendarRepo,
} from "../../../repositories/HRM/eventCalendar/eventCalendar.repository.js";

const parseDate = (
    value,
) => {
    return new Date(
        `${value}T00:00:00.000Z`,
    );
};

const formatDate = (
    value,
) => {
    if (!value) {
        return null;
    }

    return new Date(
        value,
    )
        .toISOString()
        .slice(0, 10);
};

const formatEventResponse =
    (item) => {
        return {
            slug:
                item.slug,

            title:
                item.title,

            description:
                item.description,

            startDate:
                formatDate(
                    item.startDate,
                ),

            endDate:
                formatDate(
                    item.endDate,
                ),

            startTime:
                item.startTime,

            endTime:
                item.endTime,

            status:
                item.status,

            isActive:
                item.isActive,

            deletedAt:
                item.deletedAt,

            createdAt:
                item.createdAt,

            updatedAt:
                item.updatedAt,
        };
    };

export const createEventCalendarService =
    async ({
        schoolSlug,
        payload,
    }) => {
        const event =
            await createEventCalendarRepo({
                slug:
                    randomUUID(),

                schoolSlug,

                title:
                    payload.title.trim(),

                description:
                    payload.description.trim(),

                startDate:
                    parseDate(
                        payload.startDate,
                    ),

                endDate:
                    parseDate(
                        payload.endDate,
                    ),

                startTime:
                    payload.startTime,

                endTime:
                    payload.endTime,

                status:
                    "active",

                isActive:
                    true,

                deletedAt:
                    null,
            });

        return formatEventResponse(
            event,
        );
    };

export const getEventCalendarsService =
    async ({
        schoolSlug,
        year,
        month,
    }) => {
        let monthStart =
            null;

        let monthEnd =
            null;

        if (
            year !==
            undefined &&
            month !==
            undefined
        ) {
            const numericYear =
                Number(year);

            const numericMonth =
                Number(month);

            if (
                !Number.isInteger(
                    numericYear,
                ) ||
                !Number.isInteger(
                    numericMonth,
                ) ||
                numericMonth <
                1 ||
                numericMonth >
                12
            ) {
                throw new Error(
                    "Invalid year or month",
                );
            }

            monthStart =
                new Date(
                    Date.UTC(
                        numericYear,
                        numericMonth -
                        1,
                        1,
                    ),
                );

            monthEnd =
                new Date(
                    Date.UTC(
                        numericYear,
                        numericMonth,
                        0,
                        23,
                        59,
                        59,
                        999,
                    ),
                );
        }

        const events =
            await getEventCalendarsRepo({
                schoolSlug,

                monthStart,

                monthEnd,

                includeInactive:
                    true,
            });

        return events.map(
            formatEventResponse,
        );
    };

export const getEventCalendarBySlugService =
    async ({
        schoolSlug,
        slug,
    }) => {
        const event =
            await findEventCalendarBySlugRepo({
                schoolSlug,
                slug,
            });

        if (!event) {
            throw new Error(
                "Event not found",
            );
        }

        return formatEventResponse(
            event,
        );
    };

export const updateEventCalendarService =
    async ({
        schoolSlug,
        slug,
        payload,
    }) => {
        const existing =
            await findEventCalendarBySlugRepo({
                schoolSlug,
                slug,
            });

        if (!existing) {
            throw new Error(
                "Event not found",
            );
        }

        if (
            !existing.isActive
        ) {
            throw new Error(
                "Inactive event cannot be edited",
            );
        }

        const finalStartDate =
            payload.startDate
                ? parseDate(
                    payload.startDate,
                )
                : existing.startDate;

        const finalEndDate =
            payload.endDate
                ? parseDate(
                    payload.endDate,
                )
                : existing.endDate;

        const finalStartTime =
            payload.startTime ??
            existing.startTime;

        const finalEndTime =
            payload.endTime ??
            existing.endTime;

        if (
            finalEndDate <
            finalStartDate
        ) {
            throw new Error(
                "End date cannot be before start date",
            );
        }

        if (
            formatDate(
                finalStartDate,
            ) ===
            formatDate(
                finalEndDate,
            ) &&
            finalEndTime <=
            finalStartTime
        ) {
            throw new Error(
                "End time must be greater than start time",
            );
        }

        const event =
            await updateEventCalendarRepo({
                slug,

                data: {
                    ...(payload.title !==
                        undefined
                        ? {
                            title:
                                payload.title.trim(),
                        }
                        : {}),

                    ...(payload.description !==
                        undefined
                        ? {
                            description:
                                payload.description.trim(),
                        }
                        : {}),

                    ...(payload.startDate
                        ? {
                            startDate:
                                finalStartDate,
                        }
                        : {}),

                    ...(payload.endDate
                        ? {
                            endDate:
                                finalEndDate,
                        }
                        : {}),

                    ...(payload.startTime !==
                        undefined
                        ? {
                            startTime:
                                finalStartTime,
                        }
                        : {}),

                    ...(payload.endTime !==
                        undefined
                        ? {
                            endTime:
                                finalEndTime,
                        }
                        : {}),
                },
            });

        return formatEventResponse(
            event,
        );
    };

export const deleteEventCalendarService =
    async ({
        schoolSlug,
        slug,
    }) => {
        const existing =
            await findEventCalendarBySlugRepo({
                schoolSlug,
                slug,
            });

        if (!existing) {
            throw new Error(
                "Event not found",
            );
        }

        if (
            !existing.isActive
        ) {
            throw new Error(
                "Event is already inactive",
            );
        }

        const event =
            await deleteEventCalendarRepo({
                slug,
            });

        return formatEventResponse(
            event,
        );
    };

export const restoreEventCalendarService =
    async ({
        schoolSlug,
        slug,
    }) => {
        const existing =
            await findEventCalendarBySlugRepo({
                schoolSlug,
                slug,
            });

        if (!existing) {
            throw new Error(
                "Event not found",
            );
        }

        if (
            existing.isActive
        ) {
            throw new Error(
                "Event is already active",
            );
        }

        const event =
            await restoreEventCalendarRepo({
                slug,
            });

        return formatEventResponse(
            event,
        );
    };