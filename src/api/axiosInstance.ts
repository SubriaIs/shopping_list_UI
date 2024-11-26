import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SL_UI_BASE_API_URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if the custom flag is set
    if (config.headers?.shouldAddAuthHeader) {
      // Retrieve the JSON string from local storage
      const authData: string | null = localStorage.getItem("xToken");

      if (authData) {
        // Parse the JSON string into an object
        const parsedData: { xtoken: string } = JSON.parse(authData);

        // Access the xAuth token
        const xAuthToken: string = parsedData.xtoken;

        // Set the Authorization header
        config.headers['xToken'] = `${xAuthToken}`;
      } else {
        console.log("Error key not found.");
      }

      // Remove the custom flag from headers to avoid sending it to the server
      delete config.headers.shouldAddAuthHeader;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;