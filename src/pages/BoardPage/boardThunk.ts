import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { instance, findUserInstance } from '../../api/axiosConfig';
import type { IBoard, IUser } from '@interfaces';

const fetchBoard = createAsyncThunk(
  'board/fetchBoard',
  async ({
    boardId,
    isSelectedBoard,
  }: {
    boardId: string | undefined;
    isSelectedBoard?: boolean;
  }): Promise<IBoard | undefined | [IBoard, boolean]> => {
    try {
      const response: IBoard = await instance.get(`/board/${boardId}`);

      if (isSelectedBoard) {
        return [response, isSelectedBoard];
      }
      return response;
    } catch (error) {
      console.error('Failed to fetch data: ', error);

      toast('Помилка завантаження списку дошок');

      return undefined;
    }
  }
);

const findUser = createAsyncThunk(
  'board/findUser',
  async (emailOrUsername: {
    emailOrUsername: string;
  }): Promise<IUser[] | undefined> => {
    try {
      const response: IUser[] = await findUserInstance.get('user', {
        params: { emailOrUsername: emailOrUsername.emailOrUsername },
      });
      return response;
    } catch (error) {
      console.error('Error while trying to find a user: ', error);
      return undefined;
    }
  }
);

export { findUser, fetchBoard };
