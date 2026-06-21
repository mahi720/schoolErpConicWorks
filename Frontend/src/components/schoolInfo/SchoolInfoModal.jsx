import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";

export default function SchoolInfoModal({
  isOpen,
  onClose,
  schoolData,
  setSchoolData,
}) {
  const [formData, setFormData] = useState(schoolData);

  useEffect(() => {
    setFormData(schoolData);
  }, [schoolData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setSchoolData(formData);

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit School Information"
      width="max-w-4xl"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-2">
            School Name <span className="text-red-500"> *</span>
          </label>
          <input
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
            placeholder="School Name"
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">
            Contact Number <span className="text-red-500"> *</span>
          </label>
          <input
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact Number"
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">
            Email <span className="text-red-500"> *</span>
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">
            Contact Person <span className="text-red-500"> *</span>
          </label>
          <input
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            placeholder="Contact Person"
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">
            Address <span className="text-red-500"> *</span>
          </label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">
            Affiliation Number <span className="text-red-500"> *</span>
          </label>
          <input
            name="affiliation"
            value={formData.affiliation}
            onChange={handleChange}
            placeholder="Affiliation Number"
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">
            School ID <span className="text-red-500"> *</span>
          </label>
          <input
            name="schoolId"
            value={formData.schoolId}
            onChange={handleChange}
            placeholder="School ID"
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Lecture Count</label>
          <input
            name="lectureCount"
            value={formData.lectureCount}
            onChange={handleChange}
            placeholder="Lecture Count"
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Teaching Saturday</label>
          <input
            name="teachingSaturday"
            value={formData.teachingSaturday}
            onChange={handleChange}
            placeholder="Teaching Saturday"
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Classrooms</label>
          <input
            name="classrooms"
            value={formData.classrooms}
            onChange={handleChange}
            placeholder="Classrooms"
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="border border-gray-700 px-4 py-2 cursor-pointer rounded-xl text-white"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="bg-blue-600 px-4 py-2 cursor-pointer rounded-xl text-white"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
