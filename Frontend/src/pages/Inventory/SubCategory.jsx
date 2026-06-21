import React, { useState } from "react";
import { Search, Edit, Trash2 } from "lucide-react";

const SubCategory = () => {
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    category: "",
    subCategoryName: "",
    description: "",
  });

  const [subCategories, setSubCategories] = useState([
    {
      id: 1,
      subCategoryCode: "CAT001SUBCAT001",
      subCategoryName: "Keyboard",
      category: "COMPUTER (CAT005)",
      description: "keyboard",
    },
    {
      id: 2,
      subCategoryCode: "CAT005SUBCAT002",
      subCategoryName: "MOUSE",
      category: "COMPUTER (CAT005)",
      description: "MOUSE SMALL",
    },
    {
      id: 3,
      subCategoryCode: "CAT006SUBCAT001",
      subCategoryName: "System",
      category: "Computer and Accessories (CAT006)",
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
      category: item.category,
      subCategoryName: item.subCategoryName,
      description: item.description,
    });
  };

  const handleCancel = () => {
    setEditId(null);

    setForm({
      category: "",
      subCategoryName: "",
      description: "",
    });
  };

  const handleSave = () => {
    if (editId) {
      setSubCategories(
        subCategories.map((item) =>
          item.id === editId
            ? {
                ...item,
                ...form,
              }
            : item,
        ),
      );
    } else {
      setSubCategories([
        ...subCategories,
        {
          id: Date.now(),
          subCategoryCode: "CAT00SUB" + subCategories.length,
          ...form,
        },
      ]);
    }

    handleCancel();
  };

  const handleDelete = (id) => {
    setSubCategories(subCategories.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-10">
      {/* Form */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-white">Sub Category</h1>

        <div className="border-t border-gray-800 mt-5 pt-6 flex gap-6 items-end">
          <div className="flex-1">
            <label className="text-gray-400">
              Select Category
              <span className="text-red-500"> *</span>
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
            >
              <option value="">Select Category</option>

              <option>COMPUTER (CAT005)</option>

              <option>Furniture (CAT007)</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="text-gray-400">
              Sub-Category Name
              <span className="text-red-500"> *</span>
            </label>

            <input
              name="subCategoryName"
              value={form.subCategoryName}
              onChange={handleChange}
              placeholder="type here....."
              className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
            />
          </div>

          <div className="flex-1">
            <label className="text-gray-400">
              Description
              <span className="text-red-500"> *</span>
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
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl text-white font-semibold">
            Sub-Category List
          </h2>

          <div className="relative w-72">
            <Search className="absolute left-3 top-4 text-gray-400" size={18} />

            <input
              placeholder="Search by Name or ID"
              className="bg-gray-800 border border-gray-700 rounded-xl pl-10 py-3 text-white w-full"
            />
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              {[
                "SNo.",
                "Sub-Category Code",
                "SubCategory Name",
                "Category",
                "Description",
                "Action",
              ].map((h) => (
                <th className="px-5 py-3 text-left text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {subCategories.map((item, index) => (
              <tr className="border-t border-gray-800">
                <td className="px-5 py-3 text-gray-300">{index + 1}.</td>

                <td className="px-5 py-3 text-gray-300">
                  {item.subCategoryCode}
                </td>

                <td className="px-5 py-3 text-gray-300">
                  {item.subCategoryName}
                </td>

                <td className="px-5 py-3 text-gray-300">{item.category}</td>

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

export default SubCategory;
