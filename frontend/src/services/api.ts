import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});


API.interceptors.request.use((config) => {

  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


API.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {

        window.location.href = "/login";

        return Promise.reject(error);
      }

      try {

        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/refresh/",
          {
            refresh,
          }
        );

        localStorage.setItem(
          "access",
          response.data.access
        );

        originalRequest.headers.Authorization =
          `Bearer ${response.data.access}`;

        return API(originalRequest);

      } catch (err) {

        localStorage.clear();

        window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
