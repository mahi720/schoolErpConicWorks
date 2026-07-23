import React, { useEffect, useMemo, useState } from "react";

import { Loader2, X } from "lucide-react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { studentSchema } from "../../../validations/academic/addNewStudent/studentSchema";

import { useStudentStore } from "../../../store/academic/addNewStudent/studentStore";
import { useBoardStore } from "../../../store/master/board/boardStore";
import { useSessionStore } from "../../../store/master/session/sessionStore";
import { useClassStore } from "../../../store/master/class/classStore";
import toast from "react-hot-toast";

const defaultValues = {
  admissionNumber: "",
  admissionDate: "",
  admissionSession: "",
  currentSession: "",
  board: "",
  admissionClass: "",
  currentClass: "",

  sponsorshipType: "",
  sponsorshipRemarks: "",

  studentName: "",
  fatherName: "",
  motherName: "",
  gender: "",
  dob: "",
  placeOfBirth: "",

  aadhaarNumber: "",
  apaarId: "",
  penNumber: "",
  sats: "",

  caste: "",
  category: "",
  religion: "",

  phone: "",
  motherPhone: "",
  email: "",

  state: "",
  district: "",
  city: "",
  address: "",

  motherTongue: "",
  secondLanguage: "",
  bloodGroup: "",
  profileImage: "",

  previousSchool: "",
  schoolAddress: "",
  previousBoard: "",
  previousResult: "",
};

function FieldError({ error }) {
  if (!error) return null;

  return <p className="mt-1 text-sm text-red-400">{error.message}</p>;
}

const getStudentImageUrl = (imagePath) => {
  if (!imagePath) return "";

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  return `${serverUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export default function AddStudentModal({
  isOpen,
  onClose,
  editStudent = null,
  onSaved,
}) {
  const { submitLoading, createStudent, updateStudent } = useStudentStore();

  const { boards, loading: boardLoading, fetchBoards } = useBoardStore();

  const {
    sessions,
    loading: sessionLoading,
    fetchSessions,
  } = useSessionStore();

  const { classes, loading: classLoading, fetchClasses } = useClassStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues,
  });

  const selectedBoard = watch("board");
  const admissionSession = watch("admissionSession");

  const currentSession = watch("currentSession");

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  /*
   * Initial board/session fetch
   */
  useEffect(() => {
    if (!isOpen) return;

    fetchBoards();
    fetchSessions();
  }, [isOpen, fetchBoards, fetchSessions]);

  /*
   * Board select/change par classes fetch.
   * Class master board-wise hai, session-wise nahi.
   */
  useEffect(() => {
    if (!isOpen || !selectedBoard) return;

    fetchClasses({
      board: selectedBoard,
    });
  }, [isOpen, selectedBoard, fetchClasses]);

  /*
   * Create/edit form reset
   */
  useEffect(() => {
    if (!isOpen) return;

    if (editStudent) {
      const previousSchoolInfo = editStudent.previousSchoolInfo || {};

      setSelectedImage(null);

      setImagePreview(getStudentImageUrl(editStudent.profileImage));
      reset({
        admissionNumber: editStudent.admissionNumber || "",

        admissionDate: editStudent.admissionDate
          ? String(editStudent.admissionDate).slice(0, 10)
          : "",

        admissionSession: editStudent.admissionSession || "",

        currentSession: editStudent.currentSession || "",

        board: editStudent.board || "",

        admissionClass: editStudent.admissionClass || "",

        currentClass: editStudent.currentClass || "",

        sponsorshipType: editStudent.sponsorshipType || "",

        sponsorshipRemarks: editStudent.sponsorshipRemarks || "",

        studentName: editStudent.studentName || "",

        fatherName: editStudent.fatherName || "",

        motherName: editStudent.motherName || "",

        gender: editStudent.gender || "",

        dob: editStudent.dob ? String(editStudent.dob).slice(0, 10) : "",

        placeOfBirth: editStudent.placeOfBirth || "",

        aadhaarNumber: editStudent.aadhaarNumber || "",

        apaarId: editStudent.apaarId || "",

        penNumber: editStudent.penNumber || "",

        sats: editStudent.sats || "",

        caste: editStudent.caste || "",

        category: editStudent.category || "",

        religion: editStudent.religion || "",

        phone: editStudent.phone || "",

        motherPhone: editStudent.motherPhone || "",

        email: editStudent.email || "",

        state: editStudent.state || "",

        district: editStudent.district || "",

        city: editStudent.city || "",

        address: editStudent.address || "",

        motherTongue: editStudent.motherTongue || "",

        secondLanguage: editStudent.secondLanguage || "",

        bloodGroup: editStudent.bloodGroup || "",

        previousSchool: editStudent.previousSchool || "",

        schoolAddress: editStudent.schoolAddress || "",

        previousBoard: editStudent.previousBoard || "",

        previousResult: editStudent.previousResult || "",

        profileImage: null,

        previousSchool: previousSchoolInfo.previousSchool || "",

        schoolAddress: previousSchoolInfo.schoolAddress || "",

        previousBoard: previousSchoolInfo.previousBoard || "",

        previousResult: previousSchoolInfo.previousResult || "",
      });

      return;
    }

    setSelectedImage(null);
    setImagePreview("");

    const activeSession =
      sessions.find(
        (item) => item.status === "active" && item.isActive !== false,
      ) || sessions[0];

    reset({
      ...defaultValues,

      admissionSession: activeSession?.name || "",

      currentSession: activeSession?.name || "",

      profileImage: null,

      board:
        boards.find(
          (item) => item.status !== "inactive" && item.isActive !== false,
        )?.title || "",
    });
  }, [isOpen, editStudent, sessions, boards, reset]);

  /*
   * Admission session खाली हो aur current selected ho
   * to admission session auto-fill नहीं करेंगे.
   * Dono independent fields hain.
   */
  useEffect(() => {
    if (!editStudent && currentSession && !admissionSession) {
      setValue("admissionSession", currentSession);
    }
  }, [editStudent, currentSession, admissionSession, setValue]);

  const activeBoards = useMemo(
    () =>
      boards.filter(
        (item) => item.status !== "inactive" && item.isActive !== false,
      ),
    [boards],
  );

  const availableSessions = useMemo(
    () => sessions.filter((item) => item.isActive !== false),
    [sessions],
  );

  const availableClasses = useMemo(
    () =>
      classes.filter(
        (item) => item.isActive !== false && item.status !== "inactive",
      ),
    [classes],
  );

  const handleClose = () => {
    if (submitLoading) return;

    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    const textFields = {
      admissionNumber: data.admissionNumber?.trim(),

      admissionDate: data.admissionDate,

      admissionSession: data.admissionSession,

      currentSession: data.currentSession,

      board: data.board,

      admissionClass: data.admissionClass,

      currentClass: data.currentClass,

      sponsorshipType: data.sponsorshipType?.trim() || "",

      sponsorshipRemarks: data.sponsorshipRemarks?.trim() || "",

      studentName: data.studentName?.trim(),

      fatherName: data.fatherName?.trim(),

      motherName: data.motherName?.trim(),

      gender: data.gender,

      dob: data.dob,

      placeOfBirth: data.placeOfBirth?.trim() || "",

      aadhaarNumber: data.aadhaarNumber?.trim() || "",

      apaarId: data.apaarId?.trim() || "",

      penNumber: data.penNumber?.trim() || "",

      sats: data.sats?.trim() || "",

      caste: data.caste?.trim() || "",

      category: data.category?.trim() || "",

      religion: data.religion?.trim() || "",

      phone: data.phone?.trim() || "",

      motherPhone: data.motherPhone?.trim() || "",

      email: data.email?.trim() || "",

      state: data.state?.trim() || "",

      district: data.district?.trim() || "",

      city: data.city?.trim() || "",

      address: data.address?.trim() || "",

      motherTongue: data.motherTongue?.trim() || "",

      secondLanguage: data.secondLanguage?.trim() || "",

      bloodGroup: data.bloodGroup?.trim() || "",

      previousSchool: data.previousSchool?.trim() || "",

      schoolAddress: data.schoolAddress?.trim() || "",

      previousBoard: data.previousBoard?.trim() || "",

      previousResult: data.previousResult?.trim() || "",
    };

    Object.entries(textFields).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    if (selectedImage) {
      formData.append("profileImage", selectedImage);
    }

    const success = editStudent
      ? await updateStudent(editStudent.slug, formData)
      : await createStudent(formData);

    if (!success) return;

    onSaved?.();
    handleClose();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG and WEBP images are allowed");
      event.target.value = "";
      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Profile image must be less than 5 MB");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview((previousUrl) => {
      if (previousUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previousUrl);
      }

      return previewUrl;
    });

    setValue("profileImage", file, {
      shouldValidate: true,
    });
  };

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900 w-full max-w-7xl rounded-2xl border border-gray-800 max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editStudent
                ? "Update Student Information"
                : "Add New Student Information"}
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {editStudent
                ? "Update student admission and personal details"
                : "Enter student admission and personal details"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer disabled:opacity-60"
          >
            <X className="text-gray-400" />
          </button>
        </div>

        {/* Body — vertical + horizontal custom scrollbar */}
        <div className="p-6 overflow-auto custom-scrollbar">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Admission Number */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Admission Number
                  <span className="text-red-400"> *</span>
                </label>

                <input
                  type="text"
                  {...register("admissionNumber")}
                  placeholder="Admission Number"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.admissionNumber} />
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Student Name
                  <span className="text-red-400"> *</span>
                </label>

                <input
                  type="text"
                  {...register("studentName")}
                  placeholder="Student Name"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.studentName} />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Phone / Mobile
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  {...register("phone")}
                  placeholder="10 digit phone number"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.phone} />
              </div>

              {/* Admission Date */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Admission Date
                  <span className="text-red-400"> *</span>
                </label>

                <input
                  type="date"
                  {...register("admissionDate")}
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.admissionDate} />
              </div>

              {/* Father Name */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Father Name
                  <span className="text-red-400"> *</span>
                </label>

                <input
                  type="text"
                  {...register("fatherName")}
                  placeholder="Father Name"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.fatherName} />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 mb-2">Email ID</label>

                <input
                  type="email"
                  {...register("email")}
                  placeholder="Email"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.email} />
              </div>

              {/* Admission Session */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Admission Academic Year
                  <span className="text-red-400"> *</span>
                </label>

                <select
                  {...register("admissionSession")}
                  disabled={sessionLoading || submitLoading}
                  className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                >
                  <option value="">Select Admission Academic Year</option>

                  {availableSessions.map((item) => (
                    <option key={item.slug} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <FieldError error={errors.admissionSession} />
              </div>

              {/* Current Session */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Current Academic Year
                  <span className="text-red-400"> *</span>
                </label>

                <select
                  {...register("currentSession")}
                  disabled={sessionLoading || submitLoading}
                  className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                >
                  <option value="">Select Current Academic Year</option>

                  {availableSessions.map((item) => (
                    <option key={item.slug} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <FieldError error={errors.currentSession} />
              </div>

              {/* Mother Name */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Mother Name
                  <span className="text-red-400"> *</span>
                </label>

                <input
                  type="text"
                  {...register("motherName")}
                  placeholder="Mother Name"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.motherName} />
              </div>

              {/* Mother phone */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Mother Phone Number
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  {...register("motherPhone")}
                  placeholder="10 digit phone number"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.motherPhone} />
              </div>

              {/* Board */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Board
                  <span className="text-red-400"> *</span>
                </label>

                <select
                  {...register("board")}
                  disabled={boardLoading || submitLoading}
                  className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                >
                  <option value="">Select Board</option>

                  {activeBoards.map((item) => (
                    <option key={item.slug} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>

                <FieldError error={errors.board} />
              </div>

              {/* Aadhaar */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Aadhaar Number
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={12}
                  {...register("aadhaarNumber")}
                  placeholder="12 digit Aadhaar number"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.aadhaarNumber} />
              </div>

              {/* Admission Class */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Admission Class
                  <span className="text-red-400"> *</span>
                </label>

                <select
                  {...register("admissionClass")}
                  disabled={!selectedBoard || classLoading || submitLoading}
                  className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                >
                  <option value="">
                    {classLoading
                      ? "Loading classes..."
                      : "Select Admission Class"}
                  </option>

                  {availableClasses.map((item) => (
                    <option key={item.slug} value={item.classTitle}>
                      {item.classTitle}
                    </option>
                  ))}
                </select>

                <FieldError error={errors.admissionClass} />
              </div>

              {/* Current Class */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Current Class
                  <span className="text-red-400"> *</span>
                </label>

                <select
                  {...register("currentClass")}
                  disabled={!selectedBoard || classLoading || submitLoading}
                  className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                >
                  <option value="">
                    {classLoading
                      ? "Loading classes..."
                      : "Select Current Class"}
                  </option>

                  {availableClasses.map((item) => (
                    <option key={item.slug} value={item.classTitle}>
                      {item.classTitle}
                    </option>
                  ))}
                </select>

                <FieldError error={errors.currentClass} />
              </div>

              {/* DOB */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Date of Birth
                  <span className="text-red-400"> *</span>
                </label>

                <input
                  type="date"
                  {...register("dob")}
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.dob} />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Gender
                  <span className="text-red-400"> *</span>
                </label>

                <select
                  {...register("gender")}
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <FieldError error={errors.gender} />
              </div>

              {/* Place of Birth */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Place of Birth
                </label>

                <input
                  type="text"
                  {...register("placeOfBirth")}
                  placeholder="Place of Birth"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.placeOfBirth} />
              </div>

              {/* Sponsorship type */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Sponsorship Type
                </label>

                <select
                  {...register("sponsorshipType")}
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                >
                  <option value="">Select Sponsorship Type</option>
                  <option value="Self/Parent">Self/Parent</option>
                  <option value="RTE">RTE</option>
                  <option value="Others">Others</option>
                </select>

                <FieldError error={errors.sponsorshipType} />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-300 mb-2">Category</label>

                <select
                  {...register("category")}
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>

                <FieldError error={errors.category} />
              </div>

              {/* Religion */}
              <div>
                <label className="block text-gray-300 mb-2">Religion</label>

                <select
                  {...register("religion")}
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                >
                  <option value="">Select Religion</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Islam">Islam</option>
                  <option value="Christian">Christian</option>
                  <option value="Jain">Jain</option>
                  <option value="Other">Other</option>
                </select>

                <FieldError error={errors.religion} />
              </div>

              {/* State */}
              <div>
                <label className="block text-gray-300 mb-2">State</label>

                <input
                  type="text"
                  {...register("state")}
                  placeholder="State"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.state} />
              </div>

              {/* District */}
              <div>
                <label className="block text-gray-300 mb-2">District</label>

                <input
                  type="text"
                  {...register("district")}
                  placeholder="District"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.district} />
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-300 mb-2">City</label>

                <input
                  type="text"
                  {...register("city")}
                  placeholder="City"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.city} />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">
                  Communication Address
                </label>

                <textarea
                  rows={3}
                  {...register("address")}
                  placeholder="Communication Address"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white resize-none outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.address} />
              </div>

              {/* Sponsorship Remarks */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Sponsorship Remarks
                </label>

                <textarea
                  rows={3}
                  {...register("sponsorshipRemarks")}
                  placeholder="Sponsorship Remarks"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white resize-none outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.sponsorshipRemarks} />
              </div>

              {/* Caste */}
              <div>
                <label className="block text-gray-300 mb-2">Caste</label>

                <input
                  type="text"
                  {...register("caste")}
                  placeholder="Caste"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.caste} />
              </div>

              {/* Mother Tongue */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Mother Tongue
                </label>

                <input
                  type="text"
                  {...register("motherTongue")}
                  placeholder="Mother Tongue"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.motherTongue} />
              </div>

              {/* Second Language */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Second Language
                </label>

                <input
                  type="text"
                  {...register("secondLanguage")}
                  placeholder="Second Language"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.secondLanguage} />
              </div>

              {/* APAAR */}
              <div>
                <label className="block text-gray-300 mb-2">APAAR ID</label>

                <input
                  type="text"
                  {...register("apaarId")}
                  placeholder="APAAR ID"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.apaarId} />
              </div>

              {/* PEN */}
              <div>
                <label className="block text-gray-300 mb-2">PEN Number</label>

                <input
                  type="text"
                  {...register("penNumber")}
                  placeholder="PEN Number"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.penNumber} />
              </div>

              {/* SATS */}
              <div>
                <label className="block text-gray-300 mb-2">SATS</label>

                <input
                  type="text"
                  {...register("sats")}
                  placeholder="SATS"
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                />

                <FieldError error={errors.sats} />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-gray-300 mb-2">Blood Group</label>

                <select
                  {...register("bloodGroup")}
                  disabled={submitLoading}
                  className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                >
                  <option value="">Select Blood Group</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>

                <FieldError error={errors.bloodGroup} />
              </div>

              {/* Profile Image URL */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Profile Image
                </label>

                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-700 bg-gray-800 flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Student preview"
                        className="w-full h-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-xs text-gray-500 text-center px-2">
                        No Image
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      disabled={submitLoading}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer file:mr-4 file:border-0 file:rounded-lg file:px-4 file:py-2 file:bg-emerald-600 file:text-white file:cursor-pointer disabled:opacity-60"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      JPG, JPEG, PNG or WEBP. Maximum 5 MB.
                    </p>

                    <FieldError error={errors.profileImage} />
                  </div>
                </div>
              </div>
            </div>

            {/* Previous School */}
            <div className="mt-8 border-t border-gray-800 pt-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Previous School Information
                <span className="text-red-400 text-sm ml-2">
                  (If Applicable)
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <input
                    type="text"
                    {...register("previousSchool")}
                    placeholder="Previous School"
                    disabled={submitLoading}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                  />

                  <FieldError error={errors.previousSchool} />
                </div>

                <div>
                  <textarea
                    rows={2}
                    {...register("schoolAddress")}
                    placeholder="School Address"
                    disabled={submitLoading}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white resize-none outline-none focus:border-emerald-500 disabled:opacity-60"
                  />

                  <FieldError error={errors.schoolAddress} />
                </div>

                <div>
                  <select
                    {...register("previousBoard")}
                    disabled={submitLoading}
                    className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                  >
                    <option value="">Select Previous Board</option>

                    {activeBoards.map((item) => (
                      <option key={item.slug} value={item.title}>
                        {item.title}
                      </option>
                    ))}

                    <option value="Others">Others</option>
                  </select>

                  <FieldError error={errors.previousBoard} />
                </div>

                <div>
                  <select
                    {...register("previousResult")}
                    disabled={submitLoading}
                    className="w-full bg-gray-800 border cursor-pointer border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 disabled:opacity-60"
                  >
                    <option value="">Select Previous Result</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                  </select>

                  <FieldError error={errors.previousResult} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading}
            className="px-5 py-3 rounded-xl border border-gray-700 text-white cursor-pointer hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitLoading}
            className="px-5 py-3 rounded-xl bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitLoading && <Loader2 size={18} className="animate-spin" />}

            {editStudent ? "Update Information" : "Save Information"}
          </button>
        </div>
      </form>
    </div>
  );
}
