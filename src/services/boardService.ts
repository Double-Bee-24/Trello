import type { IBoardsList, IResponse } from '@interfaces';
import { toast } from 'react-toastify';
import { instance } from 'src/api/axiosConfig';

const renameBoard = async (
  boardId: string | undefined,
  newTitle: string,
  setIsInputEmpty: (isInputEmpty: boolean) => void
): Promise<void> => {
  if (newTitle.length > 0) {
    try {
      await instance.put(`board/${boardId}`, {
        title: newTitle,
      });
    } catch (error) {
      console.error('Rename board error: ', error);
      toast('Помилка перейменування дошки');
    }
  } else {
    setIsInputEmpty(true);
  }
};

// Takes data to render board previews at the Home page
const getBoards = async (setBoards: (boards: []) => void): Promise<void> => {
  try {
    const response: IResponse = await instance.get('/board', {});

    console.log(response, 'response here');
    setBoards(response.boards);
  } catch (error) {
    toast('Помилка завантаження даних');

    console.error('Error while downloading the board list', error);
  }
};

const changeBoardColor = async (
  boardId: string | undefined,
  newBoardColor: string,
  triggerBoardRefresh: () => void
): Promise<void> => {
  try {
    await instance.put(`/board/${boardId}`, {
      custom: {
        color: newBoardColor,
      },
    });
    triggerBoardRefresh();
  } catch (error) {
    toast('Помилка зміни кольору');

    console.error('Some error happaned while trying to change the board color: ', error);
  }
};

const postBoard = async (board: IBoardsList): Promise<void> => {
  try {
    await instance.post('/board', board);
  } catch (error) {
    console.error('Some error happened while creating new board: ', error);
    toast('Помилка створення дошки');
  }
};

const removeBoard = async (boardId: string | undefined): Promise<void> => {
  try {
    await instance.delete(`/board/${boardId}`);
  } catch (error) {
    console.error('Cannot remove the board: ', error);
  }
};

export { renameBoard, getBoards, changeBoardColor, postBoard, removeBoard };
