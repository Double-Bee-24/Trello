export interface ICardActionMenu {
  setIsCardActionMenuOpen: (isCardActionMenuOpen: boolean) => void;
  performedAction: string;
  cardTitle: string;
  openedBoardId: string;
  cardId: number;
  boardId: string | undefined;
  listId: number;
  cardPosition: number;
}
