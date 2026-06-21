import React, { useState } from "react";
import Modal from "../common/Modal";
import { useApp } from "../../context/AppContext";

export default function AddSubjectModal({ isOpen, onClose }) {
  const { subjects, setSubjects } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    order: "",
  });

  const handleSubmit = () => {
    setSubjects([
      ...subjects,

      {
        id: Date.now(),
        name: formData.name,
        type: formData.type,
        order: formData.order,
        status: "Active",
      },
    ]);

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Subject">
      <div className="space-y-4">
        {/* Subject Title */}

        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Subject Title <span className="text-red-500"> *</span>
          </label>

          <input
            placeholder="Subject Title"
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />
        </div>

        {/* Subject Type */}

        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Subject Type <span className="text-red-500"> *</span>
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
            <option>Select Type</option>

            <option>Scholastic</option>

            <option>Co-Scholastic</option>

            <option>Personality Traits</option>

            <option>Selective</option>
          </select>
        </div>

        {/* Subject Order */}

        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Subject Order <span className="text-red-500"> *</span>
          </label>

          <input
            type="number"
            placeholder="Subject Order"
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
            onChange={(e) =>
              setFormData({
                ...formData,
                order: e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-blue-600 text-white cursor-pointer"
        >
          Save Subject
        </button>
      </div>
    </Modal>
  );
}
