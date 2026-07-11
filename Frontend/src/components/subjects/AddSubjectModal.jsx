import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { Loader2 } from "lucide-react";
import { useSubjectStore } from "../../store/master/subject/subjectStore";

const defaultValues = {
  subjectTitle: "",
  subjectType: "",
  subjectOrder: "",
};

export default function AddSubjectModal({
  isOpen,
  onClose,
  editSubject,
  board,
}) {
  const { createSubject, updateSubject, submitLoading } = useSubjectStore();

  const [formData, setFormData] = useState(defaultValues);

  useEffect(() => {
    if (!isOpen) return;

    if (editSubject) {
      setFormData({
        subjectTitle: editSubject.subjectTitle || "",
        subjectType: editSubject.subjectType || "",
        subjectOrder: editSubject.subjectOrder || "",
      });
    } else {
      setFormData(defaultValues);
    }
  }, [isOpen, editSubject]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      board,
      subjectTitle: formData.subjectTitle,
      subjectType: formData.subjectType,
      subjectOrder: Number(formData.subjectOrder),
    };

    const success = editSubject
      ? await updateSubject(editSubject.slug, payload)
      : await createSubject(payload);

    if (success) {
      setFormData(defaultValues);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editSubject ? "Edit Subject" : "Add Subject"}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Subject Title <span className="text-red-500">*</span>
          </label>

          <input
            name="subjectTitle"
            placeholder="Subject Title"
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
            value={formData.subjectTitle}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Subject Type <span className="text-red-500">*</span>
          </label>

          <select
            name="subjectType"
            value={formData.subjectType}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 cursor-pointer text-white"
          >
            <option value="">Select Type</option>
            <option value="Scholastic">Scholastic</option>
            <option value="Co-Scholastic">Co-Scholastic</option>
            <option value="Personality Traits">Personality Traits</option>
            <option value="Selective">Selective</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm">
            Subject Order <span className="text-red-500">*</span>
          </label>

          <input
            name="subjectOrder"
            type="number"
            placeholder="Subject Order"
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
            value={formData.subjectOrder}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={
            submitLoading ||
            !board ||
            !formData.subjectTitle ||
            !formData.subjectType ||
            !formData.subjectOrder
          }
          className="w-full py-3 rounded-xl bg-blue-600 text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitLoading && <Loader2 size={16} className="animate-spin" />}
          {editSubject ? "Update Subject" : "Save Subject"}
        </button>
      </div>
    </Modal>
  );
}
