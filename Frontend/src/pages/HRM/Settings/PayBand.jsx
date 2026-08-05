import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Edit,
  Loader2,
  RotateCcw,
  Settings,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { usePayBandStore } from "../../../store/hrm/settings/payBand/payBandStore";

import {
  createPayBandFormData,
  payBandInitialValues,
  payBandSchema,
} from "../../../validations/hrm/settings/payBand/payBandValidation";

export default function PayBand() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(payBandInitialValues);
  const [editData, setEditData] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const {
    payBands,
    loading,
    submitLoading,
    fetchPayBands,
    createPayBand,
    updatePayBand,
    deletePayBand,
    restorePayBand,
  } = usePayBandStore();

  useEffect(() => {
    fetchPayBands();
  }, [fetchPayBands]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const sortedPayBands = useMemo(() => {
    return [...payBands].sort((first, second) => {
      return (
        new Date(first.createdAt).getTime() -
        new Date(second.createdAt).getTime()
      );
    });
  }, [payBands]);

  const resetForm = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm(payBandInitialValues);
    setEditData(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePayBandChange = (event) => {
    setForm((previous) => ({
      ...previous,
      payBandName: event.target.value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG and WEBP images are allowed");

      event.target.value = "";

      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error("Image size cannot exceed 1 MB");

      event.target.value = "";

      return;
    }

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm((previous) => ({
      ...previous,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm((previous) => ({
      ...previous,
      image: null,
    }));

    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    const validation = payBandSchema.safeParse(form);

    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message ||
          "Please enter valid pay band details",
      );

      return;
    }

    const formData = createPayBandFormData(validation.data);

    let success = false;

    if (editData) {
      success = await updatePayBand(editData.slug, formData);
    } else {
      success = await createPayBand(formData);
    }

    if (success) {
      resetForm();
    }
  };

  const handleEdit = (item) => {
    if (!item.isActive) {
      toast.error("Inactive pay band cannot be edited");

      return;
    }

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setEditData(item);

    setForm({
      payBandName: item.payBandName || "",
      image: null,
    });

    setImagePreview(item.image || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Kya aap "${item.payBandName}" pay band ko inactive karna chahte hain?`,
    );

    if (!confirmed) return;

    const success = await deletePayBand(item.slug);

    if (success && editData?.slug === item.slug) {
      resetForm();
    }
  };

  const handleRestore = async (item) => {
    const confirmed = window.confirm(
      `Kya aap "${item.payBandName}" pay band ko restore karna chahte hain?`,
    );

    if (!confirmed) return;

    await restorePayBand(item.slug);
  };

  const handleOpenStructure = (item) => {
    if (!item.isActive) {
      toast.error("Inactive pay band structure cannot be configured");

      return;
    }

    navigate("/hrm/settings/payband-structure", {
      state: {
        payBandSlug: item.slug,
        payBandName: item.payBandName,
      },
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Pay Band</h1>

      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="flex w-full flex-col sm:w-80">
              <label className="text-sm text-gray-400">
                Pay Band
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="text"
                value={form.payBandName}
                onChange={handlePayBandChange}
                disabled={submitLoading}
                placeholder="Pay Band"
                className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500 disabled:opacity-50"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={submitLoading}
                className="flex min-w-28 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitLoading && (
                  <Loader2 size={17} className="animate-spin" />
                )}

                {submitLoading
                  ? editData
                    ? "Updating..."
                    : "Saving..."
                  : editData
                    ? "Update"
                    : "Save"}
              </button>

              {editData && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitLoading}
                  className="cursor-pointer rounded-lg bg-red-500 px-5 py-3 text-white transition hover:bg-red-600 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="flex items-end gap-4">
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Pay band preview"
                  className="h-20 w-40 rounded-lg border border-gray-700 bg-gray-800 object-contain"
                />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={submitLoading}
                  className="absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div>
              <p className="mb-2 text-sm text-gray-400">Upload Image</p>

              <label className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-700">
                <Upload size={18} />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageUpload}
                  disabled={submitLoading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
        <div className="max-h-[550px] overflow-x-auto overflow-y-auto custom-scrollbar">
          <table className="w-full min-w-[800px]">
            <thead className="sticky top-0 z-10 bg-gray-800">
              <tr>
                <th className="p-4 text-center text-gray-300">S no.</th>

                <th className="p-4 text-center text-gray-300">Pay Band</th>

                <th className="p-4 text-center text-gray-300">Image</th>

                <th className="p-4 text-center text-gray-300">Status</th>

                <th className="p-4 text-center text-gray-300">Options</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={20} className="animate-spin" />
                      Loading pay bands...
                    </div>
                  </td>
                </tr>
              ) : sortedPayBands.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-400">
                    No pay bands found
                  </td>
                </tr>
              ) : (
                sortedPayBands.map((item, index) => (
                  <tr
                    key={item.slug}
                    className={`border-t border-gray-800 text-center ${
                      item.isActive ? "hover:bg-gray-800/50" : "bg-red-500/5"
                    }`}
                  >
                    <td className="p-4 text-gray-300">{index + 1}</td>

                    <td className="p-4 font-medium text-gray-300">
                      {item.payBandName}
                    </td>

                    <td className="p-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.payBandName}
                          className="mx-auto h-12 w-24 rounded border border-gray-700 object-contain"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">No image</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          item.isActive
                            ? "bg-green-500/15 text-green-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          disabled={!item.isActive || submitLoading}
                          title="Edit Pay Band"
                          className={`rounded-lg p-3 text-white ${
                            item.isActive
                              ? "cursor-pointer bg-cyan-500 hover:bg-cyan-600"
                              : "cursor-not-allowed bg-gray-700 opacity-50"
                          }`}
                        >
                          <Edit size={16} />
                        </button>

                        {item.isActive ? (
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={submitLoading}
                            title="Delete Pay Band"
                            className="cursor-pointer rounded-lg bg-red-500 p-3 text-white hover:bg-red-600 disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRestore(item)}
                            disabled={submitLoading}
                            title="Restore Pay Band"
                            className="cursor-pointer rounded-lg bg-green-500 p-3 text-white hover:bg-green-600 disabled:opacity-50"
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenStructure(item)}
                          disabled={!item.isActive || submitLoading}
                          title="Configure Pay Band Structure"
                          className={`rounded-lg p-3 text-white ${
                            item.isActive
                              ? "cursor-pointer bg-yellow-500 hover:bg-yellow-600"
                              : "cursor-not-allowed bg-gray-700 opacity-50"
                          }`}
                        >
                          <Settings size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
