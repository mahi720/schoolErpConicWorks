import API from "../../axios/axios"

export const paymentInfoApi = {
    getMyPaymentInfo: () =>
        API.get("/payment-info/me"),

    create: (payload) =>
        API.post("/payment-info", payload),

    updateMyPaymentInfo: (payload) =>
        API.patch("/payment-info/me", payload),

    deleteMyPaymentInfo: () =>
        API.delete("/payment-info/me"),

    restoreMyPaymentInfo: () =>
        API.patch("/payment-info/me/restore"),
};