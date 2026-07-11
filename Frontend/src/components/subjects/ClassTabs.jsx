import React from "react";

export default function ClassTabs({
  classes,
  selectedClass,
  setSelectedClass,
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {classes.map((item) => (
        <button
          key={item.slug}
          onClick={() => setSelectedClass(item.classTitle)}
          className={`px-4 py-2 rounded-xl cursor-pointer transition-all ${
            selectedClass === item.classTitle
              ? "bg-indigo-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {item.classTitle}
        </button>
      ))}
    </div>
  );
}
