import axios, {type AxiosError, type AxiosRequestConfig} from 'axios';
import axiosRetry from 'axios-retry';

const http = axios.create({
    timeout: 5000, // 5 seconds timeout per request
});

// Attach retry logic to the instance
axiosRetry(http, {
    retries: 10, // total number of attempts (1 original + 2 retries)
    shouldResetTimeout: true,
    retryDelay: (retryCount) => {
        return retryCount * 1000;
    },
    onRetry: async (retryCount, error, requestConfig) => {
        console.warn(`🔁 Retry ${retryCount}: ${error.message}`);
    },
    retryCondition: (error) => {
        console.warn("🛑 Checking retry for error:", {
            message: error.message,
            code: error.code,
            isNetworkError: axiosRetry.isNetworkOrIdempotentRequestError(error),
            method: error.config?.method,
            url: error.config?.url,
        });

        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED';
    },
});

export default http;