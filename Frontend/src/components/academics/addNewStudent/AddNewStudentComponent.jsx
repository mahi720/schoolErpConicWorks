import React, { useState } from "react";
import { X } from "lucide-react";

export default function AddStudentModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    admissionNumber: "",
    admissionDate: "",
    academicYear: "",
    board: "",
    admissionClass: "",
    currentClass: "",
    sponsorshipType: "",
    sponsorshipRemarks: "",

    studentName: "",
    fatherName: "",
    motherName: "",
    aadhaarNumber: "",
    dob: "",
    placeOfBirth: "",
    caste: "",
    category: "",
    religion: "",
    gender: "",
    sats: "",
    rollNo: "",

    phone: "",
    email: "",
    state: "",
    district: "",
    city: "",
    address: "",
    motherTongue: "",
    secondLanguage: "",
    bloodGroup: "",

    apaarId: "",
    penNumber: "",

    previousSchool: "",
    schoolAddress: "",
    previousBoard: "",
    previousResult: "",
  });

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 w-full max-w-7xl rounded-2xl border border-gray-800 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            Add New Student Information
          </h2>

          <button onClick={onClose}>
            <X className="text-gray-400 cursor-pointer" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admission Number */}
            <div>
              <label className="block text-gray-300 mb-2">
                Admission Number <span className="text-red-400"> *</span>
              </label>

              <input
                type="text"
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={handleChange}
                placeholder="Admission Number"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-gray-300 mb-2">
                Student Name <sapn className="text-red-400"> *</sapn>
              </label>

              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Student Name"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-300 mb-2">Phone / Mobile</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            {/* Admission Date */}
            <div>
              <label className="block text-gray-300 mb-2">
                Admission Date <span className="text-red-400"> *</span>
              </label>

              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            {/* Father Name */}
            <div>
              <label className="block text-gray-300 mb-2">
                Father Name <span className="text-red-400"> *</span>{" "}
              </label>

              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="Father Name"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 mb-2">Email ID</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-gray-300 mb-2">
                Academic Year <span className="text-red-400"> *</span>
              </label>

              <select
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
              >
                <option value="">--Academic Year--</option>
                <option>2025-26</option>
                <option>2026-27</option>
              </select>
            </div>

            {/* Mother Name */}
            <div>
              <label className="block text-gray-300 mb-2">
                Mother Name <span className="text-red-400"> *</span>{" "}
              </label>

              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                placeholder="Mother Name"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-gray-300 mb-2">State</label>

              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 cursor-pointer text-white"
              >
                <option value="">Select State</option>
                <option>Chhattisgarh</option>
                <option>Madhya Pradesh</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Board <span className="text-red-400"> *</span>
              </label>

              <select
                name="board"
                value={formData.board}
                onChange={handleChange}
                className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
              >
                <option value="">Select Board</option>
                <option>CBSE</option>
                <option>BSEB</option>
                <option>CGBSE</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Aadhar Card Number
              </label>

              <input
                type="number"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                placeholder="Aadhar Card Number"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                District <span className="text-red-400"> *</span>
              </label>

              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="District"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Admission Class <span className="text-red-400"> *</span>
              </label>

              <select
                name="admissionClass"
                value={formData.admissionClass}
                onChange={handleChange}
                className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
              >
                <option value="">Select Admission Class</option>
                <option>Nursery</option>
                <option>LKG</option>
                <option>UKG</option>
                <option>I</option>
                <option>II</option>
                <option>III</option>
                <option>IV</option>
                <option>V</option>
                <option>VI</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">DOB</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="Date of Birth"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Current Class <span className="text-red-400"> *</span>
              </label>

              <select
                name="currentClass"
                value={formData.currentClass}
                onChange={handleChange}
                className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
              >
                <option value="">Select Current Class</option>
                <option>Nursery</option>
                <option>LKG</option>
                <option>UKG</option>
                <option>I</option>
                <option>II</option>
                <option>III</option>
                <option>IV</option>
                <option>V</option>
                <option>VI</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Place of Birth</label>
              <input
                type="text"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleChange}
                placeholder="Place of Birth"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Communication address <span className="text-red-400"> *</span>
              </label>
              <textarea
                type="text"
                name="communicationAddress"
                value={formData.communicationAddress}
                onChange={handleChange}
                placeholder="Communication Address"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Sponsership Type
              </label>

              <select
                name="sponsorshipType"
                value={formData.sponsorshipType}
                onChange={handleChange}
                className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
              >
                <option value="">Select Sponsorship Type</option>
                <option>Self/Parent</option>
                <option>RTE</option>
                <option>Others</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2"> Caste </label>
              <input
                type="text"
                name="caste"
                value={formData.caste}
                onChange={handleChange}
                placeholder="Caste"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Category <span className="text-red-400"> *</span>
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
              >
                <option value="">Select Categroy</option>
                <option>General</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Mother Tongue </label>
              <input
                type="text"
                name="motherTongue"
                value={formData.motherTongue}
                onChange={handleChange}
                placeholder="Mother Tongue"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Sponsership Remarks
              </label>
              <textarea
                type="text"
                name="sponsorshipRemarks"
                value={formData.sponsorshipRemarks}
                onChange={handleChange}
                placeholder="Sponsorship Remarks"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Religion <span className="text-red-400"> *</span>
              </label>

              <select
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
              >
                <option value="">Select Religion</option>
                <option>Hindu</option>
                <option>Islam</option>
                <option>Christian</option>
                <option>Jain</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Gender <span className="text-red-400"> *</span>
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Second Language
              </label>
              <input
                type="text"
                name="secondLanguage"
                value={formData.secondLanguage}
                onChange={handleChange}
                placeholder="Second Language"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">APAAR ID </label>
              <input
                type="text"
                name="apaarId"
                value={formData.apaarId}
                onChange={handleChange}
                placeholder="APAAR ID"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">PEN Number </label>
              <input
                type="text"
                name="penNumber"
                value={formData.penNumber}
                onChange={handleChange}
                placeholder="PEN Number"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">SATS </label>
              <input
                type="text"
                name="sats"
                value={formData.sats}
                onChange={handleChange}
                placeholder="SATS"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Roll No </label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="Roll No"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Blood Group</label>

              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white"
              >
                <option value="">Select Blood Group</option>
                <option>O+</option>
                <option>O-</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>
          </div>

          {/* Previous School Info */}
          <div className="mt-8 border-t border-gray-800 pt-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Previous School Information
              <span className="text-red-400 text-sm ml-2">(If Applicable)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                name="previousSchool"
                placeholder="Previous School"
                value={formData.previousSchool}
                onChange={handleChange}
                className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />

              <textarea
                name="schoolAddress"
                placeholder="School Address"
                value={formData.schoolAddress}
                onChange={handleChange}
                className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />

              <select
                name="previousBoard"
                value={formData.previousBoard}
                onChange={handleChange}
                className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              >
                <option>Previous Board</option>
                <option>CBSE</option>
                <option>State Board</option>
                <option>ICSE</option>
                <option>Others</option>
              </select>

              <select
                name="previousResult"
                value={formData.previousResult}
                onChange={handleChange}
                className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              >
                <option>--Previous Result--</option>
                <option>Pass</option>
                <option>Fail</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-gray-700 text-white cursor-pointer hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-3 rounded-xl bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700"
          >
            Save Information
          </button>
        </div>
      </div>
    </div>
  );
}
