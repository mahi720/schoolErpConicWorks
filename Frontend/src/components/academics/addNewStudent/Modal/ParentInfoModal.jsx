import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../../../common/Modal";
import { useStudentStore } from "../../../../store/academic/addNewStudent/studentStore";

const initialFormData = {
  fatherName: "",
  motherName: "",
  phone: "",
  motherPhone: "",
  email: "",
};

export default function ParentInfoModal({
  isOpen,
  onClose,
  studentData,
  onSaved,
}) {
  const { updateStudent, submitLoading } = useStudentStore();

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!isOpen) return;

    if (studentData) {
      setFormData({
        fatherName: studentData.fatherName || "",

        motherName: studentData.motherName || "",

        phone: studentData.phone || "",

        motherPhone: studentData.motherPhone || "",

        email: studentData.email || "",
      });

      return;
    }

    setFormData(initialFormData);
  }, [isOpen, studentData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    if (submitLoading) return;

    setFormData(initialFormData);
    onClose();
  };

  const handleSave = async () => {
    if (!studentData?.slug) {
      toast.error("Student data not found");
      return;
    }

    if (!formData.fatherName.trim()) {
      toast.error("Father's Name is required");
      return;
    }

    if (!formData.motherName.trim()) {
      toast.error("Mother's Name is required");
      return;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone Number must be exactly 10 digits");
      return;
    }

    if (formData.motherPhone && !/^\d{10}$/.test(formData.motherPhone)) {
      toast.error("Mother Phone Number must be exactly 10 digits");
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const success = await updateStudent(studentData.slug, {
      fatherName: formData.fatherName.trim(),

      motherName: formData.motherName.trim(),

      phone: formData.phone.trim(),

      motherPhone: formData.motherPhone.trim(),

      email: formData.email.trim(),
    });

    if (!success) return;

    await onSaved?.();

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Parent Information"
      width="max-w-4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-2">Father's Name</label>

          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            placeholder="Enter Father's Name"
            disabled={submitLoading}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Mother's Name</label>

          <input
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            placeholder="Enter Mother's Name"
            disabled={submitLoading}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Phone</label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(event) => {
              const value = event.target.value.replace(/\D/g, "");

              setFormData((prev) => ({
                ...prev,
                phone: value.slice(0, 10),
              }));
            }}
            placeholder="Enter Phone Number"
            maxLength={10}
            disabled={submitLoading}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Mother Phone</label>

          <input
            type="tel"
            name="motherPhone"
            value={formData.motherPhone}
            onChange={(event) => {
              const value = event.target.value.replace(/\D/g, "");

              setFormData((prev) => ({
                ...prev,
                motherPhone: value.slice(0, 10),
              }));
            }}
            placeholder="Enter Mother Phone Number"
            maxLength={10}
            disabled={submitLoading}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 disabled:opacity-60"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-400 mb-2">Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email Address"
            disabled={submitLoading}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 disabled:opacity-60"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={handleClose}
          disabled={submitLoading}
          className="px-5 py-2 border border-gray-700 rounded-xl text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={submitLoading || !studentData?.slug}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitLoading && <Loader2 size={16} className="animate-spin" />}
          Save
        </button>
      </div>
    </Modal>
  );
}
