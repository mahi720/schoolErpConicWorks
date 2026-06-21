import React from "react";
import { X } from "lucide-react";

export default function AddHealthInfoModal({ open, close }) {
  if (!open) return null;

  const healthData = [
    ["Vision", "RE/LE"],
    ["Ears", "Left/Right"],
    ["Teeth Occlusion", "Caries/Tonsils/Gums"],
    ["General Body Measurements", "Height (cm)"],
    ["", "Weight (Kg)"],
    ["Circumferences", "Hip"],
    ["", "Waist"],
    ["Health Status", "Pulse"],
    ["", "Blood Pressure"],
    [
      "Posture Evaluation",
      `If any:
                Head Forward/Sunken Chest/Round Shoulders
                Kyphisis/Lordosis
                Abdominal Ptosis
                Bow Legs`,
    ],
    [
      "Sporting Activities (HPE) (For details, see HPE manual available on CBSE website www.cbseacademic.in)",
      [
        {
          title: "Strand 1",
          text: `Any one of following:
                            1. Athletics/Swimming
                            2. Team Game
                            3. Individual Game
                            4. Adventure Sport`,
        },
        {
          title: "Strand 2",
          text: `Health and Fitness
                            (Mass PT,Yoga, Dance, Calisthenics,
                            Jogging, Cross Country Run Working
                            outs using weights/gym equipment, Tai-
                            chiect etc)`,
        },
        {
          title: "Strand 3",
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
    ],
    [
      "",
      "Muscular Strength",
      "Partial Curl Up",
      "Abdominal Muscular Endurance",
    ],
    ["", "Upper Body", "Flexed/Bent Arm Hang", "Functional Strength"],
    ["", "Flexibility", "Sit and Reach", "Lower back flexibility"],
    ["", "Endurance", "600 Mtr Run", "Cardiovascular Endurance"],
    ["Skill Components", "Agility", "Shuttle Run", "Speed and Agility"],
    ["", "Speed", "Sprint/Dash", "Acceleration Speed"],
    ["", "Power", "Standing Vertical Jump", "Leg Muscle Power"],
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-[90%] max-w-6xl rounded-2xl border border-gray-700">
        {/* header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">Add Student Health Information</h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        {/* body */}

        <div className="p-5 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
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

                  {/* Inputs */}

                  {/* Parameters */}

                  <td className="p-3 text-gray-400 align-top">
                    {item[2] ? (
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

                            <p className="whitespace-pre-line">{strand.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="whitespace-pre-line">{item[1]}</p>
                    )}
                  </td>

                  {/* Inputs */}

                  <td className="p-3 align-top w-[250px]">
                    {item[2] ? (
                      <div className="space-y-4">
                        {item[1].map((_, index) => (
                          <div
                            key={index}
                            className="min-h-[80px] border-b border-gray-800 pb-3"
                          >
                            <input
                              placeholder="type here..."
                              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <input
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
                  <th className="p-3 text-gray-300 text-left">{h}</th>
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
                      placeholder="type here..."
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* footer */}

        <div className="p-5 flex justify-end gap-3 border-t border-gray-800">
          <button className="px-5 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600">
            Save Information
          </button>

          <button
            onClick={close}
            className="px-5 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
