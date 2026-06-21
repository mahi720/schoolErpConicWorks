import React, { useState } from "react";
import { Edit, Trash2, Settings, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PayBand() {
  const navigate = useNavigate();
  const [payBand, setPayBand] = useState("");
  const [image, setImage] = useState(null);
  const data = ["92500", "78800", "53600", "52000", "47600", "46300", "46200"];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const savePayBand = () => {
    console.log(payBand);
    setPayBand("");
  };

  return (
    <div className="space-y-8">
      {/* Heading */}

      <h1 className="text-2xl font-bold text-white">Pay Band</h1>

      {/* Add Section */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-end justify-between gap-5">
          <div className="flex items-end gap-5">
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm">
                Pay Band<span className="text-red-500"> *</span>
              </label>

              <input
                value={payBand}
                onChange={(e) => setPayBand(e.target.value)}
                placeholder="Pay Band"
                className="mt-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white w-80 outline-none"
              />
            </div>

            <button
              onClick={savePayBand}
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-lg text-white cursor-pointer"
            >
              Save
            </button>
          </div>

          <div className="flex items-center gap-5">
            {image && (
              <img
                src={image}
                alt="preview"
                className="w-40 h-20 object-contain rounded-lg border border-gray-700"
              />
            )}

            <label className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-lg text-white cursor-pointer">
              <Upload size={17} />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-4 text-gray-300 text-center">S no.</th>

              <th className="p-4 text-gray-300 text-center">Pay Band</th>

              <th className="p-4 text-gray-300 text-center">Options</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-t border-gray-800 hover:bg-gray-800/50"
              >
                <td className="p-4 text-gray-300 text-center">{index + 1}</td>

                <td className="p-4 text-gray-300 text-center">{item}</td>

                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button className="bg-cyan-500 hover:bg-cyan-600 p-3 rounded-lg text-white cursor-pointer">
                      <Edit size={16} />
                    </button>

                    <button className="bg-red-500 hover:bg-red-600 p-3 rounded-lg text-white cursor-pointer">
                      <Trash2 size={16} />
                    </button>

                    <button
                      onClick={() =>
                        navigate("/hrm/settings/payband-structure")
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 p-3 rounded-lg text-white cursor-pointer"
                    >
                      <Settings size={16} />
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
}
