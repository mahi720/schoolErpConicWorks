import React, { useState } from "react";
import { X } from "lucide-react";

const IncreaseQuantityModal = ({ close }) => {
  const [quantity, setQuantity] = useState("");

  const handleIncrease = () => {
    console.log("Increase Quantity:", quantity);

    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[450px]">
        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl text-white">Increase Product Quantity</h2>

          <X
            size={22}
            onClick={close}
            className="text-gray-400 hover:text-white cursor-pointer"
          />
        </div>

        {/* Body */}

        <div className="p-6">
          <div className="flex items-center gap-8">
            <label className="text-gray-400 text-sm w-32">
              Product Quantity
              <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="type here....."
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none flex-1"
            />
          </div>
        </div>

        {/* Footer */}

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={handleIncrease}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-lg cursor-pointer"
          >
            Increase
          </button>

          <button
            onClick={close}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncreaseQuantityModal;
