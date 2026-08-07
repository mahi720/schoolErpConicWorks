import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useEmployeeStore } from "../../../store/HRM/employee/employeeStore";
import { useDepartmentStore } from "../../../store/HRM/settings/department/departmentStore";
import { useDesignationStore } from "../../../store/HRM/settings/designation/designationStore";
import { usePayBandStore } from "../../../store/HRM/settings/payBand/payBandStore";

import {
  employeeSchema,
  employeeNatureOptions,
  buildEmployeePayload,
} from "../../../validations/HRM/employee/employeeValidation";

const initialForm = {
  fullName: "",
  employeeCode: "",
  phoneNumber: "",
  email: "",
  dateOfBirth: "",
  state: "",
  city: "",
  district: "",
  pincode: "",
  address: "",
  qualification: "",

  department: "",
  designation: "",
  natureOfAppointment: "",
  joiningDate: "",
  payBand: "",

  bankName: "",
  bankAccountNumber: "",
  ifscCode: "",
  panNumber: "",
  uanNumber: "",
  aadharNumber: "",

  jobRoleDescription: "",

  isDrfApplicable: false,

  createLogin: false,
  loginEmail: "",
  loginRole: "",
  password: "",
  confirmPassword: "",
};

const stateOptions = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

function InputField({
  label,
  name,
  value,
  error,
  onChange,
  required = false,
  type = "text",
  placeholder = "",
  inputMode,
  maxLength,
}) {
  return (
    <div>
      <label className="text-gray-300">
        {label}

        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        className={`mt-2 bg-gray-800 border rounded-lg px-4 py-3 text-white w-full outline-none transition ${
          error ? "border-red-500" : "border-gray-700 focus:border-indigo-500"
        }`}
      />

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  error,
  onChange,
  required = false,
  placeholder = "Select an option",
  options = [],
  disabled = false,
}) {
  return (
    <div>
      <label className="text-gray-300">
        {label}

        {required && <span className="text-red-500"> *</span>}
      </label>

      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        className={`mt-2 bg-gray-800 border rounded-lg px-4 py-3 text-white w-full outline-none cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? "border-red-500" : "border-gray-700 focus:border-indigo-500"
        }`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => {
          const optionValue =
            typeof option === "string"
              ? option
              : option.value || option.slug || option.name || "";

          const optionLabel =
            typeof option === "string"
              ? option
              : option.label || option.name || optionValue;

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  error,
  onChange,
  required = false,
  placeholder = "",
}) {
  return (
    <div>
      <label className="text-gray-300">
        {label}

        {required && <span className="text-red-500"> *</span>}
      </label>

      <textarea
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-2 bg-gray-800 border rounded-lg px-4 py-3 text-white w-full h-20 outline-none resize-none transition ${
          error ? "border-red-500" : "border-gray-700 focus:border-indigo-500"
        }`}
      />

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default function AddEmployee() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const createEmployee = useEmployeeStore((state) => state.createEmployee);
  const submitLoading = useEmployeeStore((state) => state.submitLoading);

  const departments = useDepartmentStore((state) => state.departments || []);
  const fetchDepartments = useDepartmentStore(
    (state) => state.fetchDepartments,
  );

  const designations = useDesignationStore((state) => state.designations || []);
  const fetchDesignations = useDesignationStore(
    (state) => state.fetchDesignations,
  );

  const payBands = usePayBandStore((state) => state.payBands || []);
  const fetchPayBands = usePayBandStore((state) => state.fetchPayBands);

  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
    fetchPayBands();
  }, [fetchDepartments, fetchDesignations, fetchPayBands]);

  const filteredDesignations = useMemo(() => {
    if (!form.department) {
      return [];
    }

    return designations.filter((item) => {
      const departmentName =
        item?.department?.departmentName ||
        item?.departmentName ||
        item?.department ||
        "";

      return departmentName === form.department;
    });
  }, [designations, form.department]);

  const departmentOptions = useMemo(() => {
    return departments
      .filter((item) => item.isActive !== false)
      .map((item) => ({
        label: item.departmentName,
        value: item.departmentName,
      }));
  }, [departments]);

  const designationOptions = useMemo(() => {
    return filteredDesignations
      .filter((item) => item.isActive !== false)
      .map((item) => ({
        label: item.designationName,
        value: item.designationName,
      }));
  }, [filteredDesignations]);

  const payBandOptions = useMemo(() => {
    return payBands
      .filter((item) => item.isActive !== false)
      .map((item) => ({
        label: item.payBandName,
        value: item.payBandName,
      }));
  }, [payBands]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }

      return {
        ...prev,
        [name]: "",
      };
    });
  };

  const handleDepartmentChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      department: value,
      designation: "",
    }));

    setErrors((prev) => ({
      ...prev,
      department: "",
      designation: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = employeeSchema.safeParse({
      ...form,
      nickName: "",
    });

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

    setErrors({});

    const payload = buildEmployeePayload({
      ...validation.data,

      nickName: "",

      createLogin: false,

      loginEmail: "",
      loginRole: "",
      password: "",
      confirmPassword: "",
    });

    const success = await createEmployee(payload);

    if (!success) {
      return;
    }

    setForm(initialForm);
    navigate("/hrm/employees");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        <h2 className="text-xl text-white font-semibold">Basic Details</h2>

        <hr className="border-gray-800" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <InputField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            error={errors.fullName}
            onChange={handleChange}
            required
            placeholder="Enter Full Name"
          />

          <InputField
            label="Employee Code"
            name="employeeCode"
            value={form.employeeCode}
            error={errors.employeeCode}
            onChange={handleChange}
            placeholder="Enter Employee Code"
          />

          <InputField
            label="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            error={errors.phoneNumber}
            onChange={handleChange}
            required
            type="text"
            inputMode="numeric"
            maxLength={15}
            placeholder="Enter Phone Number"
          />

          <InputField
            label="Email Id"
            name="email"
            value={form.email}
            error={errors.email}
            onChange={handleChange}
            required
            type="email"
            placeholder="Enter Email Id"
          />

          <InputField
            label="Date of Birth"
            name="dateOfBirth"
            value={form.dateOfBirth}
            error={errors.dateOfBirth}
            onChange={handleChange}
            required
            type="date"
          />

          <SelectField
            label="State"
            name="state"
            value={form.state}
            error={errors.state}
            onChange={handleChange}
            placeholder="Select State"
            options={stateOptions}
          />

          <InputField
            label="City"
            name="city"
            value={form.city}
            error={errors.city}
            onChange={handleChange}
            placeholder="Enter City"
          />

          <InputField
            label="District"
            name="district"
            value={form.district}
            error={errors.district}
            onChange={handleChange}
            placeholder="Enter District"
          />

          <InputField
            label="Pincode"
            name="pincode"
            value={form.pincode}
            error={errors.pincode}
            onChange={handleChange}
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter Pincode"
          />

          <TextAreaField
            label="Address"
            name="address"
            value={form.address}
            error={errors.address}
            onChange={handleChange}
            placeholder="Enter Address"
          />

          <TextAreaField
            label="Qualification"
            name="qualification"
            value={form.qualification}
            error={errors.qualification}
            onChange={handleChange}
            required
            placeholder="Enter Qualification"
          />
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        <h2 className="text-xl text-white font-semibold">Company Details</h2>

        <hr className="border-gray-800" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <SelectField
            label="Department"
            name="department"
            value={form.department}
            error={errors.department}
            onChange={handleDepartmentChange}
            required
            placeholder="Select Department"
            options={departmentOptions}
          />

          <SelectField
            label="Designation"
            name="designation"
            value={form.designation}
            error={errors.designation}
            onChange={handleChange}
            required
            placeholder={
              form.department ? "Select Designation" : "Select Department First"
            }
            options={designationOptions}
            disabled={!form.department}
          />

          <SelectField
            label="Nature of Appointment"
            name="natureOfAppointment"
            value={form.natureOfAppointment}
            error={errors.natureOfAppointment}
            onChange={handleChange}
            required
            placeholder="Select Nature of Appointment"
            options={employeeNatureOptions}
          />

          <InputField
            label="Joining Date"
            name="joiningDate"
            value={form.joiningDate}
            error={errors.joiningDate}
            onChange={handleChange}
            required
            type="date"
          />

          <SelectField
            label="Pay Band"
            name="payBand"
            value={form.payBand}
            error={errors.payBand}
            onChange={handleChange}
            required
            placeholder="Select Pay Band"
            options={payBandOptions}
          />

          <InputField
            label="Bank Name"
            name="bankName"
            value={form.bankName}
            error={errors.bankName}
            onChange={handleChange}
            placeholder="Enter Bank Name"
          />

          <InputField
            label="Bank Account Number"
            name="bankAccountNumber"
            value={form.bankAccountNumber}
            error={errors.bankAccountNumber}
            onChange={handleChange}
            type="text"
            inputMode="numeric"
            maxLength={30}
            placeholder="Enter Bank Account Number"
          />

          <InputField
            label="IFSC Code"
            name="ifscCode"
            value={form.ifscCode}
            error={errors.ifscCode}
            onChange={handleChange}
            placeholder="Enter IFSC Code"
          />

          <InputField
            label="PAN Number"
            name="panNumber"
            value={form.panNumber}
            error={errors.panNumber}
            onChange={handleChange}
            placeholder="Enter PAN Number"
          />

          <InputField
            label="UAN Number"
            name="uanNumber"
            value={form.uanNumber}
            error={errors.uanNumber}
            onChange={handleChange}
            type="text"
            inputMode="numeric"
            maxLength={12}
            placeholder="Enter UAN Number"
          />

          <InputField
            label="Aadhar Number"
            name="aadharNumber"
            value={form.aadharNumber}
            error={errors.aadharNumber}
            onChange={handleChange}
            type="text"
            inputMode="numeric"
            maxLength={12}
            placeholder="Enter Aadhar Number"
          />

          <TextAreaField
            label="Job Role Description"
            name="jobRoleDescription"
            value={form.jobRoleDescription}
            error={errors.jobRoleDescription}
            onChange={handleChange}
            required
            placeholder="Enter Job Role Description"
          />
        </div>
      </div>

      <div className="flex justify-end gap-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={submitLoading}
          className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-lg text-white flex items-center gap-2 cursor-pointer"
        >
          <X size={18} />
          Close
        </button>

        <button
          type="submit"
          disabled={submitLoading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed px-8 py-3 rounded-lg text-white flex items-center gap-2 cursor-pointer"
        >
          {submitLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}

          {submitLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
