import React from "react";

export default function BoardTabs({ boards, activeBoard, setActiveBoard }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {boards.map((board) => (
        <button
          key={board.slug}
          onClick={() => setActiveBoard(board.title)}
          className={`px-4 py-2 rounded-xl cursor-pointer transition-all ${
            activeBoard === board.title
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {board.title}
        </button>
      ))}
    </div>
  );
}
