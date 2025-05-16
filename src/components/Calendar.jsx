
import React, { useState } from "react";
import { addMonths, subMonths, setMonth, setYear } from "date-fns";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import eventsData from "../data/events.json";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleMonthChange = (monthIdx) => {
    setCurrentMonth(prev => setMonth(prev, monthIdx));
  };

  const handleYearChange = (year) => {
    setCurrentMonth(prev => setYear(prev, year));
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <CalendarHeader
        currentMonth={currentMonth}
        onPrev={() => setCurrentMonth(subMonths(currentMonth, 1))}
        onNext={() => setCurrentMonth(addMonths(currentMonth, 1))}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        minYear={1990}
        maxYear={new Date().getFullYear() + 10}
      />
      <CalendarGrid
        currentMonth={currentMonth}
        events={eventsData}
      />
    </div>
  );
};

export default Calendar;