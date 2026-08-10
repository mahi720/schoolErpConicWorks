import React, { useEffect, useMemo, useState } from "react";

import { Loader2, Plus } from "lucide-react";

import EventModal from "../../../components/HRM/EventMoadal/EventModal";

import EventDetailModal from "../../../components/HRM/EventMoadal/EventDetailModal";

import { useEventCalendarStore } from "../../../store/hrm/eventCalendar/eventCalendarStore";

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [open, setOpen] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);

  const [editData, setEditData] = useState(null);

  const {
    events,

    selectedEvent,

    loading,
    modalLoading,
    actionLoadingSlug,

    fetchEvents,
    fetchEventBySlug,
    createEvent,
    updateEvent,
    deleteEvent,
    restoreEvent,

    setSelectedEvent,
    clearSelectedEvent,
  } = useEventCalendarStore();

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const firstDay = new Date(year, month, 1).getDay();

  const totalDays = new Date(year, month + 1, 0).getDate();

  const days = useMemo(
    () => [
      ...Array(firstDay).fill(null),

      ...Array.from(
        {
          length: totalDays,
        },
        (_, index) => index + 1,
      ),
    ],
    [firstDay, totalDays],
  );

  useEffect(() => {
    fetchEvents({
      year,
      month: month + 1,
    });
  }, [year, month, fetchEvents]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  const reloadCurrentMonth = async () => {
    await fetchEvents({
      year,
      month: month + 1,
    });
  };

  const handleOpenCreate = () => {
    setEditData(null);

    setOpen(true);
  };

  const saveEvent = async (payload) => {
    let success = false;

    if (editData?.slug) {
      success = await updateEvent(editData.slug, payload);
    } else {
      success = await createEvent(payload);
    }

    if (!success) {
      return;
    }

    setOpen(false);
    setEditData(null);

    await reloadCurrentMonth();
  };

  const handleEventClick = async (event) => {
    const data = await fetchEventBySlug(event.slug);

    if (!data) {
      return;
    }

    setSelectedEvent(data);

    setDetailOpen(true);
  };

  const handleEdit = () => {
    if (!selectedEvent) {
      return;
    }

    setEditData(selectedEvent);

    setDetailOpen(false);

    setOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedEvent?.slug) {
      return;
    }

    const success = await deleteEvent(selectedEvent.slug);

    if (!success) {
      return;
    }

    setDetailOpen(false);

    clearSelectedEvent();

    await reloadCurrentMonth();
  };

  const handleRestore = async () => {
    if (!selectedEvent?.slug) {
      return;
    }

    const success = await restoreEvent(selectedEvent.slug);

    if (!success) {
      return;
    }

    setDetailOpen(false);

    clearSelectedEvent();

    await reloadCurrentMonth();
  };

  const closeEventModal = () => {
    if (modalLoading) {
      return;
    }

    setOpen(false);
    setEditData(null);
  };

  const closeDetailModal = () => {
    setDetailOpen(false);

    clearSelectedEvent();
  };

  const formatDate = (day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
  };

  const parseDateOnly = (value) => {
    if (!value) {
      return null;
    }

    const [dateYear, dateMonth, dateDay] = String(value)
      .slice(0, 10)
      .split("-")
      .map(Number);

    return new Date(dateYear, dateMonth - 1, dateDay);
  };

  const isEventBetween = (event, day) => {
    const current = parseDateOnly(formatDate(day));

    const start = parseDateOnly(event.startDate);

    const end = parseDateOnly(event.endDate);

    if (!current || !start || !end) {
      return false;
    }

    return current >= start && current <= end;
  };

  const getEventStyle = (event, day) => {
    const current = parseDateOnly(formatDate(day));

    const end = parseDateOnly(event.endDate);

    if (!current || !end) {
      return 100;
    }

    const weekDay = current.getDay();

    const daysLeftInWeek = 6 - weekDay;

    const eventDaysLeft = Math.floor((end - current) / (1000 * 60 * 60 * 24));

    const widthDays = Math.min(daysLeftInWeek, eventDaysLeft) + 1;

    return Math.max(1, widthDays) * 100;
  };

  const isToday = (day) => {
    const todayDate = new Date();

    return (
      day === todayDate.getDate() &&
      month === todayDate.getMonth() &&
      year === todayDate.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg cursor-pointer"
          >
            Prev
          </button>

          <button
            type="button"
            onClick={nextMonth}
            className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg cursor-pointer"
          >
            Next
          </button>
        </div>

        <h1 className="text-2xl md:text-3xl text-white font-bold">
          {monthName.toUpperCase()} {year}
        </h1>

        <button
          type="button"
          onClick={today}
          className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white cursor-pointer"
        >
          Today
        </button>
      </div>

      <div className="relative overflow-auto custom-scrollbar">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-7 bg-gray-900 border border-gray-800">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-3 border border-gray-800 text-center text-gray-300 font-semibold"
              >
                {day}
              </div>
            ))}

            {loading ? (
              <div className="col-span-7 min-h-[500px] flex items-center justify-center gap-3 text-gray-400">
                <Loader2 size={22} className="animate-spin" />
                Loading events...
              </div>
            ) : (
              days.map((day, index) => (
                <div
                  key={`${year}-${month}-${index}`}
                  className={`h-36 border p-2 overflow-visible relative ${
                    day && isToday(day)
                      ? "bg-indigo-500/10 border-indigo-500/30"
                      : "border-gray-800"
                  }`}
                >
                  {day && (
                    <>
                      <p
                        className={`text-right font-semibold ${
                          isToday(day) ? "text-indigo-300" : "text-indigo-400"
                        }`}
                      >
                        {day}
                      </p>

                      {events
                        .filter((event) => isEventBetween(event, day))
                        .map((event) => {
                          const dateString = formatDate(day);

                          const isStart = event.startDate === dateString;

                          const currentDay = parseDateOnly(dateString);

                          const isWeekStart = currentDay?.getDay() === 0;

                          const isEnd = event.endDate === dateString;

                          if (!isStart && !isWeekStart) {
                            return null;
                          }

                          const active = event.isActive !== false;

                          return (
                            <button
                              key={`${event.slug}-${dateString}`}
                              type="button"
                              onClick={() => handleEventClick(event)}
                              className={`
                                    mt-4
                                    ${
                                      active
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-gray-700 hover:bg-gray-600 opacity-70"
                                    }
                                    text-white
                                    h-9
                                    flex
                                    items-center
                                    justify-center
                                    cursor-pointer
                                    relative
                                    z-20
                                    transition
                                    ${isStart || isWeekStart ? "rounded-l-lg" : ""}
                                    ${isEnd ? "rounded-r-lg" : ""}
                                  `}
                              style={{
                                width: `${getEventStyle(event, day)}%`,
                              }}
                              title={
                                active
                                  ? event.title
                                  : `${event.title} - Inactive`
                              }
                            >
                              <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-2 text-sm font-medium">
                                {isStart || isWeekStart ? event.title : ""}
                              </span>
                            </button>
                          );
                        })}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleOpenCreate}
        className="fixed bottom-10 right-10 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white flex justify-center items-center cursor-pointer shadow-xl z-30"
        title="Add Event"
      >
        <Plus size={30} />
      </button>

      <EventModal
        open={open}
        close={closeEventModal}
        save={saveEvent}
        editData={editData}
        loading={modalLoading}
      />

      <EventDetailModal
        open={detailOpen}
        close={closeDetailModal}
        data={selectedEvent}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}
        actionLoading={Boolean(
          selectedEvent?.slug && actionLoadingSlug === selectedEvent.slug,
        )}
      />
    </div>
  );
}
