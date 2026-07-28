import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

import { useStudentHealthManagementStore } from "../../../store/academic/studentHealthManagement/studentHealthManagementStore";
import { studentHealthManagementApi } from "../../../api/academic/studentHealthManagement/studentHealthManagementApi";

const initialFormData = {
  vision: "",
  ears: "",
  teethOcclusion: "",
  height: "",
  weight: "",
  hip: "",
  waist: "",
  pulse: "",
  bloodPressure: "",
  postureEvaluation: "",
  strand1: "",
  strand2: "",
  strand3: "",
  bodyComposition: "",
  muscularStrength: "",
  upperBody: "",
  flexibility: "",
  endurance: "",
  agility: "",
  speed: "",
  power: "",
};

const getAssessmentFormData = (assessment = {}) => ({
  vision: assessment?.vision || "",
  ears: assessment?.ears || "",
  teethOcclusion: assessment?.teethOcclusion || "",
  height: assessment?.height || "",
  weight: assessment?.weight || "",
  hip: assessment?.hip || "",
  waist: assessment?.waist || "",
  pulse: assessment?.pulse || "",
  bloodPressure: assessment?.bloodPressure || "",
  postureEvaluation: assessment?.postureEvaluation || "",
  strand1: assessment?.strand1 || "",
  strand2: assessment?.strand2 || "",
  strand3: assessment?.strand3 || "",
  bodyComposition: assessment?.bodyComposition || "",
  muscularStrength: assessment?.muscularStrength || "",
  upperBody: assessment?.upperBody || "",
  flexibility: assessment?.flexibility || "",
  endurance: assessment?.endurance || "",
  agility: assessment?.agility || "",
  speed: assessment?.speed || "",
  power: assessment?.power || "",
});

export default function AddHealthInfoModal({
  open,
  close,
  student,
  academicYear,
  assessmentSlug,
  isEdit,
  onSuccess,
}) {
  const { submitLoading, createHealthAssessment, updateHealthAssessment } =
    useStudentHealthManagementStore();

  const [formData, setFormData] = useState(initialFormData);
  const [assessmentLoading, setAssessmentLoading] = useState(false);

  const currentAssessmentSlug =
    assessmentSlug || student?.healthAssessmentSlug || null;

  const hasExistingAssessment =
    Boolean(currentAssessmentSlug) ||
    Boolean(isEdit) ||
    Boolean(student?.hasHealthAssessment);

  const healthData = [
    ["Vision", "RE/LE", "vision"],
    ["Ears", "Left/Right", "ears"],
    ["Teeth Occlusion", "Caries/Tonsils/Gums", "teethOcclusion"],
    ["General Body Measurements", "Height (cm)", "height"],
    ["", "Weight (Kg)", "weight"],
    ["Circumferences", "Hip", "hip"],
    ["", "Waist", "waist"],
    ["Health Status", "Pulse", "pulse"],
    ["", "Blood Pressure", "bloodPressure"],
    [
      "Posture Evaluation",
      `If any:
                Head Forward/Sunken Chest/Round Shoulders
                Kyphisis/Lordosis
                Abdominal Ptosis
                Bow Legs`,
      "postureEvaluation",
    ],
    [
      "Sporting Activities (HPE) (For details, see HPE manual available on CBSE website www.cbseacademic.in)",
      [
        {
          title: "Strand 1",
          field: "strand1",
          text: `Any one of following:
                            1. Athletics/Swimming
                            2. Team Game
                            3. Individual Game
                            4. Adventure Sport`,
        },
        {
          title: "Strand 2",
          field: "strand2",
          text: `Health and Fitness
                            (Mass PT,Yoga, Dance, Calisthenics,
                            Jogging, Cross Country Run Working
                            outs using weights/gym equipment, Tai-
                            chiect etc)`,
        },
        {
          title: "Strand 3",
          field: "strand3",
          text: `SEWA`,
        },
      ],
      true,
    ],
  ];

  const fitnessData = [
    [
      "Health Components",
      "Body Composition",
      "BMI",
      "Body Mass Index for specific Age and Gender",
      "bodyComposition",
    ],
    [
      "",
      "Muscular Strength",
      "Partial Curl Up",
      "Abdominal Muscular Endurance",
      "muscularStrength",
    ],
    [
      "",
      "Upper Body",
      "Flexed/Bent Arm Hang",
      "Functional Strength",
      "upperBody",
    ],
    [
      "",
      "Flexibility",
      "Sit and Reach",
      "Lower back flexibility",
      "flexibility",
    ],
    ["", "Endurance", "600 Mtr Run", "Cardiovascular Endurance", "endurance"],
    [
      "Skill Components",
      "Agility",
      "Shuttle Run",
      "Speed and Agility",
      "agility",
    ],
    ["", "Speed", "Sprint/Dash", "Acceleration Speed", "speed"],
    ["", "Power", "Standing Vertical Jump", "Leg Muscle Power", "power"],
  ];

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadExistingAssessment = async () => {
      if (!currentAssessmentSlug) {
        setFormData(initialFormData);

        return;
      }

      try {
        setAssessmentLoading(true);

        const res = await studentHealthManagementApi.getHealthAssessmentBySlug(
          currentAssessmentSlug,
        );

        const assessment = res?.data?.data || res?.data || res || null;

        if (!assessment) {
          setFormData(initialFormData);

          return;
        }

        setFormData(getAssessmentFormData(assessment));
      } catch (error) {
        setFormData(initialFormData);

        toast.error(
          error?.response?.data?.message || "Failed to fetch health assessment",
        );
      } finally {
        setAssessmentLoading(false);
      }
    };

    loadExistingAssessment();
  }, [open, currentAssessmentSlug]);

  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const studentSlug = student?.studentSlug || student?.slug;

    if (!studentSlug) {
      toast.error("Student information not found");

      return;
    }

    const payload = {
      studentSlug,
      academicYear: academicYear || student?.academicYear,
      ...formData,
    };

    let success = false;

    if (hasExistingAssessment) {
      if (!currentAssessmentSlug) {
        toast.error("Health assessment record not found");

        return;
      }

      success = await updateHealthAssessment(currentAssessmentSlug, payload);
    } else {
      success = await createHealthAssessment(payload);
    }

    if (!success) {
      return;
    }

    if (onSuccess) {
      await onSuccess();
    } else {
      close();
    }
  };

  const handleClose = () => {
    if (submitLoading || assessmentLoading) {
      return;
    }

    close();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-[90%] max-w-6xl rounded-2xl border border-gray-700">
        {/* header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">Add Student Health Information</h2>

          <X onClick={handleClose} className="text-gray-400 cursor-pointer" />
        </div>

        {/* body */}

        <div className="p-5 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
          {assessmentLoading ? (
            <div className="min-h-[350px] flex items-center justify-center">
              <Loader2 size={34} className="text-indigo-400 animate-spin" />
            </div>
          ) : (
            <>
              {/* Health Table */}

              <table className="w-full text-sm border border-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-3 text-left text-gray-300">Components</th>

                    <th className="p-3 text-left text-gray-300">Parameters</th>

                    <th className="p-3 text-left text-gray-300">#</th>
                  </tr>
                </thead>

                <tbody>
                  {healthData.map((item, i) => (
                    <tr key={i} className="border-t border-gray-800">
                      {/* Component */}

                      <td className="p-3 text-gray-300 align-top w-[25%]">
                        {item[0]}
                      </td>

                      {/* Parameters */}

                      <td className="p-3 text-gray-400 align-top">
                        {item[2] === true ? (
                          <div className="space-y-4">
                            {item[1].map((strand, index) => (
                              <div
                                key={index}
                                className="
                                      grid
                                      grid-cols-[100px_1fr]
                                      gap-4
                                      border-b
                                      border-gray-800
                                      pb-3
                                    "
                              >
                                <p className="font-semibold text-indigo-400">
                                  {strand.title}
                                </p>

                                <p className="whitespace-pre-line">
                                  {strand.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="whitespace-pre-line">{item[1]}</p>
                        )}
                      </td>

                      {/* Inputs */}

                      <td className="p-3 align-top w-[250px]">
                        {item[2] === true ? (
                          <div className="space-y-4">
                            {item[1].map((strand, index) => (
                              <div
                                key={index}
                                className="min-h-[80px] border-b border-gray-800 pb-3"
                              >
                                <input
                                  value={formData[strand.field]}
                                  onChange={(event) =>
                                    handleChange(
                                      strand.field,
                                      event.target.value,
                                    )
                                  }
                                  placeholder="type here..."
                                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <input
                            value={formData[item[2]]}
                            onChange={(event) =>
                              handleChange(item[2], event.target.value)
                            }
                            placeholder="type here..."
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Fitness Table */}

              <table className="w-full text-sm border border-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    {[
                      "Fitness Components",
                      "Fitness Parameters",
                      "Test Name",
                      "What does it Measure",
                      "#",
                    ].map((h) => (
                      <th key={h} className="p-3 text-gray-300 text-left">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {fitnessData.map((item, i) => (
                    <tr key={i} className="border-t border-gray-800">
                      <td className="p-3 text-gray-300">{item[0]}</td>

                      <td className="p-3 text-gray-400">{item[1]}</td>

                      <td className="p-3 text-gray-400">{item[2]}</td>

                      <td className="p-3 text-gray-400">{item[3]}</td>

                      <td className="p-2">
                        <input
                          value={formData[item[4]]}
                          onChange={(event) =>
                            handleChange(item[4], event.target.value)
                          }
                          placeholder="type here..."
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* footer */}

        <div className="p-5 flex justify-end gap-3 border-t border-gray-800">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitLoading || assessmentLoading}
            className="px-5 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={17} className="animate-spin" />
                Saving...
              </span>
            ) : hasExistingAssessment ? (
              "Update Information"
            ) : (
              "Save Information"
            )}
          </button>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitLoading || assessmentLoading}
            className="px-5 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
