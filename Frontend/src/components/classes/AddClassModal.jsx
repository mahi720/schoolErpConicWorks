import React, { useEffect } from "react";
import Modal from "../common/Modal";
import { Loader2 } from "lucide-react";

import { useClassStore } from "../../store/master/class/classStore";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { classSchema } from "../../validations/master/class/classSchema";

const defaultValues = {
  classTitle: "",
  type: "",
};

export default function AddClassModal({ isOpen, onClose, editClass, board }) {
  const { createClass, updateClass, submitLoading } = useClassStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(classSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (editClass) {
      reset({
        classTitle: editClass.classTitle || "",
        type: editClass.classType || "",
      });
    } else {
      reset(defaultValues);
    }
  }, [isOpen, editClass, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (data) => {
    // console.log("111", data);
    const payload = {
      classTitle: data.classTitle,
      classType: data.type,
      board,
    };

    let success = false;

    if (editClass) {
      success = await updateClass(editClass.slug, payload);
    } else {
      success = await createClass(payload);
    }

    if (success) {
      handleClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editClass ? "Edit Class" : "Add Class"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="text-gray-300 block text-sm">Class Title</label>

          <input
            type="text"
            placeholder="Enter Class Name"
            {...register("classTitle")}
            className="w-full mt-2 bg-gray-800 text-white border border-gray-700 rounded-xl p-3"
          />

          {errors.classTitle && (
            <p className="text-red-400 text-sm mt-1">
              {errors.classTitle.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Class Type <span className="text-red-500">*</span>
          </label>

          <select
            {...register("type")}
            className="w-full p-3 rounded-xl bg-gray-800 cursor-pointer text-white"
          >
            <option value="">Select Class Type</option>
            <option value="Pre-Primary">Pre-Primary (Nursery to UKG)</option>
            <option value="Primary">Primary (1st to 5th)</option>
            <option value="Middle">Middle (6th to 8th)</option>
            <option value="Secondary">Secondary (9th to 10th)</option>
            <option value="Senior Secondary">
              Senior Secondary (11th to 12th)
            </option>
          </select>

          {errors.type && (
            <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="px-4 py-2 border border-gray-700 text-white rounded-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitLoading || !board}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitLoading && <Loader2 size={16} className="animate-spin" />}
            {editClass ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
