import type { IBoard, IBoardsList, ILightCard, ILists } from '@interfaces';

export interface IUser {
  id: number;
  username: string;
}

export interface IUpdatedCard {
  id: number;
  list_id: number;
  position: number;
}

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
  cards: ILightCard[];
  wholeBoard: IBoard;
  selectedBoard: IBoard;
  draggedCardName: string;
  draggedCardId: number;
  draggedCardNewPosition: number;
  listToDropId: number;
  isDropAreaActive: boolean;
  updatedCards: IUpdatedCard[];
  user: IUser;
  pathname: string;
}
