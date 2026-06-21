import React, { useState } from "react";
import { Search, Edit, Trash2 } from "lucide-react";

const Brand = () => {
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    category: "",
    subCategory: "",
    brandName: "",
    description: "",
  });

  const [brands, setBrands] = useState([
    {
      id: 1,
      brandCode: "CAT001SUBCAT001BR001",
      brandName: "HP",
      category: "COMPUTER (CAT005)",
      subCategory: "MOUSE (CAT005SUBCAT002)",
      description: "deskjet",
    },
    {
      id: 2,
      brandCode: "CAT006SUBCAT001BR001",
      brandName: "Lenovo Thinkcentre",
      category: "Computer and Accessories (CAT006)",
      subCategory: "Systems (CAT006SUBCAT001)",
      description: "NA",
    },
    {
      id: 3,
      brandCode: "CAT006SUBCAT002BR001",
      brandName: "Sanyo XGA",
      category: "Computer and Accessories (CAT006)",
      subCategory: "Projector (CAT006SUBCAT002)",
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
      subCategory: item.subCategory,
      brandName: item.brandName,
      description: item.description,
    });
  };

  const handleCancel = () => {
    setEditId(null);

    setForm({
      category: "",
      subCategory: "",
      brandName: "",
      description: "",
    });
  };

  const handleSave = () => {
    if (editId) {
      setBrands(
        brands.map((item) =>
          item.id === editId
            ? {
                ...item,
                ...form,
              }
            : item,
        ),
      );
    } else {
      setBrands([
        ...brands,
        {
          id: Date.now(),
          brandCode: "CAT00SUB00BR" + brands.length,
          ...form,
        },
      ]);
    }

    handleCancel();
  };

  const handleDelete = (id) => {
    setBrands(brands.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-10">
      {/* FORM */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-white">Brand</h1>

        <div className="border-t border-gray-800 mt-5 pt-6 grid grid-cols-4 gap-6 items-end">
          <div>
            <label className="text-gray-400">
              Select Category
              <span className="text-red-500"> *</span>
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 bg-gray-800 border cursor-pointer border-gray-700 rounded-lg px-4 py-3 text-white w-full"
            >
              <option value="">Select Category</option>

              <option>COMPUTER (CAT005)</option>

              <option>Furniture (CAT007)</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400">
              Select Sub-Category
              <span className="text-red-500"> *</span>
            </label>

            <select
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              className="mt-1 bg-gray-800 border cursor-pointer border-gray-700 rounded-lg px-4 py-3 text-white w-full"
            >
              <option value="">Select Sub-Category</option>

              <option>MOUSE (CAT005SUBCAT002)</option>

              <option>Systems (CAT006SUBCAT001)</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400">
              Brand Name
              <span className="text-red-500"> *</span>
            </label>

            <input
              name="brandName"
              value={form.brandName}
              onChange={handleChange}
              placeholder="Enter Brand Name..."
              className="mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
            />
          </div>

          <div>
            <label className="text-gray-400">
              Description
              <span className="text-red-500"> *</span>
            </label>

            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter Description..."
              className="mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 px-7 py-2 rounded-lg text-white cursor-pointer"
          >
            {editId ? "Update" : "Save"}
          </button>

          {editId && (
            <button
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 px-7 py-2 rounded-lg text-white cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* LIST */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Brand List</h2>

          <div className="relative w-72">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />

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
                "#",
                "Brand Code",
                "Brand Name",
                "Category",
                "Sub-Category",
                "Description",
                "Action",
              ].map((h) => (
                <th className="px-5 py-3 text-left text-gray-300">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {brands.map((item, index) => (
              <tr className="border-t border-gray-800">
                <td className="px-5 py-3 text-gray-300">{index + 1}</td>

                <td className="px-5 py-3 text-gray-300">{item.brandCode}</td>

                <td className="px-5 py-3 text-gray-300">{item.brandName}</td>

                <td className="px-5 py-3 text-gray-300">{item.category}</td>

                <td className="px-5 py-3 text-gray-300">{item.subCategory}</td>

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

export default Brand;
