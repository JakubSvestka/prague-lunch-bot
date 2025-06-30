import axios, {type AxiosError, type AxiosRequestConfig} from 'axios';
import axiosRetry from 'axios-retry';

const http = axios.create({
    timeout: 5000, // 5 seconds timeout per request
});

// Attach retry logic to the instance
axiosRetry(http, {
    retries: 10, // total number of attempts (1 original + 2 retries)
    retryDelay: (retryCount) => {
        return retryCount * 1000;
    },
    onRetry: async (retryCount, error, requestConfig) => {
        console.warn("Retrying because of: " + error.message);
    },
    retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED';
    },
});

export default http;