import React, { useState } from "react";
import { X, Edit, Trash2, Plus } from "lucide-react";
import EditVacancyModal from "./EditVacancyModal";

export default function VacancyModal({ open, close }) {
  if (!open) return null;

  const vacancies = [
    {
      post: "PRT Counsellor - 1",
      age: 45,
      subject: "English, Maths, Hindi",
      school: "Public School Durg",
      courses: "N/A",
    },
    {
      post: "Lab Attender - 1",
      age: 40,
      subject: "English, Maths, GK",
      school: "Creative Academy Simri",
      courses: "N/A",
    },
    {
      post: "Ayah - 2",
      age: 40,
      subject: "English, Hindi",
      school: "DPS Mumbai",
      courses: "N/A",
    },
  ];

  const [showSubject, setShowSubject] = useState(false);
  const [subject, setSubject] = useState({
    name: "",
    post: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [qualification, setQualification] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);

  const addSubject = () => {
    if (!subject.name || !subject.post) return;

    setSubjects([...subjects, subject]);

    setSubject({
      name: "",
      post: "",
    });
  };

  const deleteSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[90%] h-[90vh] overflow-hidden">
        {/* header */}

        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl text-white">Vacancies</h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        <div className="grid grid-cols-2 gap-5 p-5 h-[calc(90vh-70px)] overflow-auto custom-scrollbar">
          {/* LEFT CREATE FORM */}

          <div className="space-y-5">
            <div>
              <label className="text-gray-300">Select Board</label>

              <select className="mt-2 bg-gray-800 border cursor-pointer border-gray-700 rounded-lg px-4 py-3 text-white w-full">
                <option>Select Board</option>
                <option>Central Board</option>
                <option>CGBSE Board</option>
                <option>BSEB Board</option>
              </select>
            </div>

            <div>
              <label className="text-gray-300">Select Schools</label>

              <select
                // multiple
                className="mt-2 bg-gray-800 cursor-pointer border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
              >
                <option>Select School</option>
                <option>Public School Durg</option>
                <option>Delhi Public School</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-gray-300">Designation Title</label>

                <input className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full" />
              </div>

              <div>
                <label className="text-gray-300">Total Post</label>

                <input className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full" />
              </div>

              <div>
                <label className="text-gray-300">Applicaiton Fees</label>

                <input className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full" />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-300">Max Age</label>

              <input
                type="number"
                className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-40"
              />
            </div>

            {/* <button className="text-indigo-400">+ Add Subjects</button> */}
            <div className="space-y-4">
              <button
                onClick={() => setShowSubject(!showSubject)}
                className="text-indigo-400 hover:underline cursor-pointer"
              >
                + Add Subjects
              </button>

              {showSubject && (
                <div>
                  <div className="grid grid-cols-[1fr_120px_45px] gap-3 items-end">
                    <div>
                      <label className="text-gray-300">Subject Name</label>

                      <input
                        value={subject.name}
                        onChange={(e) =>
                          setSubject({
                            ...subject,
                            name: e.target.value,
                          })
                        }
                        className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300">Total Post</label>

                      <input
                        value={subject.post}
                        onChange={(e) =>
                          setSubject({
                            ...subject,
                            post: e.target.value,
                          })
                        }
                        className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full"
                      />
                    </div>

                    <button
                      onClick={addSubject}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white h-[42px] rounded-lg cursor-pointer"
                    >
                      <Plus size={18} className="ml-3" />
                    </button>
                  </div>

                  {/* Added Subjects */}

                  <div className="mt-4 space-y-2">
                    {subjects.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[60px_1fr_1fr_80px] items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                      >
                        {/* serial */}

                        <span className="text-gray-300">{index + 1}.</span>

                        {/* subject */}

                        <span className="text-white">{item.name}</span>

                        {/* post */}

                        <span className="text-green-400 text-center">
                          Posts : {item.post}
                        </span>

                        {/* delete */}

                        <div className="flex justify-end">
                          <button
                            onClick={() => deleteSubject(index)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg cursor-pointer"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-gray-300">Select Qualifications</label>

              <select
                multiple
                value={qualification}
                onChange={(e) =>
                  setQualification(
                    [...e.target.selectedOptions].map((item) => item.value),
                  )
                }
                className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full h-28 custom-scrollbar cursor-pointer"
              >
                <option value="10th">10th</option>

                <option value="12th">12th</option>

                <option value="Graduation">Graduation</option>

                <option value="B.Ed">B.Ed</option>
              </select>
            </div>

            {qualification.includes("Graduation") && (
              <div>
                <label className="text-gray-300">
                  Select Graduation Course
                </label>

                <select
                  multiple
                  value={courses}
                  onChange={(e) =>
                    setCourses(
                      [...e.target.selectedOptions].map((item) => item.value),
                    )
                  }
                  className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full h-28 custom-scrollbar cursor-pointer"
                >
                  <option value="BA">BA</option>

                  <option value="BSC">BSC</option>

                  <option value="BTECH">BTECH</option>

                  <option value="BCA">BCA</option>

                  <option value="BCOM">BCOM</option>
                </select>
              </div>
            )}

            <button className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg w-full cursor-pointer">
              {editIndex !== null ? "Update Vacancy" : "Add Vacancy"}
            </button>
          </div>

          {/* RIGHT LIST */}

          <div className="space-y-4">
            <div className="flex gap-3 justify-end">
              <select className="bg-gray-800 border cursor-pointer border-gray-700 text-white px-4 py-2 rounded-lg">
                <option>Select By Board</option>
                <option>Central Board</option>
                <option>CGBSE Board</option>
                <option>BSEB Board</option>
              </select>

              <input
                placeholder="Search by post name"
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>

            {vacancies.map((item, index) => (
              <div
                key={index}
                className="border border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="flex justify-end gap-2 p-2">
                  <button
                    onClick={() => {
                      setSelectedVacancy(item);
                      setEditOpen(true);
                    }}
                    className="bg-cyan-500 p-2 cursor-pointer hover:bg-cyan-600 rounded text-white"
                  >
                    <Edit size={15} />
                  </button>

                  <button className="bg-red-500 cursor-pointer hover:bg-red-600 p-2 rounded text-white">
                    <Trash2 size={15} />
                  </button>
                </div>

                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="border border-gray-700 p-2 text-gray-300">
                        Board Name
                      </td>

                      <td className="border border-gray-700 p-2 text-white">
                        Central Board
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-700 p-2 text-gray-300">
                        Post Name
                      </td>

                      <td className="border border-gray-700 p-2 text-white">
                        {item.post}
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-700 p-2 text-gray-300">
                        Subjects
                      </td>

                      <td className="border border-gray-700 p-2 text-white">
                        {item.subject}
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-700 p-2 text-gray-300">
                        School
                      </td>

                      <td className="border border-gray-700 p-2 text-white">
                        <span className="bg-blue-600 text-white px-3 rounded">
                          {item.school}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-700 p-2 text-gray-300">
                        Qualification
                      </td>

                      <td className="border border-gray-700 p-2">
                        <span className="bg-cyan-700 text-white px-3 rounded">
                          Graduation
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-700 p-2 text-gray-300">
                        Courses
                      </td>

                      <td className="border border-gray-700 p-2 text-white">
                        {item.courses}
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-gray-700 p-2 text-gray-300">
                        Max Age
                      </td>

                      <td className="border border-gray-700 p-2">
                        <span className="bg-green-600 text-white px-2 rounded">
                          {item.age}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
      <EditVacancyModal
        open={editOpen}
        close={() => setEditOpen(false)}
        data={selectedVacancy}
      />
    </div>
  );
}
