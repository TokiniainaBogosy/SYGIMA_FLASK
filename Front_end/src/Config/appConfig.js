const appConfig = {
    mode: import.meta.env.VITE_APP_MODE || "LOCAL",
    apiUrl: import.meta.env.VITE_API_URL,
};

export default appConfig;