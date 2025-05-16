
import React from "react";
import { format } from "date-fns";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const getYears = (start, end) => {
  const years = [];
  for (let y = start; y <= end; y++) years.push(y);
  return years;
};

const CalendarHeader = ({
  currentMonth,
  onPrev,
  onNext,
  onMonthChange,
  onYearChange,
  minYear = 1990,
  maxYear = new Date().getFullYear() + 10
}) => {
  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  return (
    <div className="flex items-center justify-between mb-4">
      <button onClick={onPrev} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">&lt;</button>
      <div className="flex items-center space-x-2">
        <select
          value={month}
          onChange={e => onMonthChange(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {MONTHS.map((m, idx) => (
            <option value={idx} key={m}>{m}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={e => onYearChange(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {getYears(minYear, maxYear).map(y => (
            <option value={y} key={y}>{y}</option>
          ))}
        </select>
      </div>
      <button onClick={onNext} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">&gt;</button>
    </div>
  );
};

export default CalendarHeader;