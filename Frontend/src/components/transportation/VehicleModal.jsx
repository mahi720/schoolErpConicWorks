import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const VehicleModal = ({ close, editData }) => {
  const isEdit = !!editData;

  const [form, setForm] = useState({
    name: "",
    number: "",
    capacity: "",
    status: "Active",
    image: [],
  });

  const handleImageChange = (e) => {
    setForm({
      ...form,
      image: Array.from(e.target.files),
    });
  };

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

  const saveVehicle = () => {
    console.log(form);

    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[60%]">
        <div className="flex justify-between p-5 border-b border-gray-800">
          <h2 className="text-white text-xl">
            {isEdit ? "Edit Vehicle" : "Create Vehicle"}
          </h2>

          <X
            onClick={close}
            className="text-gray-400 hover:text-white cursor-pointer"
          />
        </div>

        <div className="p-6 grid grid-cols-2 gap-5">
          <Input
            label="Name"
            name="name"
            value={form.name}
            change={handleChange}
            placeholder="Vehicle Name"
          />

          <Input
            label="Vehicle Number"
            name="number"
            value={form.number}
            change={handleChange}
            placeholder="Vehicle Number"
          />

          <Input
            label="Vehicle Capacity"
            name="capacity"
            value={form.capacity}
            change={handleChange}
            placeholder="Vehicle Capacity"
          />

          <div>
            <label className="text-gray-400 text-sm">Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-2 bg-gray-800 cursor-pointer border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
            >
              <option>Active</option>

              <option>Inactive</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-sm">
              Images
              <span className="text-blue-400 text-xs">
                {" "}
                (Upload multiple images)
              </span>
            </label>

            <div className="mt-2 flex">
              <input
                value={
                  form.image.length > 0
                    ? `${form.image.length} Images Selected`
                    : ""
                }
                readOnly
                placeholder="Images"
                className="bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-3 text-white w-full"
              />

              <label className="bg-cyan-700 hover:bg-cyan-800 text-white px-8 py-3 rounded-r-lg cursor-pointer">
                Upload
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={saveVehicle}
            className="bg-cyan-600 hover:bg-cyan-700 cursor-pointer text-white px-6 py-3 rounded-lg"
          >
            {isEdit ? "Update" : "Submit"}
          </button>

          <button
            onClick={close}
            className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-6 py-3 rounded-lg"
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
    <label className="text-gray-400 text-sm">
      {label}
      <span className="text-red-500"> *</span>
    </label>

    <input
      name={name}
      value={value}
      onChange={change}
      placeholder={placeholder}
      className="mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
    />
  </div>
);

export default VehicleModal;
