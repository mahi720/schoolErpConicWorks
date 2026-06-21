import React, { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

export default function EditVacancyModal({ open, close, data }) {
  const [form, setForm] = useState({
    board: "",
    school: [],
    designation: "",
    totalPost: "",
    fee: "",
    age: "",
  });

  const [showSubject, setShowSubject] = useState(false);

  const [subject, setSubject] = useState({
    name: "",
    post: "",
  });

  const [subjects, setSubjects] = useState([]);

  const [qualification, setQualification] = useState([]);

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (data) {
      setForm({
        board: "Central Board",
        school: ["HAL PUBLIC SCHOOL (CBSE)", "HAL NEW PUBLIC SCHOOL (CBSE)"],
        designation: data.post,
        totalPost: "3",
        fee: "0",
        age: data.age,
      });

      setSubjects([
        {
          name: "Hindi",
          post: "1",
        },
        {
          name: "Social Science",
          post: "2",
        },
      ]);

      setQualification(["10th", "12th", "Graduation", "B.Ed"]);

      setCourses(["B.Com", "B.Sc"]);
    }
  }, [data]);

  if (!open) return null;

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
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[60]">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[700px] max-h-[90vh] overflow-hidden">
        {/* header */}

        <div className="flex justify-between p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">Vacancies Edit</h2>

          <X onClick={close} className="text-gray-400 cursor-pointer" />
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh] custom-scrollbar">
          {/* board */}

          <div>
            <label className="text-gray-300">Select Board</label>

            <select
              value={form.board}
              onChange={(e) => setForm({ ...form, board: e.target.value })}
              className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
            >
              <option>Central Board</option>
              <option>CGBSE Board</option>
            </select>
          </div>

          {/* schools */}

          <div>
            <label className="text-gray-300">Select Schools</label>

            <div className="mt-2 bg-gray-800 border border-gray-700 rounded-lg p-3 min-h-[70px]">
              {form.school.map((s, i) => (
                <span
                  key={i}
                  className="inline-block bg-gray-700 text-white px-3 py-1 rounded mr-2 mb-2"
                >
                  × {s}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              value={form.designation}
              placeholder="Designation"
              onChange={(e) =>
                setForm({ ...form, designation: e.target.value })
              }
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            />

            <input
              value={form.totalPost}
              placeholder="Total Post"
              onChange={(e) => setForm({ ...form, totalPost: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            />

            <input
              value={form.fee}
              placeholder="Application Fee"
              onChange={(e) => setForm({ ...form, fee: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <input
            value={form.age}
            placeholder="Max Age"
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-32"
          />

          {/* subject */}

          <div>
            <button
              onClick={() => setShowSubject(!showSubject)}
              className="text-indigo-400 cursor-pointer"
            >
              + Add Subjects
            </button>

            {showSubject && (
              <div className="mt-4">
                <div className="grid grid-cols-[1fr_120px_50px] gap-3">
                  <input
                    value={subject.name}
                    onChange={(e) =>
                      setSubject({ ...subject, name: e.target.value })
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />

                  <input
                    value={subject.post}
                    onChange={(e) =>
                      setSubject({ ...subject, post: e.target.value })
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  />

                  <button
                    onClick={addSubject}
                    className="bg-indigo-600 rounded-lg text-white"
                  >
                    <Plus className="mx-auto" />
                  </button>
                </div>
              </div>
            )}

            {subjects.map((item, index) => (
              <div key={index} className="grid grid-cols-3 items-center mt-3">
                <p className="text-white">{item.name}</p>

                <p className="text-green-400 text-center">{item.post}</p>

                <button
                  onClick={() => deleteSubject(index)}
                  className="bg-red-500 p-2 rounded text-white ml-auto"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* qualification */}

          <div>
            <label className="text-gray-300">Select Qualifications</label>

            <div className="mt-2 bg-gray-800 border border-gray-700 p-3">
              {qualification.map((q) => (
                <span className="bg-gray-700 px-3 py-1 rounded mr-2 text-white">
                  × {q}
                </span>
              ))}
            </div>
          </div>

          {qualification.includes("Graduation") && (
            <div>
              <label className="text-gray-300">Select Graduation Courses</label>

              <div className="mt-2 bg-gray-800 border border-gray-700 p-3">
                {courses.map((c) => (
                  <span className="bg-gray-700 px-3 py-1 rounded mr-2 text-white">
                    × {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={close}
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg w-full cursor-pointer"
          >
            Edit Vacancy
          </button>
        </div>
      </div>
    </div>
  );
}
