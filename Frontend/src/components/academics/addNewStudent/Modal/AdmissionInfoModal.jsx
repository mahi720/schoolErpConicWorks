import React from "react";
import Modal from "../../../common/Modal";

export default function AdmissionInfoModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Admission Information"
      width="max-w-4xl"
    >
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="Admission No"
          className="p-3 rounded-xl bg-gray-800 text-white"
        />

        <input type="date" className="p-3 rounded-xl bg-gray-800 text-white" />

        <input
          placeholder="Academic Year"
          className="p-3 rounded-xl bg-gray-800 text-white"
        />

        <input
          placeholder="Board"
          className="p-3 rounded-xl bg-gray-800 text-white"
        />

        <input
          placeholder="Class"
          className="p-3 rounded-xl bg-gray-800 text-white"
        />
      </div>

      <div className="flex justify-end mt-6">
        <button className="px-5 py-2 bg-blue-600 rounded-xl text-white">
          Save
        </button>
      </div>
    </Modal>
  );
}
