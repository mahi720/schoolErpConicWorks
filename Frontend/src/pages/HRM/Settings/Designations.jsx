import React, { useEffect, useMemo, useState } from "react";
import { Edit, Trash2, User, Funnel, RotateCcw, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useDepartmentStore } from "../../../store/hrm/settings/department/departmentStore";
import { useDesignationStore } from "../../../store/hrm/settings/designation/designationStore";

import {
  designationInitialValues,
  designationSchema,
} from "../../../validations/hrm/settings/designation/designationValidation";

export default function Designations() {
  const [formData, setFormData] = useState(designationInitialValues);

  const [editData, setEditData] = useState(null);
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("");

  const {
    departments,
    loading: departmentLoading,
    fetchDepartments,
  } = useDepartmentStore();

  const {
    designations,
    loading,
    submitLoading,
    fetchDesignations,
    createDesignation,
    updateDesignation,
    deleteDesignation,
    restoreDesignation,
  } = useDesignationStore();

  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
  }, []);

  const activeDepartments = useMemo(() => {
    return departments.filter((item) => item.isActive);
  }, [departments]);

  const filteredDesignations = useMemo(() => {
    if (!selectedDepartmentFilter) {
      return designations;
    }

    return designations.filter(
      (item) => item.departmentSlug === selectedDepartmentFilter,
    );
  }, [designations, selectedDepartmentFilter]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(designationInitialValues);
    setEditData(null);
  };

  const handleSave = async () => {
    const validation = designationSchema.safeParse(formData);

    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message ||
          "Please enter valid designation details",
      );

      return;
    }

    const payload = {
      departmentSlug: validation.data.departmentSlug,
      designationName: validation.data.designationName.trim(),
      designationLevel: validation.data.designationLevel,
    };

    let success = false;

    if (editData) {
      success = await updateDesignation(editData.slug, payload);
    } else {
      success = await createDesignation(payload);
    }

    if (success) {
      resetForm();
    }
  };

  const handleEdit = (item) => {
    if (!item.isActive) {
      toast.error("Inactive designation ko edit nahi kar sakte");

      return;
    }

    setEditData(item);

    setFormData({
      departmentSlug: item.departmentSlug || "",
      designationName: item.designationName || "",
      designationLevel: item.designationLevel?.toString() || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Kya aap "${item.designationName}" designation ko inactive karna chahte hain?`,
    );

    if (!confirmed) return;

    const success = await deleteDesignation(item.slug);

    if (success && editData?.slug === item.slug) {
      resetForm();
    }
  };

  const handleRestore = async (item) => {
    const confirmed = window.confirm(
      `Kya aap "${item.designationName}" designation ko restore karna chahte hain?`,
    );

    if (!confirmed) return;

    await restoreDesignation(item.slug);
  };

  const handleClearFilter = () => {
    setSelectedDepartmentFilter("");
  };

  const getDepartmentName = (item) => {
    return (
      item.department?.departmentName ||
      departments.find((department) => department.slug === item.departmentSlug)
        ?.departmentName ||
      "-"
    );
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">Designations</h2>

      <hr className="border-gray-800" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-end">
        <div className="flex flex-col gap-2">
          <label className="text-gray-300 text-sm">
            Department
            <span className="text-red-500"> *</span>
          </label>

          <select
            name="departmentSlug"
            value={formData.departmentSlug}
            onChange={handleChange}
            disabled={departmentLoading || submitLoading}
            className="bg-gray-800 border cursor-pointer border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none disabled:opacity-50"
          >
            <option value="">
              {departmentLoading
                ? "Loading Departments..."
                : "Select Department"}
            </option>

            {activeDepartments.map((department) => (
              <option key={department.slug} value={department.slug}>
                {department.departmentName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-300 text-sm">
            Designation Name
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="text"
            name="designationName"
            value={formData.designationName}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Designation Name"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-300 text-sm">
            Designation Level
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="number"
            min="1"
            name="designationLevel"
            value={formData.designationLevel}
            onChange={handleChange}
            disabled={submitLoading}
            placeholder="Designation Level"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none disabled:opacity-50"
          />
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

      <div className="flex flex-col sm:flex-row items-end gap-4 justify-end">
        <Funnel size={25} className="text-white mb-3 hidden sm:block" />

        <div className="flex flex-col gap-2 w-full sm:w-64">
          <label className="text-gray-300 text-sm">Filter By Department</label>

          <select
            value={selectedDepartmentFilter}
            onChange={(event) =>
              setSelectedDepartmentFilter(event.target.value)
            }
            className="bg-gray-800 border cursor-pointer border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none"
          >
            <option value="">All Departments</option>

            {departments.map((department) => (
              <option key={department.slug} value={department.slug}>
                {department.departmentName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleClearFilter}
          disabled={!selectedDepartmentFilter}
          className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[500px] custom-scrollbar">
        <table className="w-full min-w-[850px]">
          <thead className="sticky top-0 bg-gray-900 z-10">
            <tr className="border border-gray-800">
              <th className="p-3 text-gray-300">Sno.</th>

              <th className="p-3 text-gray-300">Department</th>

              <th className="p-3 text-gray-300">Designation Name</th>

              <th className="p-3 text-gray-300">Designation Level</th>

              <th className="p-3 text-gray-300">Status</th>

              <th className="p-3 text-gray-300">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    Loading designations...
                  </div>
                </td>
              </tr>
            ) : filteredDesignations.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  No designations found
                </td>
              </tr>
            ) : (
              filteredDesignations.map((item, index) => (
                <tr
                  key={item.slug}
                  className={`border border-gray-800 text-center ${
                    !item.isActive ? "bg-red-500/5" : ""
                  }`}
                >
                  <td className="p-3 text-gray-300">{index + 1}.</td>

                  <td className="p-3 text-gray-300">
                    {getDepartmentName(item)}
                  </td>

                  <td className="p-3 text-gray-300">{item.designationName}</td>

                  <td className="p-3 text-gray-300">{item.designationLevel}</td>

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
                        title="Edit Designation"
                        className={`p-2 rounded-lg text-white ${
                          item.isActive
                            ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                            : "bg-gray-700 cursor-not-allowed opacity-50"
                        }`}
                      >
                        <Edit size={16} />
                      </button>

                      {item.isActive ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={submitLoading}
                          title="Delete Designation"
                          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg cursor-pointer text-white disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRestore(item)}
                          disabled={submitLoading}
                          title="Restore Designation"
                          className="bg-green-500 hover:bg-green-600 p-2 rounded-lg cursor-pointer text-white disabled:opacity-50"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={!item.isActive}
                        title="View Assigned Users"
                        className={`p-2 rounded-lg text-white ${
                          item.isActive
                            ? "bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
                            : "bg-gray-700 cursor-not-allowed opacity-50"
                        }`}
                      >
                        <User size={16} />
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
  );
}
