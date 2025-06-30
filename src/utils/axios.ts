import axios, {type AxiosError, type AxiosRequestConfig} from 'axios';
import axiosRetry from 'axios-retry';

const http = axios.create({
    timeout: 30000, // 30 seconds timeout per request
    //Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:139.0) Gecko/20100101 Firefox/139.0
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://www.google.com/',
        'DNT': '1', // Do Not Track
        'Upgrade-Insecure-Requests': '1',
    },
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