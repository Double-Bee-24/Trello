export interface ICard {
  title: string;
  listId: number;
  cardId: number;
  setShouldListBeRefreshed: (shouldListBeRefreshed: boolean) => void;
}
