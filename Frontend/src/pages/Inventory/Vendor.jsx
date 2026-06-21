import React, { useState } from "react";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import SupplierModal from "../../components/Inventory/SupplierModal";

const Vendor = () => {
  const [search, setSearch] = useState("");
  const [supplierModal, setSupplierModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    gst: "",
    tds: "",
  });

  const suppliers = [
    {
      id: 1,
      name: "Supplier Test 1",
      email: "test@gmail.com",
      contact: "9639639639",
      address: "Supplier Test 1 Address",
      gst: "GST001",
      tds: "10",
    },
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveSupplier = () => {
    console.log(form);
  };

  return (
    <div className="space-y-8">
      {/* Supplier Form */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl text-white font-semibold">Supplier</h1>
          <button
            onClick={() => {
              setEditData(null);
              setSupplierModal(true);
            }}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg cursor-pointer"
          >
            Create Supplier
          </button>
        </div>
      </div>

      {/* Supplier List */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-white font-semibold">Supplier List</h2>

          <div className="relative w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search here.."
              className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white min-w-full outline-none"
            />
          </div>
        </div>

        <div className="overflow-auto custom-scrollbar">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-800">
              <tr>
                {[
                  "SNo.",
                  "Supplier Name",
                  "Supplier Email",
                  "Supplier Contact",
                  "Supplier Address",
                  "GST No",
                  "TDS Liability",
                  "Action",
                ].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-gray-300">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {suppliers.map((item, index) => (
                <tr key={item.id} className="border-t border-gray-800">
                  <td className="px-5 py-4 text-gray-300">{index + 1}.</td>

                  <td className="px-5 py-4 text-gray-300">{item.name}</td>

                  <td className="px-5 py-4 text-gray-300">{item.email}</td>

                  <td className="px-5 py-4 text-gray-300">{item.contact}</td>

                  <td className="px-5 py-4 text-gray-300">{item.address}</td>

                  <td className="px-5 py-4 text-gray-300">{item.gst}</td>

                  <td className="px-5 py-4 text-gray-300">{item.tds}</td>

                  <td className="px-5 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditData(item);
                          setSupplierModal(true);
                        }}
                        title="Edit"
                        className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-lg cursor-pointer"
                      >
                        <Edit size={18} className="text-white" />
                      </button>

                      <button
                        title="Delete"
                        className="bg-red-500 hover:bg-red-600 p-2 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={18} className="text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {supplierModal && (
        <SupplierModal
          close={() => {
            setSupplierModal(false);
            setEditData(null);
          }}
          editData={editData}
        />
      )}
    </div>
  );
};

const Input = ({ label, name, change }) => (
  <div>
    <label className="text-gray-400 text-sm">
      {label}
      <span className="text-red-500"> *</span>
    </label>

    <input
      name={name}
      onChange={change}
      placeholder="type here....."
      className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white w-full"
    />
  </div>
);

export default Vendor;
