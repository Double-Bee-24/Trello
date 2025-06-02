import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './boardInitialState';
import 'react-toastify/dist/ReactToastify.css';
import type { ILightCard, IBoardsList, IUpdatedCard } from '@interfaces';
import { fetchBoard, findUser } from './boardThunk';

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
    setCards: (state, action: PayloadAction<ILightCard[]>): void => {
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
    setUpdatedCards: (state, action: PayloadAction<IUpdatedCard[]>): void => {
      const newCards = action.payload;

      newCards.forEach(card => {
        const existingCard = state.updatedCards.find(
          item => item.id === card.id
        );

        if (existingCard !== undefined) {
          // refresh data
          existingCard.position = card.position;
          existingCard.list_id = card.list_id;
        } else {
          // add new card
          state.updatedCards.push(card);
        }
      });
      state.updatedCards = state.updatedCards.filter(item => item.id !== 0);
    },
    setPathname: (state, action: PayloadAction<string>): void => {
      state.pathname = action.payload;
    },
    resetUpdatedCards: (state): void => {
      state.updatedCards = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchBoard.fulfilled, (state, action) => {
      // selectedBoard represents the board in CardActionMenu. It gaves options to which list move a card
      if (Array.isArray(action.payload)) {
        const [board] = action.payload;
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
