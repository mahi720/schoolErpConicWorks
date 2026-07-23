import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../../../common/Modal";
import { useStudentStore } from "../../../../store/academic/addNewStudent/studentStore";

const initialFormData = {
  aadhaarNumber: "",
  dob: "",
  placeOfBirth: "",
  caste: "",
  category: "",
  religion: "",
  gender: "",
  state: "",
  district: "",
  city: "",
  address: "",
  sats: "",
  boardRegistrationNumber: "",
  penNumber: "",
  motherTongue: "",
  secondLanguage: "",
  bpl: "",
};

const formatDateForInput = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

export default function PersonalInfoModal({
  isOpen,
  onClose,
  studentData,
  onSaved,
}) {
  const { updateStudent, submitLoading } = useStudentStore();

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!isOpen) return;

    if (studentData) {
      setFormData({
        aadhaarNumber: studentData.aadhaarNumber || "",

        dob: formatDateForInput(studentData.dob),

        placeOfBirth: studentData.placeOfBirth || "",

        caste: studentData.caste || "",

        category: studentData.category || "",

        religion: studentData.religion || "",

        gender: studentData.gender || "",

        state: studentData.state || "",

        district: studentData.district || "",

        city: studentData.city || "",

        address: studentData.address || "",

        sats: studentData.sats || "",

        boardRegistrationNumber: studentData.boardRegistrationNumber || "",

        penNumber: studentData.penNumber || "",

        motherTongue: studentData.motherTongue || "",

        secondLanguage: studentData.secondLanguage || "",

        bpl: studentData.bpl || "",
      });

      return;
    }

    setFormData(initialFormData);
  }, [isOpen, studentData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    if (submitLoading) return;

    setFormData(initialFormData);
    onClose();
  };

  const handleSubmit = async () => {
    if (!studentData?.slug) {
      toast.error("Student data not found");
      return;
    }

    if (formData.aadhaarNumber && !/^\d{12}$/.test(formData.aadhaarNumber)) {
      toast.error("Aadhaar Number must be exactly 12 digits");

      return;
    }

    if (!formData.dob) {
      toast.error("Date of Birth is required");

      return;
    }

    const success = await updateStudent(studentData.slug, {
      aadhaarNumber: formData.aadhaarNumber.trim(),

      dob: formData.dob,

      placeOfBirth: formData.placeOfBirth.trim(),

      caste: formData.caste.trim(),

      category: formData.category,

      religion: formData.religion.trim(),

      gender: formData.gender,

      state: formData.state.trim(),

      district: formData.district.trim(),

      city: formData.city.trim(),

      address: formData.address.trim(),

      sats: formData.sats.trim(),

      boardRegistrationNumber: formData.boardRegistrationNumber.trim(),

      penNumber: formData.penNumber.trim(),

      motherTongue: formData.motherTongue.trim(),

      secondLanguage: formData.secondLanguage.trim(),

      bpl: formData.bpl,
    });

    if (!success) return;

    await onSaved?.();

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Personal Information"
      width="max-w-4xl"
    >
      <div className="max-h-[65vh] overflow-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Aadhaar Number */}
          <div>
            <label className="block text-gray-400 mb-2">Aadhaar Number</label>

            <input
              type="text"
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleChange}
              maxLength={12}
              placeholder="Enter Aadhaar Number"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-400 mb-2">Date Of Birth</label>

            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              max={new Date().toISOString().slice(0, 10)}
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 cursor-pointer"
            />
          </div>

          {/* Place of Birth */}
          <div>
            <label className="block text-gray-400 mb-2">Place Of Birth</label>

            <input
              type="text"
              name="placeOfBirth"
              value={formData.placeOfBirth}
              onChange={handleChange}
              placeholder="Enter Place Of Birth"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Caste */}
          <div>
            <label className="block text-gray-400 mb-2">Caste</label>

            <input
              type="text"
              name="caste"
              value={formData.caste}
              onChange={handleChange}
              placeholder="Enter Caste"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-400 mb-2">Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="">Select Category</option>

              <option value="General">General</option>

              <option value="OBC">OBC</option>

              <option value="SC">SC</option>

              <option value="ST">ST</option>
            </select>
          </div>

          {/* Religion */}
          <div>
            <label className="block text-gray-400 mb-2">Religion</label>

            <input
              type="text"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              placeholder="Enter Religion"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-400 mb-2">Gender</label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="">Select Gender</option>

              <option value="Male">Male</option>

              <option value="Female">Female</option>

              <option value="Other">Other</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-gray-400 mb-2">State</label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter State"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* District */}
          <div>
            <label className="block text-gray-400 mb-2">District</label>

            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="Enter District"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-400 mb-2">City</label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter City"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* SATS */}
          <div>
            <label className="block text-gray-400 mb-2">SATS</label>

            <input
              type="text"
              name="sats"
              value={formData.sats}
              onChange={handleChange}
              placeholder="Enter SATS"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Board Registration Number */}
          <div>
            <label className="block text-gray-400 mb-2">Board Reg. No.</label>

            <input
              type="text"
              name="boardRegistrationNumber"
              value={formData.boardRegistrationNumber}
              onChange={handleChange}
              placeholder="Enter Board Registration Number"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* PEN Number */}
          <div>
            <label className="block text-gray-400 mb-2">PEN No.</label>

            <input
              type="text"
              name="penNumber"
              value={formData.penNumber}
              onChange={handleChange}
              placeholder="Enter PEN Number"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Mother Tongue */}
          <div>
            <label className="block text-gray-400 mb-2">Mother Tongue</label>

            <input
              type="text"
              name="motherTongue"
              value={formData.motherTongue}
              onChange={handleChange}
              placeholder="Enter Mother Tongue"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Second Language */}
          <div>
            <label className="block text-gray-400 mb-2">Second Language</label>

            <input
              type="text"
              name="secondLanguage"
              value={formData.secondLanguage}
              onChange={handleChange}
              placeholder="Enter Second Language"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* BPL */}
          <div>
            <label className="block text-gray-400 mb-2">BPL</label>

            <select
              name="bpl"
              value={formData.bpl}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="">Select BPL Status</option>

              <option value="Yes">Yes</option>

              <option value="No">No</option>
            </select>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-gray-400 mb-2">Address</label>

            <textarea
              rows={4}
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Address"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={handleClose}
          disabled={submitLoading}
          className="px-4 py-2 border border-gray-700 rounded-xl text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitLoading || !studentData?.slug}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white cursor-pointer flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitLoading && <Loader2 size={16} className="animate-spin" />}
          Save
        </button>
      </div>
    </Modal>
  );
}
