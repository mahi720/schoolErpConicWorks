import React from "react";
import { X } from "lucide-react";

export default function AddOtherInfoModal({ open, close }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-[90%] max-w-6xl rounded-2xl border border-gray-700">
        {/* Header */}

        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">Add Student Other Information</h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        {/* Body */}

        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Student */}

          <div className="mb-6 flex flex-col">
            <label className="text-gray-400 text-sm">
              Student's Blood Group
            </label>

            <input
              placeholder="Student's Blood Group"
              className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-96"
            />
          </div>

          {/* Mother */}

          <SectionTitle title="Mother's" />

          <div className="grid grid-cols-3 gap-5 mb-6">
            <InputBox label="Mother's YOB" />
            <InputBox label="Mother's Weight" />
            <InputBox label="Mother's Height" />
            <InputBox label="Mother's Blood Group" />
            <InputBox label="Mother's Aadhar Card Number" />
          </div>

          {/* Father */}

          <SectionTitle title="Father's" />

          <div className="grid grid-cols-3 gap-5 mb-6">
            <InputBox label="Father's YOB" />
            <InputBox label="Father's Weight" />
            <InputBox label="Father's Height" />
            <InputBox label="Father's Blood Group" />
            <InputBox label="Father's Aadhar Card Number" />
          </div>

          {/* Other */}

          <SectionTitle title="Other" />

          <div className="grid grid-cols-3 gap-5">
            <InputBox label="Family Monthly Income" />
            <InputBox label="CWSN, Specify" />
          </div>
        </div>

        {/* Footer */}

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg cursor-pointer">
            Save Information
          </button>

          <button
            onClick={close}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function InputBox({ label }) {
  return (
    <div>
      <label className="text-gray-400 text-sm">{label}</label>

      <input
        placeholder={label}
        className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full"
      />
    </div>
  );
}

function SectionTitle({ title }) {
  return <h3 className="text-lg text-white mb-3">{title}</h3>;
}
