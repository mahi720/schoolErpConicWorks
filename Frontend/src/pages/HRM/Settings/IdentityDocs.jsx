import React, { useEffect, useMemo, useState } from "react";
import { Edit, Loader2, RotateCcw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { useIdentityDocumentTypeStore } from "../../../store/hrm/settings/identityDocumentType/identityDocumentTypeStore";

import {
  identityDocumentTypeInitialValues,
  identityDocumentTypeSchema,
} from "../../../validations/hrm/settings/identityDocumentType/identityDocumentTypeValidation";

export default function IdentityDocs() {
  const [formData, setFormData] = useState(identityDocumentTypeInitialValues);

  const [editData, setEditData] = useState(null);

  const {
    identityDocumentTypes,
    loading,
    submitLoading,
    fetchIdentityDocumentTypes,
    createIdentityDocumentType,
    updateIdentityDocumentType,
    deleteIdentityDocumentType,
    restoreIdentityDocumentType,
  } = useIdentityDocumentTypeStore();

  useEffect(() => {
    fetchIdentityDocumentTypes();
  }, [fetchIdentityDocumentTypes]);

  const sortedDocuments = useMemo(() => {
    return [...identityDocumentTypes].sort(
      (first, second) =>
        new Date(first.createdAt).getTime() -
        new Date(second.createdAt).getTime(),
    );
  }, [identityDocumentTypes]);

  const handleChange = (event) => {
    setFormData({
      documentName: event.target.value,
    });
  };

  const resetForm = () => {
    setFormData(identityDocumentTypeInitialValues);
    setEditData(null);
  };

  const handleSave = async () => {
    const validation = identityDocumentTypeSchema.safeParse(formData);

    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message ||
          "Please enter valid document name",
      );

      return;
    }

    const payload = {
      documentName: validation.data.documentName.trim(),
    };

    let success = false;

    if (editData) {
      success = await updateIdentityDocumentType(editData.slug, payload);
    } else {
      success = await createIdentityDocumentType(payload);
    }

    if (success) {
      resetForm();
    }
  };

  const handleEdit = (item) => {
    if (!item.isActive) {
      toast.error("Inactive document type cannot be edited");

      return;
    }

    setEditData(item);

    setFormData({
      documentName: item.documentName || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Kya aap "${item.documentName}" document type ko inactive karna chahte hain?`,
    );

    if (!confirmed) return;

    const success = await deleteIdentityDocumentType(item.slug);

    if (success && editData?.slug === item.slug) {
      resetForm();
    }
  };

  const handleRestore = async (item) => {
    const confirmed = window.confirm(
      `Kya aap "${item.documentName}" document type ko restore karna chahte hain?`,
    );

    if (!confirmed) return;

    await restoreIdentityDocumentType(item.slug);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">
        Identity Document Type
      </h2>

      <hr className="border-gray-800" />

      <div className="flex flex-col md:flex-row md:items-end gap-5">
        <div className="flex flex-col gap-2 w-full md:w-80">
          <label className="text-gray-300 text-sm">
            Document Name
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="text"
            value={formData.documentName}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Document Name"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none focus:border-indigo-500 disabled:opacity-50"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={submitLoading}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitLoading && <Loader2 size={17} className="animate-spin" />}

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
              className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg text-white cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[500px] custom-scrollbar">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-gray-300">S No.</th>

              <th className="p-3 text-gray-300">Document Name</th>

              <th className="p-3 text-gray-300">Status</th>

              <th className="p-3 text-gray-300">Options</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    Loading identity document types...
                  </div>
                </td>
              </tr>
            ) : sortedDocuments.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400">
                  No identity document types found
                </td>
              </tr>
            ) : (
              sortedDocuments.map((item, index) => (
                <tr
                  key={item.slug}
                  className={`border-t border-gray-800 text-center ${
                    item.isActive ? "hover:bg-gray-800/50" : "bg-red-500/5"
                  }`}
                >
                  <td className="p-3 text-gray-300">{index + 1}.</td>

                  <td className="p-3 text-gray-300">{item.documentName}</td>

                  <td className="p-3">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        item.isActive
                          ? "bg-green-500/15 text-green-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        disabled={!item.isActive || submitLoading}
                        title="Edit Identity Document Type"
                        className={`p-2 rounded-lg text-white ${
                          item.isActive
                            ? "bg-cyan-500 hover:bg-cyan-600 cursor-pointer"
                            : "bg-gray-700 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <Edit size={16} />
                      </button>

                      {item.isActive ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={submitLoading}
                          title="Delete Identity Document Type"
                          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRestore(item)}
                          disabled={submitLoading}
                          title="Restore Identity Document Type"
                          className="bg-green-500 hover:bg-green-600 p-2 rounded-lg text-white cursor-pointer disabled:opacity-50"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
