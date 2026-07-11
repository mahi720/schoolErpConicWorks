import API from "../axios/axios";

export const loginApi = async (payload) => {
    const { data } = await API.post("/auth/login", payload);
    return data;
};

export const logoutApi = async () => {
    const { data } = await API.post("/auth/logout");
    return data;
};

export const meApi = async () => {
    const { data } = await API.get("/auth/me");
    return data;
};

// export const refreshApi = async () => {
//     const { data } = await API.post("/auth/refresh");
//     return data;
// };
