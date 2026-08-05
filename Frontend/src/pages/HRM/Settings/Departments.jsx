import React from "react";
import { Edit, Trash2, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useDepartmentStore } from "../../../store/hrm/settings/department/departmentStore";

export default function Departments() {
  const [departmentName, setDepartmentName] = useState("");
  const [editData, setEditData] = useState(null);

  const {
    departments,
    loading,
    submitLoading,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    restoreDepartment,
  } = useDepartmentStore();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSave = async () => {
    if (!departmentName.trim()) return;

    const payload = {
      departmentName: departmentName.trim(),
    };

    let success = false;

    if (editData) {
      success = await updateDepartment(editData.slug, payload);
    } else {
      success = await createDepartment(payload);
    }

    if (success) {
      setDepartmentName("");
      setEditData(null);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">Departments</h2>

      <hr className="border-gray-800" />

      <div className="flex items-end gap-8">
        <div className="flex flex-col">
          <label className="text-gray-300 text-sm">
            Department Name <span className="text-red-500"> *</span>
          </label>

          <input
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            placeholder="Department Name"
            className="mt-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-96"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={submitLoading}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-white cursor-pointer disabled:opacity-50"
        >
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
            onClick={() => {
              setEditData(null);
              setDepartmentName("");
            }}
            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg text-white cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      <table className="w-full">
        <thead>
          <tr className="border border-gray-800">
            <th className="p-3 text-gray-300">Sno.</th>

            <th className="p-3 text-gray-300">Department Name</th>

            <th className="p-3 text-gray-300">Action</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((item, index) => (
            <tr key={item.id} className="border border-gray-800 text-center">
              <td className="p-3 text-gray-300">{index + 1}</td>

              <td className="p-3 text-gray-300">{item.departmentName}</td>

              <td className="p-3 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setEditData(item);
                    setDepartmentName(item.departmentName);
                  }}
                  disabled={!item.isActive}
                  className={`p-2 rounded-lg text-white ${
                    item.isActive
                      ? "bg-blue-500 hover:bg-blue-700 cursor-pointer"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  <Edit size={16} />
                </button>

                {item.isActive ? (
                  <button
                    onClick={() => deleteDepartment(item.slug)}
                    className="bg-red-500 hover:bg-red-700 p-2 rounded-lg text-white cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => restoreDepartment(item.slug)}
                    className="bg-green-500 hover:bg-green-700 p-2 rounded-lg text-white cursor-pointer"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
