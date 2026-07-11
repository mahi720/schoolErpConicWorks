import React, { useEffect, useState } from "react";

import Modal from "../../components/common/Modal";

import { usePaymentInfoStore } from "../../store/master/paymentInfo/paymentInfoStore";

import {
  primaryPaymentSchema,
  otherPaymentSchema,
} from "../../validations/master/paymentInfo/paymentInfoSchema";

export default function PaymentInfoModal({
  isOpen,
  onClose,
  paymentData,
  type,
}) {
  const [formData, setFormData] = useState({});

  const [errors, setErrors] = useState({});

  const { updatePaymentInfo, submitLoading } = usePaymentInfoStore();

  useEffect(() => {
    if (type === "primary") {
      setFormData({
        clientId: paymentData?.clientId || "",

        merchantId: paymentData?.merchantId || "",

        secretKey: paymentData?.secretKey || "",
      });
    } else {
      setFormData({
        otherClientId: paymentData?.otherClientId || "",

        otherMerchantId: paymentData?.otherMerchantId || "",

        otherSecretKey: paymentData?.otherSecretKey || "",
      });
    }

    setErrors({});
  }, [paymentData, type, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: undefined,
      }));
    }
  };

  const handleSave = async () => {
    const schema =
      type === "primary" ? primaryPaymentSchema : otherPaymentSchema;

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    const success = await updatePaymentInfo(type, result.data);

    if (success) {
      onClose();
    }
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
                className={`w-full bg-gray-800 border p-3 rounded-xl text-white ${
                  errors.clientId ? "border-red-500" : "border-gray-700"
                }`}
              />

              {errors.clientId && (
                <p className="mt-1 text-xs text-red-500">{errors.clientId}</p>
              )}
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
                className={`w-full bg-gray-800 border p-3 rounded-xl text-white ${
                  errors.merchantId ? "border-red-500" : "border-gray-700"
                }`}
              />

              {errors.merchantId && (
                <p className="mt-1 text-xs text-red-500">{errors.merchantId}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm">
                Secret Key
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="password"
                name="secretKey"
                value={formData.secretKey || ""}
                onChange={handleChange}
                placeholder="Enter Secret Key"
                className={`w-full bg-gray-800 border p-3 rounded-xl text-white ${
                  errors.secretKey ? "border-red-500" : "border-gray-700"
                }`}
              />

              {errors.secretKey && (
                <p className="mt-1 text-xs text-red-500">{errors.secretKey}</p>
              )}
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
                className={`w-full bg-gray-800 border p-3 rounded-xl text-white ${
                  errors.otherClientId ? "border-red-500" : "border-gray-700"
                }`}
              />

              {errors.otherClientId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.otherClientId}
                </p>
              )}
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
                className={`w-full bg-gray-800 border p-3 rounded-xl text-white ${
                  errors.otherMerchantId ? "border-red-500" : "border-gray-700"
                }`}
              />

              {errors.otherMerchantId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.otherMerchantId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm">
                Secret Key
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="password"
                name="otherSecretKey"
                value={formData.otherSecretKey || ""}
                onChange={handleChange}
                placeholder="Enter Secret Key"
                className={`w-full bg-gray-800 border p-3 rounded-xl text-white ${
                  errors.otherSecretKey ? "border-red-500" : "border-gray-700"
                }`}
              />

              {errors.otherSecretKey && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.otherSecretKey}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          disabled={submitLoading}
          className="px-4 py-2 border border-gray-700 rounded-xl text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={submitLoading}
          className="px-4 py-2 bg-blue-600 rounded-xl text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
}
