export interface ICard {
  id?: number;
  title: string;
  listId: number;
  cardId: number;
  position: number;
  boardId: string | undefined;
  isDragged: boolean;
  setIsDragged: (isDragged: boolean) => void;
  listTitle: string;
  cardDescription: string | undefined;
  cards?: {
    id: number;
    title: string;
    position: number;
    description?: string | undefined;
    custom?:
      | {
          deadline: string;
        }
      | undefined;
  }[];
}
