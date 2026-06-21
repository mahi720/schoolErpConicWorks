import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const AddProductModal = ({ close, editData }) => {
  const isEdit = !!editData;

  const [form, setForm] = useState({
    productCode: "",
    category: "",
    subCategory: "",
    brand: "",
    productName: "",
    unit: "",
    description: "",
    quantity: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        ...form,
        ...editData,
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveProduct = () => {
    if (isEdit) {
      console.log("Update Product", form);
    } else {
      console.log("Add Product", form);
    }

    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[70%] max-h-[90vh] flex flex-col">
        {/* header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>

          <X
            onClick={close}
            className="text-gray-400 hover:text-white cursor-pointer"
          />
        </div>

        {/* body */}

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-6">
            {isEdit && (
              <Input
                label="Product Code"
                name="productCode"
                value={form.productCode}
                disabled={true}
              />
            )}

            <Select
              label="Select Category"
              name="category"
              value={form.category}
              change={handleChange}
              disabled={isEdit}
              placeholder="Select Category"
              options={[
                {
                  label: "Computer",
                  value: "CAT005",
                },
                {
                  label: "Furniture",
                  value: "CAT007",
                },
              ]}
            />

            <Select
              label="Sub-Category"
              name="subCategory"
              value={form.subCategory}
              change={handleChange}
              disabled={isEdit}
              placeholder="Select Sub Category"
              options={[
                {
                  label: "Mouse",
                  value: "SUB001",
                },
                {
                  label: "Keyboard",
                  value: "SUB002",
                },
              ]}
            />

            <Select
              label="Brand"
              name="brand"
              value={form.brand}
              change={handleChange}
              disabled={isEdit}
              placeholder="Select Brand"
              options={[
                {
                  label: "HP",
                  value: "BR001",
                },
                {
                  label: "Lenovo",
                  value: "BR002",
                },
              ]}
            />

            <Input
              label="Product Name"
              name="productName"
              value={form.productName}
              change={handleChange}
              placeholder="Enter Product Name"
            />

            <Input
              label="Product Unit"
              name="unit"
              value={form.unit}
              change={handleChange}
              placeholder="Enter Product Unit"
            />

            <div>
              <label className="text-gray-400 font-normal text-sm">
                Description
                <span className="text-red-500"> *</span>
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter Product Description"
                rows={4}
                className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full resize-none"
              />
            </div>
          </div>
        </div>

        {/* footer */}

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={saveProduct}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg cursor-pointer"
          >
            {isEdit ? "Update" : "Save"}
          </button>

          <button
            onClick={close}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, placeholder, change, value, disabled }) => {
  return (
    <div>
      <label className="text-gray-400 font-normal text-sm">
        {label}
        <span className="text-red-500"> *</span>
      </label>

      <input
        name={name}
        value={value}
        disabled={disabled}
        onChange={change}
        placeholder={placeholder}
        className={`mt-2 border border-gray-700 rounded-lg px-4 py-3 text-white w-full ${
          disabled
            ? "bg-gray-700 cursor-not-allowed text-gray-400"
            : "bg-gray-800"
        }`}
      />
    </div>
  );
};

const Select = ({
  label,
  name,
  options,
  placeholder,
  change,
  value,
  disabled,
}) => {
  return (
    <div>
      <label className="text-gray-400 font-normal text-sm">
        {label}
        <span className="text-red-500"> *</span>
      </label>

      <select
        name={name}
        value={value}
        disabled={disabled}
        onChange={change}
        className={`mt-2 border cursor-pointer border-gray-700 rounded-lg px-4 py-3 text-white w-full ${
          disabled
            ? "bg-gray-700 cursor-not-allowed text-gray-400"
            : "bg-gray-800"
        }`}
      >
        <option value="">{placeholder}</option>

        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AddProductModal;
