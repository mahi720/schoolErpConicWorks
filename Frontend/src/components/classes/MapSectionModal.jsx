import React, { useState } from "react";
import Modal from "../common/Modal";

export default function MapSectionModal({ isOpen, onClose }) {
  const sections = ["A", "B", "C", "D", "E"];

  const [selectedSections, setSelectedSections] = useState([]);

  const handleSelect = (section) => {
    if (selectedSections.includes(section)) {
      setSelectedSections(selectedSections.filter((item) => item !== section));
    } else {
      setSelectedSections([...selectedSections, section]);
    }
  };

  const handleSave = () => {
    console.log("Mapped Sections:", selectedSections);

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Map Sections"
      width="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar border border-gray-800 rounded-xl">
          {sections.map((section, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border-b border-gray-800"
            >
              <input
                type="checkbox"
                checked={selectedSections.includes(section)}
                onChange={() => handleSelect(section)}
                className="w-5 h-5 cursor-pointer"
              />

              <span className="text-white">{section}</span>
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
            className="px-4 py-2 bg-purple-600 rounded-xl text-white cursor-pointer"
          >
            Save Mapping
          </button>
        </div>
      </div>
    </Modal>
  );
}
