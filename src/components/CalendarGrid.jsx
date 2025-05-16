import React from "react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, isSameMonth, isSameDay, format
} from "date-fns";
import EventBadge from "./EventBadge";


const getEventsForDay = (events, day) =>
  events.filter(event => isSameDay(event.date, day));

// Checkong for event conflicts
const checkConflicts = events => {
  const sorted = [...events].sort((a, b) => a.time.localeCompare(b.time));
  let result = [];
  for (let i = 0; i < sorted.length; i++) {
    let conflict = false;
    for (let j = 0; j < sorted.length; j++) {
      if (i === j) continue;
      const aStart = parseInt(sorted[i].time.replace(":", ""), 10);
      const aEnd = aStart + (sorted[i].duration / 60) * 100;
      const bStart = parseInt(sorted[j].time.replace(":", ""), 10);
      const bEnd = bStart + (sorted[j].duration / 60) * 100;
      if (!(aEnd <= bStart || aStart >= bEnd)) {
        conflict = true;
        break;
      }
    }
    result.push({ ...sorted[i], conflict });
  }
  return result;
};

const CalendarGrid = ({ currentMonth, events }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const today = new Date();

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, "d");
      const dayEvents = getEventsForDay(events, day);
      const eventsWithConflict = checkConflicts(dayEvents);

      days.push(
        <div
          key={day}
          className={`border h-24 p-1 align-top relative overflow-auto
            ${!isSameMonth(day, monthStart) ? "bg-gray-100 text-gray-400" : ""}
            ${isSameDay(day, today) ? "bg-blue-100 border-blue-400" : ""}
          `}
        >
          <div className="text-xs font-semibold">{formattedDate}</div>
          <div className="space-y-1 mt-1">
            {eventsWithConflict.map(event => (
              <EventBadge key={event.id} event={event} />
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div>
      <div className="grid grid-cols-7 mb-2 text-center text-gray-700 font-bold">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>
      {rows}
    </div>
  );
};

export default CalendarGrid;
