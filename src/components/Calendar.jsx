import React, { useEffect, useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import defaultEvents from "../data/events.json";
import { addMonths, subMonths, setMonth, setYear } from "date-fns";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [conflictDates, setConflictDates] = useState([]);

  const [formInput, setFormInput] = useState({
    title: "",
    date: "",
    time: "",
    duration: ""
  });

  // Load initial events from file
  useEffect(() => {
    setEvents(defaultEvents);
  }, []);

  // Re-check conflicts whenever events update
  useEffect(() => {
    findConflicts();
  }, [events]);

  // Update form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  // Add new event
  const addEvent = () => {
    const { title, date, time, duration } = formInput;

    if (!title || !date || !time || !duration) {
      alert("Please fill in all fields.");
      return;
    }

    const now = new Date();
    const eventDateTime = new Date(`${date}T${time}`);

    if (eventDateTime < now) {
      alert("You cannot add an event in the past.");
      return;
    }

    const newEvent = {
      id: Date.now(),
      title,
      date,
      time,
      duration: parseInt(duration)
    };

    setEvents((prev) => [...prev, newEvent]);
    setFormInput({ title: "", date: "", time: "", duration: "" });
  };

  // Find conflict dates
  const findConflicts = () => {
    const conflicts = [];
    const grouped = {};

    for (let event of events) {
      if (!grouped[event.date]) grouped[event.date] = [];
      grouped[event.date].push(event);
    }

    for (let date in grouped) {
      if (checkForConflict(grouped[date])) {
        conflicts.push(date);
      }
    }

    setConflictDates(conflicts);
  };

  // Check for overlapping events in a single day
  const checkForConflict = (list) => {
    const sorted = [...list].sort((a, b) => a.time.localeCompare(b.time));
    for (let i = 0; i < sorted.length - 1; i++) {
      const aStart = parseInt(sorted[i].time.replace(":", ""));
      const aEnd = aStart + (sorted[i].duration / 60) * 100;

      const bStart = parseInt(sorted[i + 1].time.replace(":", ""));
      if (bStart < aEnd) return true;
    }
    return false;
  };

  // Show only conflicts for the visible month
  const visibleConflicts = conflictDates.filter((d) => {
    const date = new Date(d);
    return (
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  });

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      {/* Header */}
      <CalendarHeader
        currentMonth={currentMonth}
        onPrev={() => setCurrentMonth((prev) => subMonths(prev, 1))}
        onNext={() => setCurrentMonth((prev) => addMonths(prev, 1))}
        onMonthChange={(month) => setCurrentMonth((prev) => setMonth(prev, month))}
        onYearChange={(year) => setCurrentMonth((prev) => setYear(prev, year))}
        minYear={1990}
        maxYear={new Date().getFullYear() + 10}
      />

      {/* Conflict warning */}
      {visibleConflicts.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-800 rounded">
          <strong>⚠️ Conflicts in {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric"
          })}:</strong>
          <ul className="list-disc ml-6 mt-1">
            {visibleConflicts.map((date) => (
              <li key={date}>{date}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Add event form */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Add New Event</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formInput.title}
            onChange={handleInputChange}
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            name="date"
            value={formInput.date}
            onChange={handleInputChange}
            className="border rounded px-2 py-1"
          />
          <input
            type="time"
            name="time"
            value={formInput.time}
            onChange={handleInputChange}
            className="border rounded px-2 py-1"
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration (mins)"
            value={formInput.duration}
            onChange={handleInputChange}
            className="border rounded px-2 py-1"
          />
        </div>
        <button
          onClick={addEvent}
          className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Event
        </button>
      </div>

      {/* Calendar grid */}
      <CalendarGrid currentMonth={currentMonth} events={events} />
    </div>
  );
};

export default Calendar;
