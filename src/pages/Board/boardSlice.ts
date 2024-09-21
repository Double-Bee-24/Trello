import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastContainer, toast } from 'react-toastify';
import { instance, findUserInstance } from '../../api/axiosConfig';
import { ILists } from '../../common/interfaces/ILists';
import { IBoardsList } from '../../common/interfaces/IBoardsList';
import { IBoard } from '../../common/interfaces/IBoard';
import { IUser } from '../../common/interfaces/IUser';
import type { RootState } from '../../app/store';
import 'react-toastify/dist/ReactToastify.css';

interface LightCard {
  id: number;
  title: string;
  description: string | undefined;
  position: number;
}

interface UpdatedCard {
  id: number;
  list_id: number;
  position: number;
}

// Define a type for the slice state
export interface BoardState {
  isCardModalOpen: boolean;

  clickedCard: {
    id: number;
    listId: number;
    title: string;
    description: string | undefined;
    parentList: string;
    cardPosition: number;
  };

  shouldBoardBeRefreshed: boolean;

  lists: ILists[];
  boardId: number;

  boardsList: IBoardsList[];

  cards: LightCard[];

  wholeBoard: IBoard;
  selectedBoard: IBoard;

  draggedCardName: string;
  draggedCardId: number;
  draggedCardNewPosition: number;

  listToDropId: number;

  isDropAreaActive: boolean;

  updatedCards: UpdatedCard[];

  user: IUser;

  pathname: string;
}

// Define the initial state using that type
const initialState: BoardState = {
  isCardModalOpen: false,

  clickedCard: {
    id: 0,
    listId: 0,
    title: '',
    description: '',
    parentList: '',
    cardPosition: 0,
  },

  shouldBoardBeRefreshed: false,

  lists: [],
  boardId: 0,

  boardsList: [],

  cards: [],

  wholeBoard: {
    title: '',
    custom: {
      color: '#ffffff',
    },
    lists: [
      {
        id: 0,
        title: '',
        position: 0,
        cards: [
          {
            id: 0,
            title: '',
            position: 0,
            description: '',
          },
        ],
      },
    ],
    users: [
      {
        id: 0,
        username: '',
      },
    ],
  },

  selectedBoard: {
    title: '',
    custom: {
      color: '#ffffff',
    },
    lists: [
      {
        id: 0,
        title: '',
        position: 0,
        cards: [
          {
            id: 0,
            title: '',
            position: 0,
            description: '',
          },
        ],
      },
    ],
    users: [
      {
        id: 0,
        username: '',
      },
    ],
  },

  draggedCardName: '',

  draggedCardId: 0,

  listToDropId: 0,

  isDropAreaActive: false,

  draggedCardNewPosition: -2,

  updatedCards: [],

  user: { id: 0, username: '' },

  pathname: '',
};

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

export const findUser = createAsyncThunk(
  'board/findUser',
  async (emailOrUsername: { emailOrUsername: string }): Promise<IUser[] | undefined> => {
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

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setIsCardModalOpen: (state, action: PayloadAction<boolean>): void => {
      state.isCardModalOpen = action.payload;
    },
    setClickedCard: (
      state,
      action: PayloadAction<{
        title: string;
        description: string | undefined;
        parentList: string;
        id: number;
        listId: number;
        cardPosition: number;
      }>
    ): void => {
      state.clickedCard = { ...action.payload };
    },
    triggerBoardRefresh: (state): void => {
      state.shouldBoardBeRefreshed = true;
    },
    resetBoardRefreshStatus: (state): void => {
      state.shouldBoardBeRefreshed = false;
    },
    setBoardsList: (state, action: PayloadAction<IBoardsList[]>): void => {
      state.boardsList = action.payload;
    },
    setCards: (state, action: PayloadAction<LightCard[]>): void => {
      state.cards = action.payload;
    },
    setDraggedCardName: (state, action: PayloadAction<string>): void => {
      state.draggedCardName = action.payload;
    },
    setListToDropId: (state, action: PayloadAction<number>): void => {
      state.listToDropId = action.payload;
    },
    setIsDropAreaActive: (state, action: PayloadAction<boolean>): void => {
      state.isDropAreaActive = action.payload;
    },
    setDraggedCardId: (state, action: PayloadAction<number>): void => {
      state.draggedCardId = action.payload;
    },
    setDraggedCardNewPosition: (state, action: PayloadAction<number>): void => {
      state.draggedCardNewPosition = action.payload;
    },
    setUpdatedCards: (state, action: PayloadAction<UpdatedCard[]>): void => {
      const newCards = action.payload;

      newCards.forEach((card) => {
        const existingCard = state.updatedCards.find((item) => item.id === card.id);

        if (existingCard !== undefined) {
          // refresh data
          existingCard.position = card.position;
          existingCard.list_id = card.list_id;
        } else {
          // add new card
          state.updatedCards.push(card);
        }
      });
      state.updatedCards = state.updatedCards.filter((item) => item.id !== 0);
    },
    setPathname: (state, action: PayloadAction<string>): void => {
      state.pathname = action.payload;
    },
    resetUpdatedCards: (state): void => {
      state.updatedCards = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoard.fulfilled, (state, action) => {
      // selectedBoard represents the board in CardActionMenu. It gaves options to which list move a card
      if (Array.isArray(action.payload)) {
        const [board, isSelectedBoard] = action.payload;
        state.selectedBoard = board;
      } else if (action.payload) {
        state.wholeBoard = action.payload;
      }
    });
    builder.addCase(findUser.fulfilled, (state, action) => {
      // Check if the payload is an array
      if (Array.isArray(action.payload)) {
        [state.user] = action.payload;
      } else if (action.payload) {
        state.user = action.payload; // If it's not an array, just assign the value
      }
    });
  },
});

export const {
  setIsCardModalOpen,
  setClickedCard,
  triggerBoardRefresh,
  resetBoardRefreshStatus,
  setBoardsList,
  setCards,
  setDraggedCardName,
  setListToDropId,
  setIsDropAreaActive,
  setDraggedCardId,
  setDraggedCardNewPosition,
  setUpdatedCards,
  resetUpdatedCards,
  setPathname,
} = boardSlice.actions;

export const boardReducer = boardSlice.reducer;
