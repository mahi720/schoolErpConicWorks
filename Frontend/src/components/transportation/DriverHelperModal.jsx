import React, { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";

const DriverHelperModal = ({ close, editData }) => {
  const isEdit = !!editData;

  const [form, setForm] = useState({
    role: "Driver",
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    dob: "",
    joiningDate: "",
    salary: "",
    status: "Active",
  });

  const [allowances, setAllowances] = useState([]);

  const [deductions, setDeductions] = useState([]);

  useEffect(() => {
    if (editData) {
      setForm({
        ...form,
        firstName: editData.name,
        mobile: editData.mobile,
        role: editData.role,
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

  const addAllowance = () => {
    setAllowances([
      ...allowances,
      {
        type: "",
        amount: "",
      },
    ]);
  };

  const addDeduction = () => {
    setDeductions([
      ...deductions,
      {
        type: "",
        percentage: "",
      },
    ]);
  };

  const changeAllowance = (index, e) => {
    let data = [...allowances];

    data[index][e.target.name] = e.target.value;

    setAllowances(data);
  };

  const changeDeduction = (index, e) => {
    let data = [...deductions];

    data[index][e.target.name] = e.target.value;

    setDeductions(data);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[85%] max-h-[90vh] flex flex-col">
        {/* header */}

        <div className="flex justify-between p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">
            {isEdit ? "Edit Driver/Helper" : "Create Driver/Helper"}
          </h2>

          <X
            onClick={close}
            className="text-gray-400 cursor-pointer hover:text-white"
          />
        </div>

        {/* body */}

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-3 gap-5">
            <Select
              label="Roles"
              name="role"
              value={form.role}
              change={handleChange}
              data={["Driver", "Helper"]}
            />

            <Input
              label="First Name"
              name="firstName"
              value={form.firstName}
              change={handleChange}
            />

            <Input
              label="Last Name"
              name="lastName"
              value={form.lastName}
              change={handleChange}
            />

            <Input
              label="Mobile"
              name="mobile"
              value={form.mobile}
              change={handleChange}
            />

            <Input
              label="Email"
              name="email"
              value={form.email}
              change={handleChange}
            />

            <Input label="Image" type="file" />

            <Input label="License" type="file" />

            <Input
              label="Date Of Birth"
              type="date"
              name="dob"
              value={form.dob}
              change={handleChange}
            />

            <Input
              label="Salary"
              name="salary"
              value={form.salary}
              change={handleChange}
            />

            <Select
              label="Session Year"
              name="session year"
              value={form.sessionYear}
              change={handleChange}
              data={["2023-24", "2025-26"]}
            />

            <Input
              label="Joining Date"
              type="date"
              name="joiningDate"
              value={form.joiningDate}
              change={handleChange}
            />

            <Select
              label="Status"
              name="status"
              value={form.status}
              change={handleChange}
              data={["Active", "Inactive"]}
            />
          </div>

          {/* allowance deduction */}

          <div className="grid grid-cols-2 gap-10 mt-10">
            {/* allowance */}

            <div>
              <h3 className="text-xl text-white mb-5">Allowances</h3>

              {allowances.map((item, index) => (
                <div className="flex gap-3 mb-4">
                  <select
                    name="type"
                    value={item.type}
                    onChange={(e) => changeAllowance(index, e)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white w-full"
                  >
                    <option value="">Allowance Type</option>

                    <option>Rent</option>

                    <option>Bonus</option>
                  </select>

                  {item.type && (
                    <input
                      name="amount"
                      value={item.amount}
                      onChange={(e) => changeAllowance(index, e)}
                      placeholder="Amount"
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 text-white w-full"
                    />
                  )}

                  <button
                    onClick={() =>
                      setAllowances(allowances.filter((_, i) => i !== index))
                    }
                    className="bg-red-500/20 px-3 rounded-lg cursor-pointer hover:bg-red-500/30 text-red-400"
                  >
                    <X />
                  </button>
                </div>
              ))}

              <button
                onClick={addAllowance}
                className="bg-emerald-600 px-5 py-3 rounded-lg text-white flex gap-2 cursor-pointer hover:bg-emerald-700"
              >
                <Plus />
                Add New Allowance
              </button>
            </div>

            {/* deductions */}

            <div>
              <h3 className="text-xl text-white mb-5">Deductions</h3>

              {deductions.map((item, index) => (
                <div className="flex gap-3 mb-4">
                  <select
                    name="type"
                    value={item.type}
                    onChange={(e) => changeDeduction(index, e)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white w-full"
                  >
                    <option value="">Deduction Type</option>

                    <option>PF</option>
                  </select>

                  {item.type && (
                    <input
                      name="percentage"
                      value={item.percentage}
                      onChange={(e) => changeDeduction(index, e)}
                      placeholder="Percentage"
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 text-white w-full"
                    />
                  )}

                  <button
                    onClick={() =>
                      setDeductions(deductions.filter((_, i) => i !== index))
                    }
                    className="bg-red-500/20 px-3 rounded-lg hover:bg-red-500/10 cursor-pointer text-red-400"
                  >
                    <X />
                  </button>
                </div>
              ))}

              <button
                onClick={addDeduction}
                className="bg-emerald-600 px-5 py-3 rounded-lg hover:bg-emerald-700 cursor-pointer text-white flex gap-2"
              >
                <Plus />
                Add New Deduction
              </button>
            </div>
          </div>
        </div>

        {/* footer */}

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button className="bg-cyan-600 hover:bg-cyan-700 cursor-pointer px-8 py-3 rounded-lg text-white">
            {isEdit ? "Update" : "Submit"}
          </button>

          <button
            onClick={close}
            className="bg-red-600 hover:bg-red-700 cursor-pointer px-8 py-3 rounded-lg text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, change, type = "text" }) => (
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
      placeholder={label}
      className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
    />
  </div>
);

const Select = ({ label, name, value, change, data }) => (
  <div>
    <label className="text-gray-400 text-sm">{label}</label>

    <select
      name={name}
      value={value}
      onChange={change}
      className="mt-2 bg-gray-800 border cursor-pointer border-gray-700 rounded-lg px-4 py-3 text-white w-full"
    >
      {data.map((i) => (
        <option key={i}>{i}</option>
      ))}
    </select>
  </div>
);

export default DriverHelperModal;
