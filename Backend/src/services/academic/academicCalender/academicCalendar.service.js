import { randomUUID } from "crypto";

import {
    findSessionByNameRepo,
    findDuplicateAcademicCalendarRepo,
    createAcademicCalendarRepo,
    getAcademicCalendarsRepo,
    getAcademicCalendarBySlugRepo,
    updateAcademicCalendarRepo,
    deleteAcademicCalendarRepo,
    restoreAcademicCalendarRepo,
} from "../../../repositories/academic/academicCalendar/academicCalendar.repository.js";

/*
|--------------------------------------------------------------------------
| Format response
|--------------------------------------------------------------------------
*/

const formatAcademicCalendar = (
    calendar,
) => {
    if (!calendar) {
        return null;
    }

    return {
        id: calendar.id,
        slug: calendar.slug,

        schoolSlug:
            calendar.schoolSlug,

        sessionSlug:
            calendar.sessionSlug,

        session:
            calendar.session?.name || null,

        title: calendar.title,

        description:
            calendar.description,

        category:
            calendar.category,

        startDate:
            calendar.startDate,

        endDate:
            calendar.endDate,

        isHoliday:
            calendar.isHoliday,

        color:
            calendar.color,

        status:
            calendar.status,

        isActive:
            calendar.isActive,

        deletedAt:
            calendar.deletedAt,

        createdAt:
            calendar.createdAt,

        updatedAt:
            calendar.updatedAt,
    };
};

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export const createAcademicCalendarService =
    async (
        schoolSlug,
        payload,
    ) => {
        if (!schoolSlug) {
            throw new Error(
                "School information not found",
            );
        }

        const session =
            await findSessionByNameRepo(
                schoolSlug,
                payload.session,
            );

        if (!session) {
            throw new Error(
                "Selected session not found",
            );
        }

        const startDate = new Date(
            payload.startDate,
        );

        const endDate = new Date(
            payload.endDate,
        );

        if (endDate < startDate) {
            throw new Error(
                "End date must be greater than or equal to start date",
            );
        }

        const duplicate =
            await findDuplicateAcademicCalendarRepo({
                schoolSlug,
                sessionSlug: session.slug,
                title: payload.title,
                startDate,
            });

        if (duplicate) {
            throw new Error(
                "Academic calendar already exists with same title and start date",
            );
        }

        const createdCalendar =
            await createAcademicCalendarRepo({
                slug: randomUUID(),

                schoolSlug,

                sessionSlug:
                    session.slug,

                title:
                    payload.title,

                description:
                    payload.description || null,

                category:
                    payload.category,

                startDate,

                endDate,

                isHoliday:
                    payload.isHoliday ??
                    payload.category === "HOLIDAY",

                color:
                    payload.color || null,

                status:
                    payload.status || "active",

                isActive:
                    payload.status !== "inactive",

                deletedAt:
                    payload.status === "inactive"
                        ? new Date()
                        : null,
            });

        return formatAcademicCalendar(
            createdCalendar,
        );
    };

/*
|--------------------------------------------------------------------------
| Get all
|--------------------------------------------------------------------------
*/

export const getAcademicCalendarsService =
    async (
        schoolSlug,
        query,
    ) => {
        if (!schoolSlug) {
            throw new Error(
                "School information not found",
            );
        }

        let sessionSlug;

        if (query.session) {
            const session =
                await findSessionByNameRepo(
                    schoolSlug,
                    query.session,
                );

            if (!session) {
                return [];
            }

            sessionSlug = session.slug;
        }

        const calendars =
            await getAcademicCalendarsRepo({
                schoolSlug,
                sessionSlug,

                category:
                    query.category,

                status:
                    query.status || "active",

                startDate:
                    query.startDate,

                endDate:
                    query.endDate,
            });

        return calendars.map(
            formatAcademicCalendar,
        );
    };

/*
|--------------------------------------------------------------------------
| Get by slug
|--------------------------------------------------------------------------
*/

export const getAcademicCalendarBySlugService =
    async (
        slug,
        schoolSlug,
    ) => {
        if (!schoolSlug) {
            throw new Error(
                "School information not found",
            );
        }

        const calendar =
            await getAcademicCalendarBySlugRepo(
                slug,
                schoolSlug,
            );

        if (!calendar) {
            throw new Error(
                "Academic calendar not found",
            );
        }

        return formatAcademicCalendar(
            calendar,
        );
    };

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export const updateAcademicCalendarService =
    async (
        slug,
        schoolSlug,
        payload,
    ) => {
        if (!schoolSlug) {
            throw new Error(
                "School information not found",
            );
        }

        const existingCalendar =
            await getAcademicCalendarBySlugRepo(
                slug,
                schoolSlug,
            );

        if (!existingCalendar) {
            throw new Error(
                "Academic calendar not found",
            );
        }

        let sessionSlug =
            existingCalendar.sessionSlug;

        if (payload.session) {
            const session =
                await findSessionByNameRepo(
                    schoolSlug,
                    payload.session,
                );

            if (!session) {
                throw new Error(
                    "Selected session not found",
                );
            }

            sessionSlug = session.slug;
        }

        const startDate =
            payload.startDate
                ? new Date(payload.startDate)
                : existingCalendar.startDate;

        const endDate =
            payload.endDate
                ? new Date(payload.endDate)
                : existingCalendar.endDate;

        if (endDate < startDate) {
            throw new Error(
                "End date must be greater than or equal to start date",
            );
        }

        const title =
            payload.title ??
            existingCalendar.title;

        const duplicate =
            await findDuplicateAcademicCalendarRepo({
                schoolSlug,
                sessionSlug,
                title,
                startDate,
                excludeSlug: slug,
            });

        if (duplicate) {
            throw new Error(
                "Academic calendar already exists with same title and start date",
            );
        }

        const updateData = {
            sessionSlug,
            title,
            startDate,
            endDate,
        };

        if (
            payload.description !== undefined
        ) {
            updateData.description =
                payload.description || null;
        }

        if (
            payload.category !== undefined
        ) {
            updateData.category =
                payload.category;
        }

        if (
            payload.isHoliday !== undefined
        ) {
            updateData.isHoliday =
                payload.isHoliday;
        }

        if (
            payload.color !== undefined
        ) {
            updateData.color =
                payload.color || null;
        }

        if (
            payload.status !== undefined
        ) {
            updateData.status =
                payload.status;

            updateData.isActive =
                payload.status === "active";

            updateData.deletedAt =
                payload.status === "inactive"
                    ? new Date()
                    : null;
        }

        const updatedCalendar =
            await updateAcademicCalendarRepo(
                slug,
                schoolSlug,
                updateData,
            );

        return formatAcademicCalendar(
            updatedCalendar,
        );
    };

/*
|--------------------------------------------------------------------------
| Soft delete
|--------------------------------------------------------------------------
*/

export const deleteAcademicCalendarService =
    async (
        slug,
        schoolSlug,
    ) => {
        if (!schoolSlug) {
            throw new Error(
                "School information not found",
            );
        }

        const calendar =
            await getAcademicCalendarBySlugRepo(
                slug,
                schoolSlug,
            );

        if (!calendar) {
            throw new Error(
                "Academic calendar not found",
            );
        }

        if (!calendar.isActive) {
            throw new Error(
                "Academic calendar is already inactive",
            );
        }

        const deletedCalendar =
            await deleteAcademicCalendarRepo(
                slug,
                schoolSlug,
            );

        return formatAcademicCalendar(
            deletedCalendar,
        );
    };

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreAcademicCalendarService =
    async (
        slug,
        schoolSlug,
    ) => {
        if (!schoolSlug) {
            throw new Error(
                "School information not found",
            );
        }

        const calendar =
            await getAcademicCalendarBySlugRepo(
                slug,
                schoolSlug,
            );

        if (!calendar) {
            throw new Error(
                "Academic calendar not found",
            );
        }

        if (calendar.isActive) {
            throw new Error(
                "Academic calendar is already active",
            );
        }

        const restoredCalendar =
            await restoreAcademicCalendarRepo(
                slug,
                schoolSlug,
            );

        return formatAcademicCalendar(
            restoredCalendar,
        );
    };