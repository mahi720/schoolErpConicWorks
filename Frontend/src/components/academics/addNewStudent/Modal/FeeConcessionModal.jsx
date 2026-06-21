import React, { useState } from "react";
import { X } from "lucide-react";

export default function FeeConcessionModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    academicYear: "",
    concessionType: "",
    term: "",
    amount: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log(formData);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 className="text-2xl font-semibold text-white">
            Update Student's Fee Concession
          </h2>

          <button onClick={onClose}>
            <X
              size={24}
              className="text-gray-400 hover:text-white cursor-pointer"
            />
          </button>
        </div>

        {/* Body */}

        <div className="p-6 space-y-5">
          <div className="text-red-400 text-sm leading-relaxed">
            <p>
              This concession amount is equally divided by 2 parts and is minus
              in both the terms. (eg: 1000/2 = 500, term 1 = termamount - 500,
              term 2 = termamount - 500)
            </p>

            <p className="mt-4 underline">
              Note: To avoid any calculation issue Please give concession before
              term 1 Fee Payment.
            </p>
          </div>

          {/* Academic Year */}

          <div>
            <label className="block text-gray-300 mb-2">
              Academic Year
              <span className="text-red-500"> *</span>
            </label>

            <select
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
            >
              <option value="">Select Academic Year</option>

              <option>2025-26</option>

              <option>2026-27</option>
            </select>
          </div>

          {/* Concession Type */}

          <div>
            <label className="block text-gray-300 mb-2">
              Concession Type
              <span className="text-red-500"> *</span>
            </label>

            <select
              name="concessionType"
              value={formData.concessionType}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 cursor-pointer rounded-xl p-3 text-white"
            >
              <option value="">Select Concession Type</option>

              <option>Sibling</option>

              <option>Staff Child</option>

              <option>Scholarship</option>

              <option>Special</option>
            </select>
          </div>

          {/* Term */}

          <div>
            <label className="block text-gray-300 mb-2">
              Term
              <span className="text-red-500"> *</span>
            </label>

            <select
              name="term"
              value={formData.term}
              onChange={handleChange}
              className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
            >
              <option value="">Select Term</option>

              <option>Term 1</option>

              <option>Term 2</option>

              <option>Both Terms</option>
            </select>
          </div>

          {/* Amount */}

          <div>
            <label className="block text-gray-300 mb-2">
              Concession in Total Amount
            </label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Total Amount"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
            />
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleSubmit}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white cursor-pointer"
            >
              Update Informations
            </button>

            <button
              onClick={onClose}
              className="px-5 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
