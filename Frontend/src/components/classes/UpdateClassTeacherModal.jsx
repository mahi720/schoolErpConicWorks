import React, { useState } from "react";
import Modal from "../common/Modal";

export default function UpdateClassTeacherModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(title);

    setTitle("");

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Class Teacher">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* <div>
          <label className="block text-gray-300 text-sm mb-2">
            Select Academic Year <span className="text-red-500"> *</span>
          </label>

          <select
            className="w-full p-3 rounded-xl bg-gray-800 cursor-pointer text-white"
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value,
              })
            }
          >
            <option>Select Academic Year</option>
            <option>2024-25</option>
            <option>2025-26</option>
            <option>2026-27</option>
          </select>
        </div> */}

        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Select Class <span className="text-red-500"> *</span>
          </label>

          <select
            className="w-full p-3 rounded-xl bg-gray-800 cursor-pointer text-white"
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value,
              })
            }
          >
            <option>Select Class</option>
            <option>Class 1</option>
            <option>Class 2</option>
            <option>Class 3</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Select Section <span className="text-red-500"> *</span>
          </label>

          <select
            className="w-full p-3 rounded-xl bg-gray-800 cursor-pointer text-white"
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value,
              })
            }
          >
            <option>Select Section</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
            <option>E</option>
            <option>F</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Select Class Teacher <span className="text-red-500"> *</span>
          </label>

          <select
            className="w-full p-3 rounded-xl bg-gray-800 cursor-pointer text-white"
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value,
              })
            }
          >
            <option>Select Class Teacher</option>
            <option>Rahu Sahu</option>

            <option>Priya Dewangan</option>

            <option>Mohit Raj</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-700 text-white rounded-xl cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
