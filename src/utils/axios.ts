import axios from 'axios';
import axiosRetry from 'axios-retry';


const http = axios.create({
    timeout: 5000, // 5 seconds timeout per request
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'cs-CZ,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'DNT': '1',
        'Upgrade-Insecure-Requests': '1',
    },
});

// Attach retry logic to the instance
axiosRetry(http, {
    retries: 3, // total number of attempts (1 original + 2 retries)
    shouldResetTimeout: true,
    retryDelay: (retryCount) => {
        return retryCount * 1000;
    },
    onRetry: async (retryCount, error, requestConfig) => {
        console.warn(`🔁 Retry ${retryCount}: ${error.message}`);
    },
    retryCondition: (error) => {
        console.warn("🛑 Checking retry for error: " + error.message);

        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED';
    },
});

export default http;