import axios from "axios";

const Api = axios.create({
    baseURL: process.env.API_URL
});

Api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

Api.interceptors.response.use(
    (response) => response,
    async (error) => {
        let originalConfig = error.config;
        let token = localStorage.getItem("access_token");

        if (error.response?.status === 401 && !originalConfig._retry && token) {
            originalConfig._retry = true;
            let tokenRefreshed = await refreshToken();
            if(tokenRefreshed){
                return Api.request(originalConfig);
            } else {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

const refreshToken = async () => {
    let token = localStorage.getItem("access_token");
    if (!token) {
        return false;
    }

    try {
        let response = await Api.post("/auth/refresh", {});

        if (response.status === 200) {
            localStorage.setItem("access_token", response.data.access_token);
            return true;
        }

        localStorage.removeItem("access_token");
        return false;
    } catch (error) {
        localStorage.removeItem("access_token");
        return false;
    }
};

export default Api;