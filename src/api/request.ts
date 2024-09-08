import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import instance from './axiosConfig';
import 'react-toastify/dist/ReactToastify.css';
import { IResponse } from '../common/interfaces/IResponse';
import { IBoardsList } from '../common/interfaces/IBoardsList';

const createList = async (
  boardId: string | undefined,
  listTitle: string,
  lastListPosition: number,
  setIsAddListButtonClicked: (isAddListButtonClicked: boolean) => void,
  triggerBoardRefresh: () => void
): Promise<void> => {
  try {
    await instance.post(`/board/${boardId}/list`, {
      title: listTitle,
      position: lastListPosition + 1,
    });
    setIsAddListButtonClicked(false);
    triggerBoardRefresh();
  } catch (error) {
    console.error('Error while creating new list: ', error);
    const notify = (): void => {
      toast('Помилка при спробі створити список');
    };
    notify();
  }
};

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
      const notify = (): void => {
        toast('Помилка перейменування дошки');
      };
      notify();
    }
  } else {
    setIsInputEmpty(true);
  }
};

const renameCard = async (
  boardId: string | undefined,
  cardId: number,
  newTitle: string,
  listId: number,
  setIsCardTitleClicked: (isCardTitleClicked: boolean) => void,
  triggerBoardRefresh: () => void
): Promise<void> => {
  try {
    await instance.put(`/board/${boardId}/card/${cardId}`, {
      title: newTitle,
      description: 'petting process',
      list_id: listId,
    });
    setIsCardTitleClicked(false);
    triggerBoardRefresh();
  } catch (error) {
    console.error('Rename card error: ', error);
    const notify = (): void => {
      toast('Помилка перейменування картки');
    };
    notify();
  }
};

// Takes data to render board previews at the Home page
const getBoards = async (
  setBoards: (boards: []) => void,
  setIsLoading: (isLoading: boolean) => void = (): void => {},
  setLoadingProgress: (loadingProgress: number) => void = (): void => {}
): Promise<void> => {
  const approximateTotalSize = 3600; // response size in bytes

  try {
    const response: IResponse = await instance.get('/board', {
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total === undefined) {
          const percentCompleted = Math.min(Math.floor((progressEvent.loaded / approximateTotalSize) * 100), 100);
          setLoadingProgress(percentCompleted);
        }
      },
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
    setBoards(response.boards);
  } catch (error) {
    const notify = (): void => {
      toast('Помилка завантаження даних');
    };

    notify();
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
    const notify = (): void => {
      toast('Помилка зміни кольору');
    };
    notify();
    console.error('Some error happaned while trying to change the board color: ', error);
  }
};

const createCard = async (
  boardId: string | undefined,
  cardTitle: string,
  listId: number,
  lastCardPosition: number,
  setIsAddCardButtonClicked?: (isAddCardButtonClicked: boolean) => void,
  triggerBoardRefresh?: () => void
): Promise<void> => {
  if (cardTitle.length === 0) {
    if (setIsAddCardButtonClicked) {
      setIsAddCardButtonClicked(false);
    }
    return;
  }

  try {
    await instance.post(`/board/${boardId}/card`, {
      title: cardTitle,
      list_id: listId,
      position: lastCardPosition,
      description: 'washing process',
      custom: {
        deadline: '2022-08-31 12:00',
      },
    });

    if (setIsAddCardButtonClicked) {
      setIsAddCardButtonClicked(false);
    }
    if (triggerBoardRefresh) {
      triggerBoardRefresh();
    }
  } catch (error) {
    toast('Помилка при спробі додати картку');
    console.error('Error while trying to create new card:', error);
  }
};

const postBoard = async (board: IBoardsList): Promise<void> => {
  try {
    await instance.post('/board', board);
  } catch (error) {
    console.error('Some error happened while creating new board: ', error);
    const notify = (): void => {
      toast('Помилка створення дошки');
    };

    notify();
  }
};

const removeCard = async (
  boardId: string | undefined,
  cardId: number,
  triggerBoardRefresh: () => void
): Promise<void> => {
  try {
    await instance.delete(`board/${boardId}/card/${cardId}`);

    triggerBoardRefresh();
  } catch (error) {
    console.error('Card removing error: ', error);
    const notify = (): void => {
      toast('Помилка видалення картки');
    };

    notify();
  }
};

const refreshList = async (
  boardId: string | undefined,
  updatedCards: { id: number; position: number; list_id: number }[],
  triggerBoardRefresh: () => void
): Promise<void> => {
  try {
    await instance.put(`/board/${boardId}/card`, updatedCards);
    triggerBoardRefresh();
  } catch (error) {
    console.error('Cannot update the board: ', error);
  }
};

const removeBoard = async (boardId: string | undefined): Promise<void> => {
  try {
    await instance.delete(`/board/${boardId}`);
  } catch (error) {
    console.error('Cannot remove the board: ', error);
  }
};

const renameList = async (
  boardId: string | undefined,
  listId: number,
  title: string,
  triggerBoardRefresh: () => void
): Promise<void> => {
  try {
    await instance.put(`/board/${boardId}/list/${listId}`, { title });
    triggerBoardRefresh();
  } catch (error) {
    console.error('Cannot rename list: ', error);
  }
};

export default instance;

export {
  createList,
  createCard,
  renameBoard,
  renameCard,
  renameList,
  removeCard,
  removeBoard,
  getBoards,
  changeBoardColor,
  postBoard,
  refreshList,
};
