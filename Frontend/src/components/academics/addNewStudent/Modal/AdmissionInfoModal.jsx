import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../../../common/Modal";

import { useStudentStore } from "../../../../store/academic/addNewStudent/studentStore";
import { useSessionStore } from "../../../../store/master/session/sessionStore";
import { useBoardStore } from "../../../../store/master/board/boardStore";
import { useClassStore } from "../../../../store/master/class/classStore";

const initialData = {
  admissionNumber: "",
  admissionDate: "",
  admissionSession: "",
  currentSession: "",
  board: "",
  admissionClass: "",
  currentClass: "",
  sponsorshipType: "",
  sponsorshipRemarks: "",

  previousSchool: "",
  previousBoard: "",
  previousResult: "",
  schoolAddress: "",
};

export default function AdmissionInfoModal({
  isOpen,
  onClose,
  studentData,
  onSaved,
}) {
  const { updateStudent, submitLoading } = useStudentStore();

  const { sessions, fetchSessions } = useSessionStore();

  const { boards, fetchBoards } = useBoardStore();

  const { classes, fetchClasses } = useClassStore();

  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (!isOpen) return;

    fetchSessions();
    fetchBoards();
  }, [isOpen]);

  useEffect(() => {
    if (!formData.board) return;

    fetchClasses({
      board: formData.board,
      session: formData.currentSession || formData.admissionSession,
    });
  }, [formData.board, formData.currentSession, formData.admissionSession]);

  useEffect(() => {
    if (!isOpen || !studentData) return;

    const previousSchoolInfo = studentData.previousSchoolInfo || {};

    setFormData({
      admissionNumber: studentData.admissionNumber || "",

      admissionDate: studentData.admissionDate
        ? studentData.admissionDate.substring(0, 10)
        : "",

      admissionSession: studentData.admissionSession || "",

      currentSession: studentData.currentSession || "",

      board: studentData.board || "",

      admissionClass: studentData.admissionClass || "",

      currentClass: studentData.currentClass || "",

      sponsorshipType: studentData.sponsorshipType || "",

      sponsorshipRemarks: studentData.sponsorshipRemarks || "",

      previousSchool: previousSchoolInfo.previousSchool || "",

      previousBoard: previousSchoolInfo.previousBoard || "",

      previousResult: previousSchoolInfo.previousResult || "",

      schoolAddress: previousSchoolInfo.schoolAddress || "",
    });
  }, [isOpen, studentData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!studentData?.slug) {
      toast.error("Student not found");
      return;
    }

    const success = await updateStudent(studentData.slug, formData);

    if (!success) return;

    await onSaved?.();

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Admission Information"
      width="max-w-4xl"
    >
      <div className="max-h-[65vh] overflow-y-auto custom-scrollbar pr-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-gray-400">Admission Number</label>

            <input
              name="admissionNumber"
              value={formData.admissionNumber}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-800 text-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-400">Admission Date</label>

            <input
              type="date"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-800 text-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-400">
              Admission Session
            </label>

            <select
              name="admissionSession"
              value={formData.admissionSession}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-800 text-white"
            >
              <option value="">Select Session</option>

              {sessions.map((item) => (
                <option key={item.slug} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-400">Current Session</label>

            <select
              name="currentSession"
              value={formData.currentSession}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-800 text-white"
            >
              <option value="">Select Session</option>

              {sessions.map((item) => (
                <option key={item.slug} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-400">Board</label>

            <select
              name="board"
              value={formData.board}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-800 text-white"
            >
              <option value="">Select Board</option>

              {boards.map((item) => (
                <option key={item.slug} value={item.title}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-400">Admission Class</label>

            <select
              name="admissionClass"
              value={formData.admissionClass}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-800 text-white"
            >
              <option value="">Select Class</option>

              {classes.map((item) => (
                <option key={item.slug} value={item.classTitle}>
                  {item.classTitle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-400">Current Class</label>

            <select
              name="currentClass"
              value={formData.currentClass}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-800 text-white"
            >
              <option value="">Select Class</option>

              {classes.map((item) => (
                <option key={item.slug} value={item.classTitle}>
                  {item.classTitle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-400">Sponsorship Type</label>

            <input
              name="sponsorshipType"
              value={formData.sponsorshipType}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-800 text-white"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-gray-400">
              Sponsorship Remarks
            </label>

            <textarea
              rows={3}
              name="sponsorshipRemarks"
              value={formData.sponsorshipRemarks}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-800 text-white resize-none"
            />
          </div>

          <div className="col-span-2 mt-2">
            <div className="rounded-xl border border-gray-700 bg-gray-800/40 px-4 py-3">
              <h3 className="text-blue-400 font-semibold">
                Previous School Information (If Any)
              </h3>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-gray-400">Previous School</label>

            <input
              type="text"
              name="previousSchool"
              value={formData.previousSchool}
              onChange={handleChange}
              placeholder="Enter Previous School"
              disabled={submitLoading}
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-400">Previous Board</label>

            <select
              name="previousBoard"
              value={formData.previousBoard}
              onChange={handleChange}
              disabled={submitLoading}
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white cursor-pointer"
            >
              <option value="">Select Previous Board</option>

              {boards.map((board) => (
                <option key={board.slug} value={board.title}>
                  {board.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-400">Previous Result</label>

            <select
              name="previousResult"
              value={formData.previousResult}
              onChange={handleChange}
              disabled={submitLoading}
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white cursor-pointer"
            >
              <option value="">Select Result</option>

              <option value="Pass">Pass</option>

              <option value="Fail">Fail</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-gray-400">
              Previous School Address
            </label>

            <textarea
              rows={3}
              name="schoolAddress"
              value={formData.schoolAddress}
              onChange={handleChange}
              placeholder="Enter Previous School Address"
              disabled={submitLoading}
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-blue-500 resize-none disabled:opacity-60"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
        <button
          onClick={onClose}
          className="px-5 py-2 border border-gray-700 rounded-xl text-white"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={submitLoading}
          className="px-5 py-2 bg-blue-600 rounded-xl text-white flex items-center gap-2"
        >
          {submitLoading && <Loader2 size={16} className="animate-spin" />}
          Save
        </button>
      </div>
    </Modal>
  );
}
