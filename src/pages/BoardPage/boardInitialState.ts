import type { BoardState } from './boardTypes';

export const initialState: BoardState = {
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
