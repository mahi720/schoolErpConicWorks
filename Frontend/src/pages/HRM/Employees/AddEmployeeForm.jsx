import React from "react";
import { Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddEmployee() {
  const navigate = useNavigate();

  const Input = ({ label, required, type = "text" }) => (
    <div>
      <label className="text-gray-300">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={type}
        placeholder="type here..."
        className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none"
      />
    </div>
  );

  const Select = ({ label, required }) => (
    <div>
      <label className="text-gray-300">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <select className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full cursor-pointer">
        <option>Select an option</option>
      </select>
    </div>
  );

  const TextArea = ({ label, required }) => (
    <div>
      <label className="text-gray-300">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <textarea
        placeholder="type here..."
        className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full h-20 outline-none resize-none"
      />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Basic Details */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        <h2 className="text-xl text-white font-semibold">Basic Details</h2>

        <hr className="border-gray-800" />

        <div className="grid grid-cols-3 gap-6">
          <Input label="Full Name" required />

          <Input label="Nick Name/Code" />

          <Input type="number" label="Phone Number" required />

          <Input type="email" label="Email Id" required />

          <Input label="Date of Birth" type="date" required />

          <Select label="State" />

          <Input label="City" />

          <Input label="District" />

          <Input type="number" label="Pincode" />

          <TextArea label="Address" />

          <TextArea label="Qualification" required />
        </div>
      </div>

      {/* Company Details */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        <h2 className="text-xl text-white font-semibold">Company Details</h2>

        <hr className="border-gray-800" />

        <div className="grid grid-cols-3 gap-6">
          <Select label="Department" required />

          <Select label="Designation" required />

          <Select label="Nature of Appointment" required />

          <Input label="Joining Date" type="date" required />

          <Select label="Pay Band" required />

          <Input label="Bank Name" />

          <Input type="number" label="Bank Account Number" />

          <Input label="IFSC Code" />

          <Input label="PAN Number" />

          <Input label="UAN Number" />

          <Input type="number" label="Aadhar Number" />

          <TextArea label="Job Role Description" required />
        </div>
      </div>

      {/* Save */}

      <div className="flex justify-end gap-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-red-500 hover:bg-red-600 px-8 py-3 rounded-lg text-white flex gap-2 cursor-pointer"
        >
          <X size={18} className="mt-1" />
          Close
        </button>

        <button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-lg text-white flex gap-2 cursor-pointer">
          <Save size={18} className="mt-1" />
          Save
        </button>
      </div>
    </div>
  );
}
