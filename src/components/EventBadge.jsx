import React from "react";

// Only blue and yellow for non-conflicts
const colors = [
  "bg-blue-200 text-blue-800",
  "bg-yellow-200 text-yellow-800"
];

const EventBadge = ({ event }) => {
  const colorClass = event.conflict
    ? "bg-red-200 text-red-800 border border-red-500"
    : colors[event.id % colors.length]; // Alternate blue/yellow

  return (
    <div className={`rounded px-2 py-1 text-xs truncate ${colorClass}`}>
      <span className="font-semibold">{event.title}</span>
      <span className="ml-1 text-gray-600">{event.time}</span>
      {event.conflict && (
        <span className="ml-1 text-xs text-red-600">(conflict)</span>
      )}
    </div>
  );
};

export default EventBadge;
