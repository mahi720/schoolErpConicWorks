import React, { useEffect, useMemo, useState } from "react";
import { Edit, Loader2, RotateCcw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { useAuthorizedPersonStore } from "../../../store/hrm/settings/authorizedPerson/authorizedPersonStore";
import { useDesignationStore } from "../../../store/hrm/settings/designation/designationStore";

import {
  authorizedPersonInitialValues,
  authorizedPersonSchema,
} from "../../../validations/hrm/settings/authorizedPerson/authorizedPersonValidation";

export default function AuthorizedPersons() {
  const [formData, setFormData] = useState(authorizedPersonInitialValues);

  const [editData, setEditData] = useState(null);

  const {
    designations,
    loading: designationLoading,
    fetchDesignations,
  } = useDesignationStore();

  const {
    authorizedPersons,
    loading,
    submitLoading,
    fetchAuthorizedPersons,
    createAuthorizedPerson,
    updateAuthorizedPerson,
    deleteAuthorizedPerson,
    restoreAuthorizedPerson,
  } = useAuthorizedPersonStore();

  useEffect(() => {
    fetchDesignations({
      status: "active",
    });

    fetchAuthorizedPersons();
  }, [fetchDesignations, fetchAuthorizedPersons]);

  const activeDesignations = useMemo(() => {
    return designations.filter((item) => item.isActive);
  }, [designations]);

  const sortedAuthorizedPersons = useMemo(() => {
    return [...authorizedPersons].sort(
      (first, second) =>
        new Date(first.createdAt).getTime() -
        new Date(second.createdAt).getTime(),
    );
  }, [authorizedPersons]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(authorizedPersonInitialValues);
    setEditData(null);
  };

  const handleSave = async () => {
    const validation = authorizedPersonSchema.safeParse(formData);

    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message ||
          "Please enter valid authorized person details",
      );

      return;
    }

    const payload = {
      personName: validation.data.personName.trim(),
      designationSlug: validation.data.designationSlug,
    };

    let success = false;

    if (editData) {
      success = await updateAuthorizedPerson(editData.slug, payload);
    } else {
      success = await createAuthorizedPerson(payload);
    }

    if (success) {
      resetForm();
    }
  };

  const handleEdit = (item) => {
    if (!item.isActive) {
      toast.error("Inactive authorized person cannot be edited");

      return;
    }

    setEditData(item);

    setFormData({
      personName: item.personName || "",
      designationSlug: item.designationSlug || item.designation?.slug || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Kya aap "${item.personName}" ko inactive karna chahte hain?`,
    );

    if (!confirmed) return;

    const success = await deleteAuthorizedPerson(item.slug);

    if (success && editData?.slug === item.slug) {
      resetForm();
    }
  };

  const handleRestore = async (item) => {
    const confirmed = window.confirm(
      `Kya aap "${item.personName}" ko restore karna chahte hain?`,
    );

    if (!confirmed) return;

    await restoreAuthorizedPerson(item.slug);
  };

  const getDesignationName = (item) => {
    return item.designation?.designationName || item.designationName || "-";
  };

  const getDepartmentName = (item) => {
    return (
      item.designation?.department?.departmentName || item.departmentName || "-"
    );
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">Authorized Persons</h2>

      <hr className="border-gray-800" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-end">
        <div className="flex flex-col gap-2">
          <label className="text-gray-300 text-sm">
            Person Name
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="text"
            name="personName"
            value={formData.personName}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Person Name"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none focus:border-blue-500 disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-300 text-sm">
            Designation
            <span className="text-red-500"> *</span>
          </label>

          <select
            name="designationSlug"
            value={formData.designationSlug}
            onChange={handleChange}
            disabled={designationLoading || submitLoading}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full cursor-pointer outline-none focus:border-blue-500 disabled:opacity-50"
          >
            <option value="">
              {designationLoading
                ? "Loading Designations..."
                : "Select Designation"}
            </option>

            {activeDesignations.map((designation) => (
              <option key={designation.slug} value={designation.slug}>
                {designation.designationName}
                {designation.department?.departmentName
                  ? ` - ${designation.department.departmentName}`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={submitLoading}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        <table className="w-full min-w-[850px]">
          <thead className="sticky top-0 bg-gray-900 z-10">
            <tr className="border border-gray-800">
              <th className="p-3 text-gray-300">Sno.</th>

              <th className="p-3 text-gray-300">Name</th>

              <th className="p-3 text-gray-300">Department</th>

              <th className="p-3 text-gray-300">Designation Name</th>

              <th className="p-3 text-gray-300">Status</th>

              <th className="p-3 text-gray-300">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    Loading authorized persons...
                  </div>
                </td>
              </tr>
            ) : sortedAuthorizedPersons.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-400">
                  No authorized persons found
                </td>
              </tr>
            ) : (
              sortedAuthorizedPersons.map((item, index) => (
                <tr
                  key={item.slug}
                  className={`border border-gray-800 text-center ${
                    item.isActive ? "hover:bg-gray-800/50" : "bg-red-500/5"
                  }`}
                >
                  <td className="p-3 text-gray-300">{index + 1}.</td>

                  <td className="p-3 text-gray-300">{item.personName}</td>

                  <td className="p-3 text-gray-300">
                    {getDepartmentName(item)}
                  </td>

                  <td className="p-3 text-gray-300">
                    {getDesignationName(item)}
                  </td>

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
                        title="Edit Authorized Person"
                        className={`p-2 rounded-lg text-white ${
                          item.isActive
                            ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
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
                          title="Delete Authorized Person"
                          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg cursor-pointer text-white disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRestore(item)}
                          disabled={submitLoading}
                          title="Restore Authorized Person"
                          className="bg-green-500 hover:bg-green-600 p-2 rounded-lg cursor-pointer text-white disabled:opacity-50"
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
