import axios from 'axios';
import axiosRetry from 'axios-retry';

const http = axios.create({
    timeout: 5000, // 5 seconds timeout per request
});

// Attach retry logic to the instance
axiosRetry(http, {
    retries: 3, // total number of attempts (1 original + 2 retries)
    retryDelay: axiosRetry.exponentialDelay, // or a custom delay function
    retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED';
    },
});

export default http;