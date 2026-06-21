import React, { useState } from "react";
import { Plus } from "lucide-react";
import EventModal from "../../../components/HRM/EventMoadal/EventModal";
import EventDetailModal from "../../../components/HRM/EventMoadal/EventDetailModal";

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [events, setEvents] = useState([
    {
      title: "hey",
      description: "hello",
      startDate: "2026-06-12",
      endDate: "2026-06-17",
      startTime: "09:00 AM",
      endTime: "18:30 PM",
    },
  ]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const firstDay = new Date(year, month, 1).getDay();

  const totalDays = new Date(year, month + 1, 0).getDate();

  const days = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  const saveEvent = (data) => {
    setEvents([...events, data]);
    setOpen(false);
  };

  const formatDate = (day) => {
    return `${year}-${String(month + 1).padStart(
      2,
      "0",
    )}-${String(day).padStart(2, "0")}`;
  };

  const isEventBetween = (event, day) => {
    const current = new Date(formatDate(day));
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    return current >= start && current <= end;
  };

  const getEventStyle = (event, day) => {
    const current = new Date(formatDate(day));
    const end = new Date(event.endDate);

    const weekDay = current.getDay();

    // current week me kitne din bache
    const daysLeftInWeek = 6 - weekDay;

    const eventDaysLeft = (end - current) / (1000 * 60 * 60 * 24);

    const widthDays = Math.min(daysLeftInWeek, eventDaysLeft) + 1;

    return widthDays * 100;
  };

  const isToday = (day) => {
    const today = new Date();

    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="space-y-6 relative">
      {/* header */}

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg cursor-pointer"
          >
            Prev
          </button>

          <button
            onClick={nextMonth}
            className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg cursor-pointer"
          >
            Next
          </button>
        </div>

        <h1 className="text-3xl text-white font-bold">
          {monthName.toUpperCase()} {year}
        </h1>

        <button
          onClick={today}
          className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white cursor-pointer"
        >
          Today
        </button>
      </div>

      {/* Calendar */}

      <div className="grid grid-cols-7 bg-gray-900 border border-gray-800">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-3 border border-gray-800 text-center text-gray-300"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => (
          <div
            key={index}
            className={`h-36 border p-2 overflow-visible ${day && isToday(day) ? "bg-indigo-500/10" : "border-gray-800"}`}
          >
            {day && (
              <>
                <p className="text-indigo-400 text-right">{day}</p>

                {events
                  .filter((e) => isEventBetween(e, day))
                  .map((event, i) => {
                    const isStart = event.startDate === formatDate(day);

                    const isWeekStart =
                      new Date(formatDate(day)).getDay() === 0;

                    const isEnd = event.endDate === formatDate(day);

                    if (!isStart && !isWeekStart) {
                      return null;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedEvent(event);
                          setDetailOpen(true);
                        }}
                        className={`
                                mt-4
                                bg-blue-600
                                text-white
                                h-9
                                flex
                                items-center
                                justify-center
                                cursor-pointer
                                relative
                                z-20

                                ${isStart || isWeekStart ? "rounded-l-lg" : ""}
                                ${isEnd ? "rounded-r-lg" : ""}
                                `}
                        style={{
                          width: `${getEventStyle(event, day)}%`,
                        }}
                      >
                        <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
                          {isStart ? event.title : ""}
                        </span>
                      </button>
                    );
                  })}
              </>
            )}
          </div>
        ))}
      </div>

      {/* plus button */}

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white flex justify-center items-center cursor-pointer shadow-xl"
      >
        <Plus size={30} />
      </button>

      <EventModal open={open} close={() => setOpen(false)} save={saveEvent} />

      <EventDetailModal
        open={detailOpen}
        close={() => setDetailOpen(false)}
        data={selectedEvent}
      />
    </div>
  );
}
