import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import PublisherModal from "../../components/library/PublisherEditModal";
// import PublisherModal from "./PublisherModal";

export default function BookPublisher() {
  const [publisher, setPublisher] = useState("");
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [list, setList] = useState([
    {
      id: 1,
      name: "Arihant",
    },
    {
      id: 2,
      name: "Test",
    },
  ]);

  const savePublisher = () => {
    if (!publisher) return;

    setList([
      ...list,
      {
        id: Date.now(),
        name: publisher,
      },
    ]);

    setPublisher("");
  };

  const updatePublisher = (data) => {
    setList(list.map((item) => (item.id === data.id ? data : item)));

    setOpen(false);
  };

  const deletePublisher = (id) => {
    setList(list.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-10">
      {/* Create */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl text-white font-semibold">
          Create Book Publisher
        </h2>

        <hr className="border-gray-800 my-5" />

        <div className="flex items-end gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-gray-300">
              Book Publisher
              <span className="text-red-500"> *</span>
            </label>

            <input
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="Enter Publisher Name"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-96"
            />
          </div>

          <button
            onClick={savePublisher}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl text-white mb-5">Book Publisher List</h2>

        <table className="w-full">
          <thead className="border-y border-gray-800">
            <tr>
              <th className="p-3 text-gray-300">SNo.</th>

              <th className="p-3 text-gray-300">Publisher Name</th>

              <th className="p-3 text-gray-300">Action</th>
            </tr>
          </thead>

          <tbody>
            {list.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-gray-800 text-center"
              >
                <td className="p-3 text-gray-300">{index + 1}.</td>

                <td className="p-3 text-gray-300">{item.name}</td>

                <td className="p-3">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setEditData(item);
                        setOpen(true);
                      }}
                      className="text-indigo-400 cursor-pointer"
                    >
                      <Edit size={17} />
                    </button>

                    <button
                      onClick={() => deletePublisher(item.id)}
                      className="text-red-500 cursor-pointer"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PublisherModal
        open={open}
        close={() => setOpen(false)}
        data={editData}
        update={updatePublisher}
      />
    </div>
  );
}
