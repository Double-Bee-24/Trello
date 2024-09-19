import axios from 'axios';
import { api } from '../common/constants';
import { IAuthorizedData } from '../common/interfaces/IAuthorizedData';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const updateToken = async (refreshToken: string): Promise<IAuthorizedData | undefined> => {
  try {
    const response: IAuthorizedData = await instance.post('/refresh', { refreshToken });
    return response;
  } catch (error) {
    console.error('Error during token updating: ', error);
    return undefined;
  }
};

// Add token before every request
instance.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
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
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
      try {
        const refreshToken = localStorage.getItem('refreshToken'); // Retrieve the stored refresh token.
        // Make a request to your auth server to refresh the token.
        if (refreshToken) {
          const response = await updateToken(refreshToken);
          if (response) {
            const { result, token, refreshToken: newRefreshToken } = response;
            // Store the new access and refresh tokens.
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', newRefreshToken);
            localStorage.setItem('authorizationStatus', result);
            // Update the authorization header with the new access token.
            instance.defaults.headers.common.Authorization = `Bearer ${token}`;
          }
        }
        return await instance(originalRequest); // Retry the original request with the new access token.
      } catch (refreshError) {
        // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authorizationStatus');

        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
  }
);

export default instance;
