import { create } from "zustand";
import toast from "react-hot-toast";

import { paymentInfoApi } from "../../../api/master/paymentInfo/paymentInfoApi";

const initialPaymentData = {
    clientId: "",
    merchantId: "",
    secretKey: "",

    otherClientId: "",
    otherMerchantId: "",
    otherSecretKey: "",

    status: "active",
    isActive: true,
};

export const usePaymentInfoStore = create(
    (set) => ({
        paymentData: initialPaymentData,
        loading: false,
        submitLoading: false,

        setPaymentData: (paymentData) => {
            set({
                paymentData,
            });
        },

        fetchPaymentInfo: async () => {
            try {
                set({
                    loading: true,
                });

                const res =
                    await paymentInfoApi.getMyPaymentInfo();

                set({
                    paymentData:
                        res.data?.data ||
                        initialPaymentData,
                });

                return res.data?.data || null;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch payment information",
                );

                return null;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        createPaymentInfo: async (payload) => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await paymentInfoApi.create(payload);

                set({
                    paymentData:
                        res.data?.data ||
                        initialPaymentData,
                });

                toast.success(
                    res.data?.message ||
                    "Payment information created successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to create payment information",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        updatePaymentInfo: async (
            type,
            formData,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                let payload;

                if (type === "primary") {
                    payload = {
                        type: "primary",

                        primaryClientId:
                            formData.clientId,

                        primaryMerchantId:
                            formData.merchantId,

                        primarySecretKey:
                            formData.secretKey,
                    };
                } else {
                    payload = {
                        type: "other",

                        otherClientId:
                            formData.otherClientId,

                        otherMerchantId:
                            formData.otherMerchantId,

                        otherSecretKey:
                            formData.otherSecretKey,
                    };
                }

                const res =
                    await paymentInfoApi.updateMyPaymentInfo(
                        payload,
                    );

                const updatedPaymentInfo =
                    res.data?.data;

                if (updatedPaymentInfo) {
                    set({
                        paymentData:
                            updatedPaymentInfo,
                    });
                }

                toast.success(
                    res.data?.message ||
                    "Payment information updated successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to update payment information",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        deletePaymentInfo: async () => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await paymentInfoApi.deleteMyPaymentInfo();

                set({
                    paymentData:
                        res.data?.data ||
                        initialPaymentData,
                });

                toast.success(
                    res.data?.message ||
                    "Payment information deactivated successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to deactivate payment information",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        restorePaymentInfo: async () => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await paymentInfoApi.restoreMyPaymentInfo();

                set({
                    paymentData:
                        res.data?.data ||
                        initialPaymentData,
                });

                toast.success(
                    res.data?.message ||
                    "Payment information restored successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to restore payment information",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },
    }),
);