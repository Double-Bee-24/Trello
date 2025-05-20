import { IAuthorizedData } from '@interfaces';
import { instance } from 'src/api/axiosConfig';

const createUser = async (credentials: { password: string; email: string }): Promise<void> => {
  try {
    await instance.post('/user', credentials);
  } catch (error) {
    console.error('Error while trying create a user: ', error);
  }
};

const authorize = async (credentials: { password: string; email: string }): Promise<IAuthorizedData | undefined> => {
  try {
    const response: IAuthorizedData = await instance.post('/login', credentials);
    return response;
  } catch (error) {
    console.error('Error during an authorization: ', error);
    throw new Error('Authorization failed');
  }
};

export { createUser, authorize };
