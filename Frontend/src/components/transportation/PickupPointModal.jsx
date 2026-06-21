import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const PickupPointModal = ({ close, editData }) => {
  const isEdit = !!editData;

  const [form, setForm] = useState({
    name: "",
    status: "Active",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        status: editData.status,
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const savePickup = () => {
    if (isEdit) {
      console.log("update", form);
    } else {
      console.log("create", form);
    }

    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[50%]">
        {/* header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">
            {isEdit ? "Edit Pickup Point" : "Create Pickup Point"}
          </h2>

          <X
            onClick={close}
            className="text-gray-400 hover:text-white cursor-pointer"
          />
        </div>

        {/* body */}

        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <label className="text-gray-400 text-sm">
              Name
              <span className="text-red-500"> *</span>
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Pickup Point Name"
              className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full outline-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">
              Status
              <span className="text-red-500"> *</span>
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full cursor-pointer"
            >
              <option>Active</option>

              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* footer */}

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={savePickup}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg cursor-pointer"
          >
            {isEdit ? "Update" : "Submit"}
          </button>

          <button
            onClick={close}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickupPointModal;
