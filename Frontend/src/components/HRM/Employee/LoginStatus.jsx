import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

import { useEmployeeStore } from "../../../store/HRM/employee/employeeStore";

import { employeeLoginSettingSchema } from "../../../validations/HRM/employee/employeeValidation";

const initialForm = {
  loginStatus: "DEFAULT",
  inBufferMinutes: "",
  outBufferMinutes: "",
};

export default function LoginStatusModal({ open, close, employee }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const updateLoginSetting = useEmployeeStore(
    (state) => state.updateLoginSetting,
  );

  const modalLoading = useEmployeeStore((state) => state.modalLoading);

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm({
      loginStatus: employee?.loginSetting?.loginStatus || "DEFAULT",

      inBufferMinutes: employee?.loginSetting?.inBufferMinutes ?? "",

      outBufferMinutes: employee?.loginSetting?.outBufferMinutes ?? "",
    });

    setErrors({});
  }, [open, employee]);

  if (!open || !employee) {
    return null;
  }

  const handleStatusChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,

      loginStatus: value,

      ...(value !== "FLEXIBLE" && {
        inBufferMinutes: "",
        outBufferMinutes: "",
      }),
    }));

    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleUpdate = async () => {
    const validation = employeeLoginSettingSchema.safeParse(form);

    if (!validation.success) {
      const fieldErrors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path?.[0];

        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);

      const firstError = validation.error.issues?.[0]?.message;

      if (firstError) {
        toast.error(firstError);
      }

      return;
    }

    const payload = {
      loginStatus: form.loginStatus,

      inBufferMinutes:
        form.loginStatus === "FLEXIBLE" ? Number(form.inBufferMinutes) : null,

      outBufferMinutes:
        form.loginStatus === "FLEXIBLE" ? Number(form.outBufferMinutes) : null,
    };

    const success = await updateLoginSetting(employee.slug, payload);

    if (success) {
      close();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 w-full max-w-[550px] rounded-xl border border-gray-700">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <div>
            <h2 className="text-xl text-white">Update Login Status</h2>

            <p className="text-sm text-gray-400 mt-1">
              {employee.fullName} ({employee.employeeId})
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={modalLoading}
            className="text-gray-400 hover:text-white cursor-pointer transition disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-8 space-y-5">
          <div>
            <label className="text-gray-300">
              Status <span className="text-red-500">*</span>
            </label>

            <select
              value={form.loginStatus}
              onChange={handleStatusChange}
              className={`mt-3 bg-gray-800 border rounded-lg px-4 py-3 text-white w-full cursor-pointer outline-none focus:border-indigo-500 ${
                errors.loginStatus ? "border-red-500" : "border-gray-700"
              }`}
            >
              <option value="DEFAULT">Default (D)</option>
              <option value="FLEXIBLE">Flexible (F)</option>
              <option value="NO_BOUNDATION">No Boundation (B)</option>
            </select>

            {errors.loginStatus && (
              <p className="text-red-400 text-sm mt-1">{errors.loginStatus}</p>
            )}
          </div>

          {form.loginStatus === "FLEXIBLE" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm">
                  In Buffer (in minutes)
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="number"
                  name="inBufferMinutes"
                  min="0"
                  value={form.inBufferMinutes}
                  onChange={handleChange}
                  placeholder="Enter In Buffer Minutes"
                  className={`mt-2 bg-gray-800 border rounded-lg px-4 py-3 text-white w-full outline-none focus:border-indigo-500 ${
                    errors.inBufferMinutes
                      ? "border-red-500"
                      : "border-gray-700"
                  }`}
                />

                {errors.inBufferMinutes && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.inBufferMinutes}
                  </p>
                )}
              </div>

              <div>
                <label className="text-gray-300 text-sm">
                  Out Buffer (in minutes)
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="number"
                  name="outBufferMinutes"
                  min="0"
                  value={form.outBufferMinutes}
                  onChange={handleChange}
                  placeholder="Enter Out Buffer Minutes"
                  className={`mt-2 bg-gray-800 border rounded-lg px-4 py-3 text-white w-full outline-none focus:border-indigo-500 ${
                    errors.outBufferMinutes
                      ? "border-red-500"
                      : "border-gray-700"
                  }`}
                />

                {errors.outBufferMinutes && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.outBufferMinutes}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="bg-gray-800/60 rounded-lg p-4 text-sm text-gray-400">
            {form.loginStatus === "DEFAULT" && (
              <p>Default attendance/login timing rules will apply.</p>
            )}

            {form.loginStatus === "FLEXIBLE" && (
              <p>Employee-specific in and out buffer minutes will apply.</p>
            )}

            {form.loginStatus === "NO_BOUNDATION" && (
              <p>
                No login or logout time boundation will apply to this employee.
              </p>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={modalLoading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-lg text-white cursor-pointer transition flex items-center gap-2"
          >
            {modalLoading && <Loader2 size={17} className="animate-spin" />}

            {modalLoading ? "Updating..." : "Update"}
          </button>

          <button
            type="button"
            onClick={close}
            disabled={modalLoading}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 px-5 py-2 rounded-lg text-white cursor-pointer transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
