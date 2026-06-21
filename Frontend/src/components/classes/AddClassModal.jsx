import React, { useState } from "react";
import Modal from "../common/Modal";

export default function AddClassModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(title);

    setTitle("");

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Class">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-gray-300">Class Title</label>

          <input
            type="text"
            placeholder="Enter Class Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-2 bg-gray-800 text-white border border-gray-700 rounded-xl p-3"
          />
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
