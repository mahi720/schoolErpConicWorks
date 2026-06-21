import React, { useState } from "react";

import Modal from "../common/Modal";

export default function MarksConfigurationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    pt: "",
    ma: "",
    sea: "",
    pf: "",
    totalExam: "",
    practicalExam: "",
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Marks Configuration">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-gray-300 mb-2 block text-sm">
            PT Marks <span className="text-red-500"> *</span>
          </label>

          <input
            placeholder="PT Marks"
            className="p-3 bg-gray-800 rounded-xl text-white"
          />
        </div>

        <div>
          <label className="text-gray-300 mb-2 block text-sm">
            MA Marks <span className="text-red-500"> *</span>
          </label>
          <input
            placeholder="MA Marks"
            className="p-3 bg-gray-800 rounded-xl text-white"
          />
        </div>

        <div>
          <label className="text-gray-300 mb-2 block text-sm">
            SEA Marks <span className="text-red-500"> *</span>
          </label>
          <input
            placeholder="SEA Marks"
            className="p-3 bg-gray-800 rounded-xl text-white"
          />
        </div>

        <div>
          <label className="text-gray-300 mb-2 block text-sm">
            PF Marks <span className="text-red-500"> *</span>
          </label>
          <input
            placeholder="PF Marks"
            className="p-3 bg-gray-800 rounded-xl text-white"
          />
        </div>

        <div>
          <label className="text-gray-300 mb-2 block text-sm">
            Total Exam Marks <span className="text-red-500"> *</span>
          </label>
          <input
            placeholder="Total Exam"
            className="p-3 bg-gray-800 rounded-xl text-white"
          />
        </div>

        <div>
          <label className="text-gray-300 mb-2 block text-sm">
            Practical Exam Marks <span className="text-red-500"> *</span>
          </label>
          <input
            placeholder="Practical Exam"
            className="p-3 bg-gray-800 rounded-xl text-white"
          />
        </div>
      </div>

      <button className="mt-5 w-full bg-blue-600 p-3 rounded-xl cursor-pointer text-white">
        Save
      </button>
    </Modal>
  );
}
