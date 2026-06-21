import React, { useState } from "react";
import Modal from "../../../common/Modal";

export default function ParentInfoModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fatherName: "",
    motherName: "",
    phone: "",
    email: "",
    parentFromHal: "",
    motherMobile: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Parent Information"
      width="max-w-4xl"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-2">Father's Name</label>

          <input
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Mother's Name</label>

          <input
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Phone</label>

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Email</label>

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Parent From HAL</label>

          <input
            name="parentFromHal"
            value={formData.parentFromHal}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Mother Mobile</label>

          <input
            name="motherMobile"
            value={formData.motherMobile}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button className="px-5 py-2 bg-blue-600 rounded-xl text-white">
          Save
        </button>
      </div>
    </Modal>
  );
}
