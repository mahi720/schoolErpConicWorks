import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const SupplierModal = ({ close, editData }) => {
  const isEdit = !!editData;

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    gst: "",
    tds: "",
  });

  useEffect(() => {
    if (editData) {
      setForm(editData);
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveSupplier = () => {
    if (isEdit) {
      console.log("update", form);
    } else {
      console.log("save", form);
    }

    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[60%]">
        <div className="flex justify-between p-5 border-b border-gray-800">
          <h2 className="text-white text-xl">
            {isEdit ? "Edit Supplier" : "Create Supplier"}
          </h2>

          <X
            onClick={close}
            className="text-gray-400 hover:text-white cursor-pointer"
          />
        </div>

        <div className="p-6 grid grid-cols-2 gap-5">
          <Input
            label="Supplier Name"
            name="name"
            value={form.name}
            change={handleChange}
            placeholder="Enter Supplier Name"
          />

          <Input
            label="Supplier Email"
            name="email"
            value={form.email}
            change={handleChange}
            placeholder="Enter Supplier Email"
          />

          <Input
            label="Supplier Contact"
            name="contact"
            value={form.contact}
            change={handleChange}
            placeholder="Enter Contact Number"
          />

          <Input
            label="GST No"
            name="gst"
            value={form.gst}
            change={handleChange}
            placeholder="Enter GST Number"
          />

          <Input
            label="TDS Liability"
            name="tds"
            value={form.tds}
            change={handleChange}
            placeholder="Enter TDS Liability"
          />

          <div>
            <label className="text-gray-400 text-sm">Address</label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter Supplier Address"
              className="mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
            />
          </div>
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={saveSupplier}
            className="bg-cyan-600 hover:bg-cyan-700 cursor-pointer text-white px-6 py-3 rounded-lg"
          >
            {isEdit ? "Update" : "Save"}
          </button>

          <button
            onClick={close}
            className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-6 py-3 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, change, placeholder }) => (
  <div>
    <label className="text-gray-400 text-sm">{label}</label>

    <input
      name={name}
      value={value}
      onChange={change}
      placeholder={placeholder}
      className="mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
    />
  </div>
);

export default SupplierModal;
