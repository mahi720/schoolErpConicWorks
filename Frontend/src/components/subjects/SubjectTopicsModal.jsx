import React, { useState } from "react";

import Modal from "../common/Modal";

import { Pencil, Search, Trash2 } from "lucide-react";

export default function SubjectTopicsModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");

  const [group, setGroup] = useState("");

  const [topics, setTopics] = useState([
    {
      id: 1,
      title: "Algebra",
      group: "Group A",
    },

    {
      id: 2,
      title: "Geometry",
      group: "Group A",
    },

    {
      id: 3,
      title: "Trigonometry",
      group: "Group B",
    },

    {
      id: 4,
      title: "Statistics",
      group: "Group B",
    },

    {
      id: 5,
      title: "Probability",
      group: "Group C",
    },
    {
      id: 6,
      title: "Probability",
      group: "Group C",
    },
    {
      id: 7,
      title: "Probability",
      group: "Group ;lafkja lkafkaja oaijiafja amv,amffa oiijfa  C",
    },
    {
      id: 8,
      title: "Probability",
      group: "Group C",
    },
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Subject Topics"
      width="max-w-3xl"
    >
      <div className="grid grid-cols-[1fr_1fr_auto] gap-3 mb-6">
        <textarea
          placeholder="Subject Topic Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={3}
          className="p-3 bg-gray-800 rounded-xl text-white resize-none border border-gray-700"
        />

        <textarea
          placeholder="Subject Topic Group"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          rows={3}
          className="p-3 bg-gray-800 rounded-xl text-white resize-none border border-gray-700"
        />

        <button className="h-full min-h-[96px] bg-blue-600 hover:bg-blue-700 transition cursor-pointer px-6 rounded-xl text-white font-medium">
          Create
        </button>
      </div>

      <div className="border border-gray-800 rounded-xl overflow-hidden">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {/* Header */}

          <div className="p-5 flex justify-between items-center flex-wrap border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">
              Subject Topic List
            </h2>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-4 text-gray-400"
              />

              <input
                placeholder="Search"
                className="w-[300px] bg-gray-800 border border-gray-700 pl-10 p-3 rounded-xl text-white"
              />
            </div>
          </div>
          <div
            className={`overflow-y-auto custom-scrollbar ${
              topics.length > 5 ? "max-h-[280px]" : ""
            }`}
          >
            <table className="w-full table-fixed">
              <thead className="bg-gray-800 text-gray-300 sticky top-0 z-10">
                <tr>
                  <th className="w-[80px] p-4 text-left">SN</th>

                  <th className="w-[35%] p-4 text-left">Topic</th>

                  <th className="w-[35%] p-4 text-left">Group</th>

                  <th className="w-[150px] p-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {topics.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-800 hover:bg-gray-800/40"
                  >
                    <td className="p-4 text-white">{index + 1}</td>

                    <td className="p-4 text-white">{item.title}</td>

                    <td className="p-4 text-white">{item.group}</td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 cursor-pointer">
                          <Pencil size={16} />
                        </button>

                        <button className="p-2 rounded-lg bg-red-500/20 text-red-400 cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}
