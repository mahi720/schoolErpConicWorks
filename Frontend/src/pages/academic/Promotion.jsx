import React, { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import AssignStreamModal from "../../components/academics/stream&SectionManager/AssignStreamModal";
import AssignSectionModal from "../../components/academics/stream&SectionManager/AssignSectionModal";
import PromoteStudentModal from "../../components/academics/PromotionModal/PromoteStudentModal";

export default function StudentPromotion() {
  const [selected, setSelected] = useState([]);
  const [targetSelected, setTargetSelected] = useState([]);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);

  const students = [
    {
      id: 1,
      roll: 4,
      name: "BHAVANA C",
      stream: "NA",
      section: "A",
    },
    {
      id: 2,
      roll: 20,
      name: "S ROHAN SINGH",
      stream: "NA",
      section: "B",
    },
    {
      id: 3,
      roll: 28,
      name: "Y R BHUVANA",
      stream: "NA",
      section: "B",
    },
  ];

  const hasTargetSelected = targetSelected.length > 0;

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const toggleTargetSelect = (id) => {
    if (targetSelected.includes(id)) {
      setTargetSelected(targetSelected.filter((i) => i !== id));
    } else {
      setTargetSelected([...targetSelected, id]);
    }
  };

  return (
    <div className="space-y-8">
      {/* TITLE */}

      <h1 className="text-3xl font-bold text-white">Student Promotion</h1>

      {/* Rules */}

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-lg text-white mb-3">Promotion Rules</h2>

          <ul className="list-disc ml-5 space-y-2 text-gray-300">
            <li>Selected students must be eligible for promotion.</li>

            <li>Students must clear examination and dues.</li>

            <li>Leaving certificate students can't be promoted.</li>
          </ul>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-lg text-white mb-3">Important Notes</h2>

          <ul className="list-disc ml-5 space-y-2">
            <li className="text-red-400">Academic year should be different.</li>

            <li className="text-gray-300">Board will remain same.</li>

            <li className="text-yellow-400">
              Wrong promotion can be demoted later.
            </li>
          </ul>
        </div>
      </div>

      {/* Button */}

      <div className="flex justify-center">
        <button
          onClick={() => setShowPromoteModal(true)}
          disabled={selected.length === 0}
          className={`
        px-6 py-3 rounded-2xl
        flex items-center gap-3
        text-white

        ${selected.length ? "bg-indigo-600 cursor-pointer hover:bg-indigo-700" : "bg-gray-700 cursor-not-allowed"}

        `}
        >
          Promote
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Source Target */}

      <div className="grid grid-cols-2 gap-8">
        {/* Source */}

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 space-y-5">
          <h2 className="text-xl text-white">Source Class</h2>

          <div className="flex gap-3">
            {/* Academic Year */}

            <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer">
              <option>Select Acd. Year</option>
              <option>2025-26</option>
              <option>2026-27</option>
              <option>2027-28</option>
            </select>

            {/* Board */}

            <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer">
              <option>Select Board</option>
              <option>CBSE</option>
              <option>ICSE</option>
              <option>State Board</option>
            </select>

            {/* Class */}

            <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer">
              <option>Select Class</option>
              <option>Grade 9</option>
              <option>Grade 10</option>
              <option>Grade 11</option>
              <option>Grade 12</option>
            </select>
          </div>

          <Filter />

          <StudentTable
            data={students}
            selected={selected}
            setSelected={setSelected}
            toggleSelect={toggleSelect}
          />
        </div>

        {/* Target */}

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-white">Target Class</h2>

            <div className="flex gap-3">
              <button
                disabled={!hasTargetSelected}
                onClick={() => hasTargetSelected && setShowStreamModal(true)}
                className={`px-4 py-2 rounded-xl text-white transition-all
              ${
                hasTargetSelected
                  ? "bg-indigo-600 cursor-pointer hover:bg-indigo-700"
                  : "bg-gray-700 opacity-50 cursor-not-allowed pointer-events-none"
              }`}
              >
                Assign Stream
              </button>

              <button
                disabled={!hasTargetSelected}
                onClick={() => hasTargetSelected && setShowSectionModal(true)}
                className={`px-4 py-2 rounded-xl text-white transition-all
              ${
                hasTargetSelected
                  ? "bg-pink-500 cursor-pointer hover:bg-pink-600"
                  : "bg-gray-700 opacity-50 cursor-not-allowed pointer-events-none"
              }`}
              >
                Assign Section
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            {/* Academic Year */}

            <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer">
              <option>Select Acd. Year</option>
              <option>2025-26</option>
              <option>2026-27</option>
              <option>2027-28</option>
            </select>

            {/* Board */}

            <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer">
              <option>Select Board</option>
              <option>CBSE</option>
              <option>ICSE</option>
              <option>State Board</option>
            </select>

            {/* Class */}

            <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white flex-1 cursor-pointer">
              <option>Select Class</option>
              <option>Grade 9</option>
              <option>Grade 10</option>
              <option>Grade 11</option>
              <option>Grade 12</option>
            </select>
          </div>

          <Filter />

          <StudentTable
            data={students}
            selected={targetSelected}
            setSelected={setTargetSelected}
            toggleSelect={toggleTargetSelect}
          />
        </div>
      </div>
      <AssignStreamModal
        isOpen={showStreamModal}
        onClose={() => setShowStreamModal(false)}
      />

      <AssignSectionModal
        isOpen={showSectionModal}
        onClose={() => setShowSectionModal(false)}
      />

      <PromoteStudentModal
        isOpen={showPromoteModal}
        onClose={() => setShowPromoteModal(false)}
      />
    </div>
  );
}

function Filter() {
  return (
    <div className="flex gap-3">
      <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer">
        <option>Select Stream</option>
        <option>Science</option>
        <option>Arts</option>
        <option>Commerce</option>
      </select>

      <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white cursor-pointer">
        <option>Select Section</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
      </select>

      <div className="relative flex-1">
        <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />

        <input
          placeholder="Search Student"
          className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 pl-10 text-white"
        />
      </div>
    </div>
  );
}

function StudentTable({ data, setSelected, selected, toggleSelect }) {
  const selectAll = (e) => {
    if (e.target.checked) {
      setSelected(data.map((item) => item.id));
    } else {
      setSelected([]);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3">
              <input
                type="checkbox"
                checked={selected.length === data.length && data.length > 0}
                onChange={selectAll}
                disabled={!setSelected}
              />
            </th>
            <th className="p-3 text-left text-gray-300">SN.</th>

            <th className="p-3 text-left text-gray-300">Roll</th>

            <th className="p-3 text-left text-gray-300">Name</th>

            <th className="p-3 text-left text-gray-300">Stream</th>

            <th className="p-3 text-left text-gray-300">Section</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className="border-t border-gray-800">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={() => toggleSelect && toggleSelect(item.id)}
                />
              </td>
              <td className="p-3 text-white">{index + 1}.</td>

              <td className="p-3 text-white">{item.roll}</td>

              <td className="p-3 text-white">{item.name}</td>

              <td className="p-3">
                <span className="px-5 py-2 border border-indigo-500 rounded-lg text-indigo-400">
                  {item.stream}
                </span>
              </td>

              <td className="p-3">
                <span className="px-5 py-2border border-red-500rounded-lg text-red-400">
                  {item.section}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
