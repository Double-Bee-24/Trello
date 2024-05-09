export interface IAddCardForm {
  setIsAddCardButtonClicked: (isAddCardButtonClicked: boolean) => void;
  setShouldListBeRefreshed: (shouldListBeRefreshed: boolean) => void;
  listId: number;
  lastCardPosition: number;
}
