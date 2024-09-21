import axios from 'axios';
import { api } from '../common/constants';
import { IAuthorizedData } from '../common/interfaces/IAuthorizedData';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We have to be authorized to use method 'findUser' which finds is there already a user with such email in a base.
// However, we use this method before an authorization, so we don't have a proper token yet.
const findUserInstance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123',
  },
});

const excludedPaths = ['/login', '/user'];

const handleUnauthorized = (): void => {
  localStorage.setItem('authorizationStatus', 'Unauthorized');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
};

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

    // Add token to request headers if the request is not to an excluded path
    if (accessToken && !excludedPaths.includes(request.url || '')) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    } else if (excludedPaths.includes(request.url || '')) {
      // Remove Authorization header for excluded paths
      request.headers.Authorization = null;
    }

    return request;
  },
  (error) => Promise.reject(error)
);

findUserInstance.interceptors.response.use((response) => response.data);

instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Skip token refresh for login and user creation requests
    if (excludedPaths.includes(originalRequest.url || '')) {
      return Promise.reject(error);
    }

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
        handleUnauthorized();
      } catch (refreshError) {
        handleUnauthorized();
        return Promise.reject(refreshError);
      }
    }

    // Reject the error for other status codes or if 401 happens again
    return Promise.reject(error);
  }
);

export { instance, findUserInstance };
