import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { api } from '../common/constants';
import 'react-toastify/dist/ReactToastify.css';
import { IResponse } from '../common/interfaces/IResponse';
import { ILists } from '../common/interfaces/ILists';
import { IBoard } from '../common/interfaces/IBoard';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123',
  },
});

instance.interceptors.response.use((res) => res.data);

const createList = async (
  boardId: string | undefined,
  listTitle: string,
  lastListPosition: number,
  setIsAddListButtonClicked: (isAddListButtonClicked: boolean) => void
): Promise<void> => {
  try {
    await instance.post(`/board/${boardId}/list`, {
      title: listTitle,
      position: lastListPosition + 1,
    });
    setIsAddListButtonClicked(false);
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
  setShouldListBeRefreshed: (shouldListBeRefreshed: boolean) => void
): Promise<void> => {
  try {
    await instance.put(`/board/${boardId}/card/${cardId}`, {
      title: newTitle,
      description: 'petting process',
      list_id: listId,
    });
    setIsCardTitleClicked(false);
    setShouldListBeRefreshed(true);
  } catch (error) {
    console.error('Rename card error: ', error);
    const notify = (): void => {
      toast('Помилка перейменування картки');
    };
    notify();
  }
};

// Takes data to render particular board and its children components
const fetchBoard = async (
  boardId: string | undefined,
  setLists: (lists: ILists[]) => void,
  setLastListPosition: (lastListPosition: number) => void,
  setTitle: (title: string) => void,
  setShouldListBeRefreshed: (shouldListBeRefreshed: boolean) => void,
  setBoardColor: (boardColor: string) => void
): Promise<void> => {
  try {
    const response: IResponse = await instance.get(`/board/${boardId}`);
    setLists(response.lists);
    setLastListPosition(response.lists.length);
    setTitle(response.title);
    setShouldListBeRefreshed(false);

    setBoardColor(response.custom.color);
    if (response.custom.color && response.custom.color[0] !== '#') {
      setBoardColor('#92D1AE');
    }
  } catch (error) {
    console.error('Failed to fetch data: ', error);
    const notify = (): void => {
      toast('Помилка завантаження списку дошок');
    };
    notify();
  }
};

// Takes data to render board previews at the Home page
const getBoards = async (
  setLoadingProgress: (loadingProgress: number) => void,
  setIsLoading: (isLoading: boolean) => void,
  setBoards: (boards: []) => void
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
  setShouldListBeRefreshed: (shouldListBeRefreshed: boolean) => void
): Promise<void> => {
  try {
    await instance.put(`/board/${boardId}`, {
      custom: {
        color: newBoardColor,
      },
    });
    setShouldListBeRefreshed(true);
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
  setIsAddCardButtonClicked: (isAddCardButtonClicked: boolean) => void,
  setShouldListBeRefreshed: (shouldListBeRefreshed: boolean) => void
): Promise<void> => {
  if (cardTitle.length > 0) {
    try {
      await instance.post(`/board/${boardId}/card`, {
        title: cardTitle,
        list_id: listId,
        position: lastCardPosition + 1,
        description: 'washing process',
        custom: {
          deadline: '2022-08-31 12:00',
        },
      });
      setIsAddCardButtonClicked(false);
      setShouldListBeRefreshed(true);
    } catch (error) {
      const notify = (): void => {
        toast('Помилка при спробі додати картку');
      };

      notify();
      console.error('Error while trying to create new card:', error);
    }
  } else {
    setIsAddCardButtonClicked(false);
  }
};

const postBoard = async (board: IBoard): Promise<void> => {
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

export default instance;

export { createList, renameBoard, renameCard, fetchBoard, getBoards, changeBoardColor, createCard, postBoard };
