import React, { useState, useEffect } from "react";
import Modal from "../../components/common/Modal";

export default function PaymentInfoModal({
  isOpen,
  onClose,
  paymentData,
  setPaymentData,
  type,
}) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (type === "primary") {
      setFormData({
        clientId: paymentData.clientId,
        merchantId: paymentData.merchantId,
        secretKey: paymentData.secretKey,
      });
    } else {
      setFormData({
        otherClientId: paymentData.otherClientId,
        otherMerchantId: paymentData.otherMerchantId,
        otherSecretKey: paymentData.otherSecretKey,
      });
    }
  }, [paymentData, type]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setPaymentData({
      ...paymentData,
      ...formData,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === "primary" ? "Edit Primary Detail" : "Edit Other Detail"}
      width="max-w-2xl"
    >
      <div className="space-y-4">
        {type === "primary" ? (
          <>
            <div>
              <label className="block text-gray-400 mb-2 text-sm">
                Client ID
                <span className="text-red-500"> *</span>
              </label>

              <input
                name="clientId"
                value={formData.clientId || ""}
                onChange={handleChange}
                placeholder="Enter Client ID"
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm">
                Merchant ID
                <span className="text-red-500"> *</span>
              </label>

              <input
                name="merchantId"
                value={formData.merchantId || ""}
                onChange={handleChange}
                placeholder="Enter Merchant ID"
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm">
                Secret Key
                <span className="text-red-500"> *</span>
              </label>

              <input
                name="secretKey"
                value={formData.secretKey || ""}
                onChange={handleChange}
                placeholder="Enter Secret Key"
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-gray-400 mb-2 text-sm">
                Client ID
                <span className="text-red-500"> *</span>
              </label>

              <input
                name="otherClientId"
                value={formData.otherClientId || ""}
                onChange={handleChange}
                placeholder="Enter Client ID"
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm">
                Merchant ID
                <span className="text-red-500"> *</span>
              </label>

              <input
                name="otherMerchantId"
                value={formData.otherMerchantId || ""}
                onChange={handleChange}
                placeholder="Enter Merchant ID"
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm">
                Secret Key
                <span className="text-red-500"> *</span>
              </label>

              <input
                name="otherSecretKey"
                value={formData.otherSecretKey || ""}
                onChange={handleChange}
                placeholder="Enter Secret Key"
                className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-700 rounded-xl text-white cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 rounded-xl text-white cursor-pointer"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
