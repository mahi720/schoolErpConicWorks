import React from "react";
import { useApp } from "../../context/AppContext";

export default function BoardTabs({ boards }) {
  const { selectedBoard, setSelectedBoard } = useApp();

  return (
    <div className="flex gap-2 flex-wrap">
      {boards.map((board) => (
        <button
          key={board}
          onClick={() => setSelectedBoard(board)}
          className={`px-4 py-2 rounded-xl cursor-pointer

${
  selectedBoard === board
    ? "bg-blue-600 text-white"
    : "bg-gray-800 text-gray-300"
}
`}
        >
          {board}
        </button>
      ))}
    </div>
  );
}
