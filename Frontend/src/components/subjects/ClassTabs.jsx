import React from "react";
import { useApp } from "../../context/AppContext";

export default function ClassTabs({ classes }) {
  const { selectedClass, setSelectedClass } = useApp();

  return (
    <div className="flex gap-2 flex-wrap">
      {classes.map((item) => (
        <button
          key={item}
          onClick={() => setSelectedClass(item)}
          className={`px-4 py-2 rounded-xl cursor-pointer

${
  selectedClass === item
    ? "bg-indigo-600 text-white"
    : "bg-gray-800 text-gray-300"
}
`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
