import axios from 'axios';
import { api } from '../common/constants';
import { IAuthorizedData } from '../common/interfaces/IAuthorizedData';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: 'Bearer 123',
  },
});

const updateToken = async (refreshToken: string): Promise<IAuthorizedData | undefined> => {
  try {
    const response: IAuthorizedData = await instance.post('/refresh', { refreshToken });
    return response;
  } catch (error) {
    return undefined;
  }
};

instance.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem('token');
    const excludedPaths = ['/login', '/user'];

    // Add token to request headers if the request is not to an excluded path
    if (accessToken && !excludedPaths.includes(request.url || '')) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }

    return request;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // If status 401 and the request has not been retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried to avoid infinite loops

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        // If refresh token exists, try to update the token
        if (refreshToken) {
          const response = await updateToken(refreshToken);

          // If token update was successful
          if (response) {
            const { token, refreshToken: newRefreshToken } = response;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', newRefreshToken);

            // Update authorization header with the new token
            originalRequest.headers.Authorization = `Bearer ${token}`;

            // Retry the original request
            return await instance(originalRequest);
          }
        }

        // If token update failed or refreshToken is invalid
        localStorage.setItem('authorizationStatus', 'Unauthorized');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Redirect to login page
      } catch (refreshError) {
        localStorage.setItem('authorizationStatus', 'Unauthorized'); // Set authorizationStatus as Unauthorized
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    // Reject the error for other status codes or if 401 happens again
    return Promise.reject(error);
  }
);

export default instance;
