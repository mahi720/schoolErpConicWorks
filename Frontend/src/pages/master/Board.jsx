import React, { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { Pencil, Plus, Trash2, X } from "lucide-react";

export default function Board() {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const boards = [
    {
      id: 1,
      title: "CBSE",
      description: "Central Board of Secondary Education",
    },
    {
      id: 2,
      title: "ICSE",
      description: "Indian Certificate of Secondary Education",
    },
  ];

  const columns = [
    {
      key: "sn",
      label: "SN",
      render: (v, row, index) => index + 1,
    },
    {
      key: "title",
      label: "Board Title",
      // sortable: true,
    },
    {
      key: "description",
      label: "Description",
    },
  ];

  const actions = [
    {
      label: <Pencil size={16} />,
      onClick: (row) => {
        console.log("Edit", row);
      },
    },

    {
      label: <Trash2 size={16} />,
      variant: "danger",
      onClick: (row) => {
        console.log("Delete", row);
      },
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    setShowModal(false);

    setFormData({
      title: "",
      description: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Boards</h1>

          <p className="text-gray-400 mt-1">Manage school boards</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center cursor-pointer gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Add Board
        </button>
      </div>
      {/* Table */}
      <DataTable
        columns={columns}
        data={boards}
        searchFields={["title"]}
        title="Board List"
        actions={actions}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-white">Add Board</h2>

              <button onClick={() => setShowModal(false)}>
                <X className="text-white cursor-pointer size={22}" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-300">Board Title</label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter Board Name"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300">Description</label>

                <textarea
                  name="description"
                  rows="4"
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 mt-1 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border cursor-pointer border-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
