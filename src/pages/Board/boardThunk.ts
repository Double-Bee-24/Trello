import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { instance, findUserInstance } from '../../api/axiosConfig';
import { IBoard } from '../../common/interfaces/IBoard';
import { IUser } from './boardTypes';

export const fetchBoard = createAsyncThunk(
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
      return isSelectedBoard ? [response, isSelectedBoard] : response;
    } catch (error) {
      console.error('Failed to fetch board: ', error);
      toast.error('Error loading board list');
      return undefined;
    }
  }
);

export const findUser = createAsyncThunk(
  'board/findUser',
  async (emailOrUsername: { emailOrUsername: string }): Promise<IUser[] | undefined> => {
    try {
      const response: IUser[] = await findUserInstance.get('user', {
        params: { emailOrUsername: emailOrUsername.emailOrUsername },
      });
      return response;
    } catch (error) {
      console.error('Failed to find user: ', error);
      return undefined;
    }
  }
);
