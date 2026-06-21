import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

export default function AuthorizedPersons() {
  const [persons, setPersons] = useState([
    { id: 1, name: "Rohan", designations: "PRINCIPAL" },
    { id: 2, name: "Rima", designations: "PGT" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    designations: "",
  });

  const [editId, setEditId] = useState(null);

  const handleSave = () => {
    if (editId) {
      setPersons(
        persons.map((item) =>
          item.id === editId
            ? {
                ...item,
                name: formData.name,
                designations: formData.designations,
              }
            : item,
        ),
      );

      setEditId(null);
    } else {
      setPersons([
        ...persons,
        {
          id: Date.now(),
          name: formData.name,
          designations: formData.designations,
        },
      ]);
    }

    setFormData({
      name: "",
      designations: "",
    });
  };

  const handleEdit = (item) => {
    setEditId(item.id);

    setFormData({
      name: item.name,
      designations: item.designations,
    });
  };

  const handleDelete = (id) => {
    setPersons(persons.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
      <h2 className="text-xl text-white font-semibold">Authorized Persons</h2>

      <hr className="border-gray-800" />

      {/* FORM */}

      <div className="flex items-end gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-gray-300">
            Person Name <span className="text-red-500">*</span>
          </label>

          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Person Name"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-70"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-300">
            Designation Level <span className="text-red-500">*</span>
          </label>

          <input
            value={formData.designations}
            onChange={(e) =>
              setFormData({ ...formData, designations: e.target.value })
            }
            placeholder="Designation Level"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-70"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 px-6 w-30 py-3 rounded-lg text-white cursor-pointer"
        >
          {editId ? "Update" : "Save"}
        </button>
      </div>

      {/* TABLE */}

      <table className="w-full">
        <thead>
          <tr className="border border-gray-800">
            <th className="p-3 text-gray-300">Sno.</th>

            <th className="p-3 text-gray-300">Name</th>

            <th className="p-3 text-gray-300">Designation Name</th>

            <th className="p-3 text-gray-300">Action</th>
          </tr>
        </thead>

        <tbody>
          {persons.map((item, index) => (
            <tr key={item.id} className="border border-gray-800 text-center">
              <td className="p-3 text-gray-300">{index + 1}.</td>

              <td className="p-3 text-gray-300">{item.name}</td>

              <td className="p-3 text-gray-300">{item.designations}</td>

              <td className="p-3 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg cursor-pointer text-white"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 hover:bg-red-600 p-2 rounded-lg cursor-pointer text-white"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
