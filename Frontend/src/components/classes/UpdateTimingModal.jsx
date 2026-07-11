import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { durations } from "../../utils/durations";
import { Loader2 } from "lucide-react";
import { useClassMappingStore } from "../../store/master/classMapping/classMappingStore";

export default function UpdateTimingModal({
  isOpen,
  onClose,
  board,
  session,
  classData,
  onSaved,
}) {
  const { saveMapping, submitLoading } = useClassMappingStore();

  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    periodDuration: "",
    breakTime: "",
    breakDuration: "",
  });

  useEffect(() => {
    if (isOpen && classData) {
      setFormData({
        startTime: classData.startTime || "",
        endTime: classData.endTime || "",
        periodDuration: classData.periodDuration || "",
        breakTime: classData.breakTime || "",
        breakDuration: classData.breakDuration || "",
      });
    }
  }, [isOpen, classData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    if (!board || !session || !classData) return;

    const success = await saveMapping({
      board,
      session,
      classTitle: classData.classTitle,
      startTime: formData.startTime,
      endTime: formData.endTime,
      periodDuration: formData.periodDuration,
      breakTime: formData.breakTime,
      breakDuration: formData.breakDuration,
    });

    if (success) {
      onClose();
      onSaved?.();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Class Timing ${classData?.classTitle ? `- ${classData.classTitle}` : ""}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-300">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full mt-2 bg-gray-800 text-white border border-gray-700 rounded-xl p-3 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-gray-300">End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full mt-2 bg-gray-800 text-white border border-gray-700 rounded-xl p-3 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-gray-300">Period Duration</label>
          <select
            name="periodDuration"
            value={formData.periodDuration}
            onChange={handleChange}
            className="w-full mt-2 bg-gray-800 text-white border border-gray-700 rounded-xl p-3 cursor-pointer"
          >
            <option value="">Select Duration</option>
            {durations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-300">Break Time</label>
          <input
            type="time"
            name="breakTime"
            value={formData.breakTime}
            onChange={handleChange}
            className="w-full mt-2 bg-gray-800 text-white border border-gray-700 rounded-xl p-3 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-gray-300">Break Duration</label>
          <select
            name="breakDuration"
            value={formData.breakDuration}
            onChange={handleChange}
            className="w-full mt-2 bg-gray-800 text-white border border-gray-700 rounded-xl p-3 cursor-pointer"
          >
            <option value="">Select Duration</option>
            {durations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          disabled={submitLoading}
          className="px-4 py-2 border border-gray-700 text-white rounded-xl cursor-pointer disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          disabled={submitLoading || !board || !session || !classData}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl cursor-pointer disabled:opacity-60 flex items-center gap-2"
        >
          {submitLoading && <Loader2 size={16} className="animate-spin" />}
          Update
        </button>
      </div>
    </Modal>
  );
}
