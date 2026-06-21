import React, { useState } from "react";
import Modal from "../common/Modal";

export default function MapStreamModal({ isOpen, onClose }) {
  const streams = ["Science", "Commerce", "Arts", "Mathematics"];

  const [selectedStreams, setSelectedStreams] = useState([]);

  const handleSelect = (stream) => {
    if (selectedStreams.includes(stream)) {
      setSelectedStreams(selectedStreams.filter((item) => item !== stream));
    } else {
      setSelectedStreams([...selectedStreams, stream]);
    }
  };

  const handleSave = () => {
    console.log("Mapped Streams:", selectedStreams);

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Map Streams"
      width="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar border border-gray-800 rounded-xl">
          {streams.map((stream, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border-b border-gray-800"
            >
              <input
                type="checkbox"
                checked={selectedStreams.includes(stream)}
                onChange={() => handleSelect(stream)}
                className="w-5 h-5 cursor-pointer"
              />

              <span className="text-white">{stream}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-700 rounded-xl text-white cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 rounded-xl text-white cursor-pointer"
          >
            Save Mapping
          </button>
        </div>
      </div>
    </Modal>
  );
}
