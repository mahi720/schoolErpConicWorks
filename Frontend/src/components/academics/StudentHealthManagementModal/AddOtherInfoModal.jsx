import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

import { useStudentHealthManagementStore } from "../../../store/academic/studentHealthManagement/studentHealthManagementStore";

const initialFormData = {
  studentBloodGroup: "",
  motherYob: "",
  motherWeight: "",
  motherHeight: "",
  motherBloodGroup: "",
  motherAadharCardNumber: "",
  fatherYob: "",
  fatherWeight: "",
  fatherHeight: "",
  fatherBloodGroup: "",
  fatherAadharCardNumber: "",
  familyMonthlyIncome: "",
  cwsnSpecify: "",
};

export default function AddOtherInfoModal({
  open,
  close,
  student,
  academicYear,
  otherInformationSlug,
  isEdit = false,
  onSuccess,
}) {
  const { submitLoading, createOtherInformation, updateOtherInformation } =
    useStudentHealthManagementStore();

  const [formData, setFormData] = useState(initialFormData);

  const studentSlug = student?.studentSlug || student?.slug || "";

  const existingOtherInformation = student?.otherInformation || null;

  const currentOtherInformationSlug =
    otherInformationSlug ||
    student?.otherInformationSlug ||
    existingOtherInformation?.slug ||
    null;

  const storageKey = studentSlug
    ? `student-other-information-${studentSlug}`
    : "";

  useEffect(() => {
    if (!open) {
      return;
    }

    let storedData = null;

    if (storageKey) {
      try {
        const savedData = localStorage.getItem(storageKey);

        if (savedData) {
          storedData = JSON.parse(savedData);
        }
      } catch (error) {
        storedData = null;
      }
    }

    const data = existingOtherInformation || storedData;

    if (data) {
      setFormData({
        studentBloodGroup: data.studentBloodGroup || "",

        motherYob: data.motherYob || "",

        motherWeight: data.motherWeight || "",

        motherHeight: data.motherHeight || "",

        motherBloodGroup: data.motherBloodGroup || "",

        motherAadharCardNumber: data.motherAadharCardNumber || "",

        fatherYob: data.fatherYob || "",

        fatherWeight: data.fatherWeight || "",

        fatherHeight: data.fatherHeight || "",

        fatherBloodGroup: data.fatherBloodGroup || "",

        fatherAadharCardNumber: data.fatherAadharCardNumber || "",

        familyMonthlyIncome: data.familyMonthlyIncome || "",

        cwsnSpecify: data.cwsnSpecify || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [open, storageKey, existingOtherInformation]);

  const handleChange = (field, value) => {
    setFormData((previous) => {
      const updatedData = {
        ...previous,
        [field]: value,
      };

      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(updatedData));
      }

      return updatedData;
    });
  };

  const handleSubmit = async () => {
    if (!studentSlug) {
      toast.error("Student information not found");

      return;
    }

    const payload = {
      studentSlug,
      academicYear,
      ...formData,
    };

    let success = false;

    if (isEdit || currentOtherInformationSlug) {
      if (!currentOtherInformationSlug) {
        toast.error("Other information record not found");

        return;
      }

      success = await updateOtherInformation(
        currentOtherInformationSlug,
        payload,
      );
    } else {
      success = await createOtherInformation(payload);
    }

    if (!success) {
      return;
    }

    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(formData));
    }

    if (onSuccess) {
      await onSuccess();
    }

    close();
  };

  const handleClose = () => {
    if (submitLoading) {
      return;
    }

    close();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-[90%] max-w-6xl rounded-2xl border border-gray-700">
        {/* Header */}

        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">Add Student Other Information</h2>

          <X onClick={handleClose} className="text-gray-400 cursor-pointer" />
        </div>

        {/* Body */}

        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Student */}

          <div className="mb-6 flex flex-col">
            <label className="text-gray-400 text-sm">
              Student&apos;s Blood Group
            </label>

            <input
              value={formData.studentBloodGroup}
              onChange={(event) =>
                handleChange("studentBloodGroup", event.target.value)
              }
              placeholder="Student's Blood Group"
              className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-96"
            />
          </div>

          {/* Mother */}

          <SectionTitle title="Mother's" />

          <div className="grid grid-cols-3 gap-5 mb-6">
            <InputBox
              label="Mother's YOB"
              value={formData.motherYob}
              onChange={(value) => handleChange("motherYob", value)}
            />

            <InputBox
              label="Mother's Weight"
              value={formData.motherWeight}
              onChange={(value) => handleChange("motherWeight", value)}
            />

            <InputBox
              label="Mother's Height"
              value={formData.motherHeight}
              onChange={(value) => handleChange("motherHeight", value)}
            />

            <InputBox
              label="Mother's Blood Group"
              value={formData.motherBloodGroup}
              onChange={(value) => handleChange("motherBloodGroup", value)}
            />

            <InputBox
              label="Mother's Aadhar Card Number"
              value={formData.motherAadharCardNumber}
              onChange={(value) =>
                handleChange("motherAadharCardNumber", value)
              }
            />
          </div>

          {/* Father */}

          <SectionTitle title="Father's" />

          <div className="grid grid-cols-3 gap-5 mb-6">
            <InputBox
              label="Father's YOB"
              value={formData.fatherYob}
              onChange={(value) => handleChange("fatherYob", value)}
            />

            <InputBox
              label="Father's Weight"
              value={formData.fatherWeight}
              onChange={(value) => handleChange("fatherWeight", value)}
            />

            <InputBox
              label="Father's Height"
              value={formData.fatherHeight}
              onChange={(value) => handleChange("fatherHeight", value)}
            />

            <InputBox
              label="Father's Blood Group"
              value={formData.fatherBloodGroup}
              onChange={(value) => handleChange("fatherBloodGroup", value)}
            />

            <InputBox
              label="Father's Aadhar Card Number"
              value={formData.fatherAadharCardNumber}
              onChange={(value) =>
                handleChange("fatherAadharCardNumber", value)
              }
            />
          </div>

          {/* Other */}

          <SectionTitle title="Other" />

          <div className="grid grid-cols-3 gap-5">
            <InputBox
              label="Family Monthly Income"
              value={formData.familyMonthlyIncome}
              onChange={(value) => handleChange("familyMonthlyIncome", value)}
            />

            <InputBox
              label="CWSN, Specify"
              value={formData.cwsnSpecify}
              onChange={(value) => handleChange("cwsnSpecify", value)}
            />
          </div>
        </div>

        {/* Footer */}

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitLoading}
            className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={17} className="animate-spin" />
                Saving...
              </span>
            ) : currentOtherInformationSlug ? (
              "Update Information"
            ) : (
              "Save Information"
            )}
          </button>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function InputBox({ label, value, onChange }) {
  return (
    <div>
      <label className="text-gray-400 text-sm">{label}</label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full"
      />
    </div>
  );
}

function SectionTitle({ title }) {
  return <h3 className="text-lg text-white mb-3">{title}</h3>;
}
