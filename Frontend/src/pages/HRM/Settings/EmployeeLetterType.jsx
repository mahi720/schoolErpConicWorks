import React, { useEffect, useMemo, useState } from "react";
import { Edit, Loader2, Plus, RotateCcw, Trash2, X } from "lucide-react";
import ReactQuill from "react-quill-new";
import toast from "react-hot-toast";

import "react-quill-new/dist/quill.snow.css";

import { useEmployeeLetterTypeStore } from "../../../store/hrm/settings/employeeLetterType/employeeLetterTypeStore";

import {
  employeeLetterTypeInitialValues,
  employeeLetterTypeSchema,
} from "../../../validations/hrm/settings/employeeLetterType/employeeLetterTypeValidation";

const columns = [
  {
    label: "Emp Id",
    value: "EMP_ID",
  },
  {
    label: "Emp Name",
    value: "EMP_NAME",
  },
  {
    label: "Emp Code",
    value: "EMP_CODE",
  },
  {
    label: "Emp Phone Number",
    value: "EMP_PHONE_NUMBER",
  },
  {
    label: "Emp Email Id",
    value: "EMP_EMAIL_ID",
  },
  {
    label: "Emp DOB",
    value: "EMP_DOB",
  },
  {
    label: "Bank Name",
    value: "BANK_NAME",
  },
  {
    label: "Account Number",
    value: "ACCOUNT_NUMBER",
  },
  {
    label: "IFSC Code",
    value: "IFSC_CODE",
  },
  {
    label: "State",
    value: "STATE",
  },
  {
    label: "City",
    value: "CITY",
  },
  {
    label: "District",
    value: "DISTRICT",
  },
  {
    label: "Pincode",
    value: "PINCODE",
  },
  {
    label: "Address",
    value: "ADDRESS",
  },
  {
    label: "Job Description",
    value: "JOB_DESCRIPTION",
  },
  {
    label: "Joining Date",
    value: "JOINING_DATE",
  },
  {
    label: "Salary",
    value: "SALARY",
  },
  {
    label: "Salary Term",
    value: "SALARY_TERM",
  },
  {
    label: "TDS",
    value: "TDS",
  },
];

const quillModules = {
  toolbar: [
    [{ font: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

export default function EmployeeLetterType() {
  const [formData, setFormData] = useState(employeeLetterTypeInitialValues);

  const [editData, setEditData] = useState(null);
  const [columnModalOpen, setColumnModalOpen] = useState(false);

  const {
    employeeLetterTypes,
    loading,
    submitLoading,
    fetchEmployeeLetterTypes,
    createEmployeeLetterType,
    updateEmployeeLetterType,
    deleteEmployeeLetterType,
    restoreEmployeeLetterType,
  } = useEmployeeLetterTypeStore();

  useEffect(() => {
    fetchEmployeeLetterTypes();
  }, [fetchEmployeeLetterTypes]);

  const sortedLetterTypes = useMemo(() => {
    return [...employeeLetterTypes].sort(
      (first, second) =>
        new Date(first.createdAt).getTime() -
        new Date(second.createdAt).getTime(),
    );
  }, [employeeLetterTypes]);

  const handleNameChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      letterTypeName: event.target.value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((previous) => ({
      ...previous,
      letterContent: value,
    }));
  };

  const resetForm = () => {
    setFormData(employeeLetterTypeInitialValues);
    setEditData(null);
    setColumnModalOpen(false);
  };

  const handleSave = async () => {
    const validation = employeeLetterTypeSchema.safeParse(formData);

    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message ||
          "Please enter valid employee letter details",
      );

      return;
    }

    const payload = {
      letterTypeName: validation.data.letterTypeName.trim(),
      letterContent: validation.data.letterContent,
    };

    let success = false;

    if (editData) {
      success = await updateEmployeeLetterType(editData.slug, payload);
    } else {
      success = await createEmployeeLetterType(payload);
    }

    if (success) {
      resetForm();
    }
  };

  const handleEdit = (item) => {
    if (!item.isActive) {
      toast.error("Inactive employee letter type cannot be edited");

      return;
    }

    setEditData(item);

    setFormData({
      letterTypeName: item.letterTypeName || "",
      letterContent: item.letterContent || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Kya aap "${item.letterTypeName}" letter type ko inactive karna chahte hain?`,
    );

    if (!confirmed) return;

    const success = await deleteEmployeeLetterType(item.slug);

    if (success && editData?.slug === item.slug) {
      resetForm();
    }
  };

  const handleRestore = async (item) => {
    const confirmed = window.confirm(
      `Kya aap "${item.letterTypeName}" letter type ko restore karna chahte hain?`,
    );

    if (!confirmed) return;

    await restoreEmployeeLetterType(item.slug);
  };

  const handleInsertColumn = (column) => {
    const placeholder = ` {{${column.value}}} `;

    setFormData((previous) => ({
      ...previous,
      letterContent: previous.letterContent + placeholder,
    }));

    setColumnModalOpen(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">Employee Letter Type</h2>

      <hr className="border-gray-800" />

      <div className="space-y-6">
        <div className="flex flex-col w-full md:w-96">
          <label className="text-gray-300 text-sm">
            Letter Type Name
            <span className="text-red-500"> *</span>
          </label>

          <input
            type="text"
            value={formData.letterTypeName}
            onChange={handleNameChange}
            disabled={submitLoading}
            placeholder="Letter Type Name"
            className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none focus:border-indigo-500 disabled:opacity-50"
          />
        </div>

        <div>
          <div className="flex items-center gap-3">
            <label className="text-gray-300 text-sm">
              Letter Type Content
              <span className="text-red-500"> *</span>
            </label>

            <button
              type="button"
              onClick={() => setColumnModalOpen(true)}
              disabled={submitLoading}
              title="Insert Employee Column"
              className="bg-cyan-500 px-3 hover:bg-cyan-600 py-2 rounded-lg text-white cursor-pointer disabled:opacity-50"
            >
              <Plus size={17} />
            </button>
          </div>

          <div className="mt-3 bg-white border border-gray-700 rounded-lg overflow-hidden">
            <ReactQuill
              theme="snow"
              value={formData.letterContent}
              onChange={handleContentChange}
              modules={quillModules}
              readOnly={submitLoading}
              className="custom-editor"
            />
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Plus button se employee fields insert kar sakte hain, jaise{" "}
            {"{{EMP_NAME}}"} ya {"{{JOINING_DATE}}"}.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={submitLoading}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg min-w-32 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      <div className="overflow-x-auto overflow-y-auto max-h-[500px] custom-scrollbar">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-gray-300">SNo.</th>

              <th className="p-3 text-gray-300">Letter Type Name</th>

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
                    Loading employee letter types...
                  </div>
                </td>
              </tr>
            ) : sortedLetterTypes.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400">
                  No employee letter types found
                </td>
              </tr>
            ) : (
              sortedLetterTypes.map((item, index) => (
                <tr
                  key={item.slug}
                  className={`border-t border-gray-800 text-center ${
                    item.isActive ? "hover:bg-gray-800/50" : "bg-red-500/5"
                  }`}
                >
                  <td className="p-3 text-gray-300">{index + 1}.</td>

                  <td className="p-3 text-gray-300">{item.letterTypeName}</td>

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
                        title="Edit Employee Letter Type"
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
                          title="Delete Employee Letter Type"
                          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRestore(item)}
                          disabled={submitLoading}
                          title="Restore Employee Letter Type"
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

      {columnModalOpen && (
        <ColumnModal
          close={() => setColumnModalOpen(false)}
          columns={columns}
          onSelect={handleInsertColumn}
        />
      )}
    </div>
  );
}

function ColumnModal({ close, columns, onSelect }) {
  const [search, setSearch] = useState("");

  const filteredColumns = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return columns.filter((column) =>
      column.label.toLowerCase().includes(searchValue),
    );
  }, [columns, search]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <div>
            <h2 className="text-white text-xl font-semibold">
              Select Column Name
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Employee placeholder select karein
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search column..."
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none focus:border-indigo-500"
          />

          <div className="mt-4 max-h-64 overflow-x-auto overflow-y-auto custom-scrollbar">
            {filteredColumns.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">
                No columns found
              </p>
            ) : (
              filteredColumns.map((column) => (
                <button
                  type="button"
                  key={column.value}
                  onClick={() => onSelect(column)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-gray-300 cursor-pointer hover:bg-gray-800 hover:text-white"
                >
                  <span>{column.label}</span>

                  <span className="text-xs text-indigo-400">
                    {`{{${column.value}}}`}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 p-4 flex justify-end">
          <button
            type="button"
            onClick={close}
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
