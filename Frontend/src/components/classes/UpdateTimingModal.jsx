import React, { useState } from "react";
import Modal from "../common/Modal";
import { durations } from "../../utils/durations";

export default function UpdateTimingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    periodDuration: "",
    breakTime: "",
    breakDuration: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Class Timing">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-300">Start Time</label>

          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full mt-2 bg-gray-800 text-white border border-gray-700 rounded-xl p-3 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-gray-300">End Time</label>

          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full mt-2 bg-gray-800 text-white border border-gray-700 rounded-xl p-3 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-gray-300">Period Duration</label>

          <select
            name="periodDuration"
            value={formData.periodDuration}
            onChange={handleChange}
            className="w-full mt-2 bg-gray-800 text-white border border-gray-700 rounded-xl p-3 cursor-pointer"
          >
            <option value="">Select Duration</option>

            {durations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-300">Break Time</label>

          <input
            type="time"
            name="breakTime"
            value={formData.breakTime}
            onChange={handleChange}
            className="w-full mt-2 bg-gray-800 text-white border border-gray-700 rounded-xl p-3 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-gray-300">Break Duration</label>

          <select
            name="breakDuration"
            value={formData.breakDuration}
            onChange={handleChange}
            className="w-full mt-2 bg-gray-800 text-white border border-gray-700 rounded-xl p-3 cursor-pointer"
          >
            <option value="">Select Duration</option>

            {durations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-700 text-white rounded-xl cursor-pointer"
        >
          Cancel
        </button>

        <button className="px-4 py-2 bg-purple-600 text-white rounded-xl cursor-pointer">
          Update
        </button>
      </div>
    </Modal>
  );
}
