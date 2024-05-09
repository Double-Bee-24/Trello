export interface ICardRenameForm {
  setIsCardTitleClicked: (isCardTitleClicked: boolean) => void;
  setShouldListBeRefreshed: (shouldListBeRefreshed: boolean) => void;
  title: string;
  listId: number;
  cardId: number;
}
