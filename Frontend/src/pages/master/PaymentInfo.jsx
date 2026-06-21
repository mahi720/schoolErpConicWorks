import React, { useState } from "react";
import { Pencil } from "lucide-react";
import PaymentInfoModal from "../../components/PaymentInfo/PaymentInfoModal";

export default function PaymentInfo() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("primary");

  const [paymentData, setPaymentData] = useState({
    clientId: "",
    merchantId: "",
    secretKey: "",

    otherClientId: "",
    otherMerchantId: "",
    otherSecretKey: "",
  });

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="bg-gray-800 p-3 rounded-xl">
        <h1 className="text-3xl font-bold text-white">Payment Info</h1>

        <p className="text-gray-400 mt-1">Manage payment configuration</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Primary Detail */}

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-white text-2xl">Primary Detail</h2>

            <button
              onClick={() => {
                setModalType("primary");
                setShowModal(true);
              }}
              className="bg-blue-600 p-2 rounded-lg cursor-pointer"
            >
              <Pencil size={16} className="text-white" />
            </button>
          </div>

          <div className="space-y-5 mt-8">
            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="font-semibold text-gray-400">CLIENT ID:</span>

              <span className="text-white">{paymentData.clientId || "NA"}</span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="font-semibold text-gray-400">MERCHANT ID:</span>

              <span className="text-white">
                {paymentData.merchantId || "NA"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-400">SECRET KEY:</span>

              <span className="text-white">
                {paymentData.secretKey || "NA"}
              </span>
            </div>
          </div>
        </div>

        {/* Other Detail */}

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-white text-2xl">Other Detail</h2>

            <button
              onClick={() => {
                setModalType("other");
                setShowModal(true);
              }}
              className="bg-blue-600 p-2 rounded-lg cursor-pointer"
            >
              <Pencil size={16} className="text-white" />
            </button>
          </div>

          <div className="space-y-5 mt-8">
            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="font-semibold text-gray-400">CLIENT ID:</span>

              <span className="text-white">
                {paymentData.otherClientId || "NA"}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span className="font-semibold text-gray-400">MERCHANT ID:</span>

              <span className="text-white">
                {paymentData.otherMerchantId || "NA"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-400">SECRET KEY:</span>

              <span className="text-white">
                {paymentData.otherSecretKey || "NA"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <PaymentInfoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        paymentData={paymentData}
        setPaymentData={setPaymentData}
        type={modalType}
      />
    </div>
  );
}
