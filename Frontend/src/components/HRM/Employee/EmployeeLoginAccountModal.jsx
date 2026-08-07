import React, { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

import { useEmployeeStore } from "../../../store/HRM/employee/employeeStore";

import { employeeLoginAccountSchema } from "../../../validations/HRM/employee/employeeValidation";

const initialForm = {
  email: "",
  role: "",
  password: "",
  confirmPassword: "",
};

export default function EmployeeLoginAccountModal({ open, close, employee }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const createLoginAccount = useEmployeeStore(
    (state) => state.createLoginAccount,
  );

  const modalLoading = useEmployeeStore((state) => state.modalLoading);

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm({
      email: employee?.email || "",
      role: "",
      password: "",
      confirmPassword: "",
    });

    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [open, employee]);

  if (!open || !employee) {
    return null;
  }

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

  const handleSubmit = async () => {
    const validation = employeeLoginAccountSchema.safeParse(form);

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

    const success = await createLoginAccount(employee.slug, {
      email: validation.data.email,

      role: validation.data.role,

      password: validation.data.password,
    });

    if (success) {
      close();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 w-full max-w-[550px] rounded-xl border border-gray-700">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <div>
            <h2 className="text-xl text-white">Create Login Account</h2>

            <p className="text-sm text-gray-400 mt-1">
              {employee.fullName} ({employee.employeeId})
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={modalLoading}
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-gray-300">
              Login Email
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Login Email"
              className={`mt-2 bg-gray-800 border rounded-lg px-4 py-3 text-white w-full outline-none ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-700 focus:border-indigo-500"
              }`}
            />

            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-gray-300">
              Role
              <span className="text-red-500"> *</span>
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={`mt-2 bg-gray-800 border rounded-lg px-4 py-3 text-white w-full outline-none cursor-pointer ${
                errors.role
                  ? "border-red-500"
                  : "border-gray-700 focus:border-indigo-500"
              }`}
            >
              <option value="">Select Role</option>

              <option value="SCHOOL_ADMIN">School Admin</option>

              <option value="TEACHER">Teacher</option>

              <option value="ACCOUNTANT">Accountant</option>

              <option value="LIBRARIAN">Librarian</option>

              <option value="HR">HR</option>
            </select>

            {errors.role && (
              <p className="text-red-400 text-sm mt-1">{errors.role}</p>
            )}
          </div>

          <div>
            <label className="text-gray-300">
              Password
              <span className="text-red-500"> *</span>
            </label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className={`bg-gray-800 border rounded-lg px-4 py-3 pr-12 text-white w-full outline-none ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-700 focus:border-indigo-500"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="text-gray-300">
              Confirm Password
              <span className="text-red-500"> *</span>
            </label>

            <div className="relative mt-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Enter Confirm Password"
                className={`bg-gray-800 border rounded-lg px-4 py-3 pr-12 text-white w-full outline-none ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-700 focus:border-indigo-500"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={close}
            disabled={modalLoading}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 px-5 py-2 rounded-lg text-white cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={modalLoading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-5 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer"
          >
            {modalLoading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <KeyRound size={17} />
            )}

            {modalLoading ? "Creating..." : "Create Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
