import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const RouteVehicleModal = ({ close, editData }) => {
  const isEdit = !!editData;

  const [form, setForm] = useState({
    route: "",
    vehicle: "",
    driver: "",
    helper: "",
    pickupStart: "",
    pickupEnd: "",
    dropStart: "",
    dropEnd: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        route: editData.route,
        vehicle: editData.vehicle,
        driver: editData.driver,
        helper: editData.helper,
        pickupStart: "",
        pickupEnd: "",
        dropStart: "",
        dropEnd: "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitData = () => {
    console.log(form);

    close();
  };

  const resetForm = () => {
    setForm({
      route: "",
      vehicle: "",
      driver: "",
      helper: "",
      pickupStart: "",
      pickupEnd: "",
      dropStart: "",
      dropEnd: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[80%]">
        {/* header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">
            {isEdit ? "Edit Route Vehicle" : "Create Route Vehicle"}
          </h2>

          <X
            onClick={close}
            className="text-gray-400 hover:text-white cursor-pointer"
          />
        </div>

        {/* body */}

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <Select
              label="Route"
              name="route"
              value={form.route}
              change={handleChange}
              data={["Bhuj - madhapar - Morning Shift", "City Route"]}
            />

            <Select
              label="Vehicle"
              name="vehicle"
              value={form.vehicle}
              change={handleChange}
              data={["Vehicle 1", "Vehicle 2"]}
            />

            <Select
              label="Driver"
              name="driver"
              value={form.driver}
              change={handleChange}
              data={["Rajesh Gandhi", "Suresh Kumar"]}
            />

            <Select
              label="Helper"
              name="helper"
              value={form.helper}
              change={handleChange}
              data={["Suresh Kumar", "Helper 2"]}
            />
          </div>

          <div className="grid grid-cols-4 gap-5 mt-6">
            <Input
              label="Pickup Trip Start Time"
              type="time"
              name="pickupStart"
              value={form.pickupStart}
              change={handleChange}
            />

            <Input
              label="Pickup Trip End Time"
              type="time"
              name="pickupEnd"
              value={form.pickupEnd}
              change={handleChange}
            />

            <Input
              label="Drop Trip Start Time"
              type="time"
              name="dropStart"
              value={form.dropStart}
              change={handleChange}
            />

            <Input
              label="Drop Trip End Time"
              type="time"
              name="dropEnd"
              value={form.dropEnd}
              change={handleChange}
            />
          </div>
        </div>

        {/* footer */}

        <div className="p-5 border-t border-gray-800 flex justify-end gap-4">
          <button
            onClick={submitData}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg cursor-pointer"
          >
            {isEdit ? "Update" : "Submit"}
          </button>

          <button
            onClick={close}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, change, type = "text" }) => {
  return (
    <div>
      <label className="text-gray-400 text-sm">
        {label}
        <span className="text-red-500"> *</span>
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={change}
        className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
      />
    </div>
  );
};

const Select = ({ label, name, value, change, data }) => {
  return (
    <div>
      <label className="text-gray-400 text-sm">
        {label}
        <span className="text-red-500"> *</span>
      </label>

      <select
        name={name}
        value={value}
        onChange={change}
        className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full cursor-pointer"
      >
        <option value="">Select {label}</option>

        {data.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>
  );
};

export default RouteVehicleModal;
