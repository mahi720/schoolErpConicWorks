import React, { useState } from "react";
import { X } from "lucide-react";

export default function CreateAcademicEventModal({
  isOpen,
  onClose,
  onCreate,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    startDate: "",
    tillDate: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onCreate(formData);

    setFormData({
      title: "",
      description: "",
      category: "",
      startDate: "",
      tillDate: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gray-900 w-full max-w-2xl rounded-2xl border border-gray-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}

        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-3xl font-semibold text-white">
            Create New Academic Event
          </h2>

          <button onClick={onClose}>
            <X size={24} className="text-gray-400 cursor-pointer" />
          </button>
        </div>

        {/* Body */}

        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* title */}

          <div>
            <label className="block mb-2 text-gray-300">
              Title of event
              <span className="text-red-500"> *</span>
            </label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event title"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
          </div>

          {/* description */}

          <div>
            <label className="block mb-2 text-gray-300">
              Event description
              <span className="text-red-500"> *</span>
            </label>

            <textarea
              rows="3"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Event description"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white resize-none"
            />
          </div>

          {/* category */}

          <div>
            <label className="block mb-2 text-gray-300">
              Event category
              <span className="text-red-500"> *</span>
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 cursor-pointer text-white"
            >
              <option value="">Select Event Category</option>

              <option>Holiday</option>

              <option>Theory Exam</option>

              <option>Other</option>
            </select>
          </div>

          {/* Dates */}

          <div>
            <label className="block mb-2 text-gray-300">
              Start From
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">
              Till Date
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="date"
              name="tillDate"
              value={formData.tillDate}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
          <button
            onClick={handleSubmit}
            className="px-5 py-3 bg-emerald-500 rounded-xl text-white cursor-pointer"
          >
            Create
          </button>

          <button
            onClick={onClose}
            className="px-5 py-3 bg-red-500 rounded-xl text-white cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
