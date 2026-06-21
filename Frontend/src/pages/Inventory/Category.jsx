import React, { useState } from "react";
import { Search, Edit, Trash2 } from "lucide-react";

const Category = () => {
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [categories, setCategories] = useState([
    {
      id: 1,
      code: "CAT001",
      name: "Cat Test 1",
      description: "Cat Test 1 Description",
    },
    {
      id: 2,
      code: "CAT005",
      name: "COMPUTER",
      description: "computer items",
    },
    {
      id: 3,
      code: "CAT006",
      name: "Computer and Accessories",
      description: "NA",
    },
    {
      id: 4,
      code: "CAT007",
      name: "Furniture",
      description: "NA",
    },
  ]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (item) => {
    setEditId(item.id);

    setForm({
      name: item.name,
      description: item.description,
    });
  };

  const handleCancel = () => {
    setEditId(null);

    setForm({
      name: "",
      description: "",
    });
  };

  const handleSave = () => {
    if (editId) {
      setCategories(
        categories.map((item) =>
          item.id === editId
            ? {
                ...item,
                name: form.name,
                description: form.description,
              }
            : item,
        ),
      );
    } else {
      setCategories([
        ...categories,
        {
          id: Date.now(),
          code: "CAT00" + categories.length,
          ...form,
        },
      ]);
    }

    handleCancel();
  };

  return (
    <div className="space-y-10">
      {/* Form */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-white">Category</h1>

        <div className="border-t border-gray-800 mt-5 pt-6 flex gap-6 items-end">
          <div className="flex-1">
            <label className="text-gray-400">
              Category Name
              <span className="text-red-500">*</span>
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="type here....."
              className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
            />
          </div>

          <div className="flex-1">
            <label className="text-gray-400">
              Description
              <span className="text-red-500">*</span>
            </label>

            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="type here....."
              className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 px-7 py-3 text-white rounded-lg cursor-pointer"
          >
            {editId ? "Update" : "Save"}
          </button>

          {editId && (
            <button
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 px-7 py-3 text-white rounded-lg cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Category List</h2>

          <div className="flex justify-end">
            <div className="relative w-72">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                placeholder="Search by Name or id..."
                className="bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white w-full outline-none"
              />
            </div>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SNo.",
                "Category Code",
                "Category Name",
                "Description",
                "Action",
              ].map((h) => (
                <th className="px-5 py-3 text-left text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {categories.map((item, index) => (
              <tr className="border-t border-gray-800">
                <td className="px-5 py-3 text-gray-300">{index + 1}.</td>

                <td className="px-5 py-3 text-gray-300">{item.code}</td>

                <td className="px-5 py-3 text-gray-300">{item.name}</td>

                <td className="px-5 py-3 text-gray-300">{item.description}</td>

                <td className="p-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg cursor-pointer"
                    >
                      <Edit size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg cursor-pointer"
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
    </div>
  );
};

export default Category;
