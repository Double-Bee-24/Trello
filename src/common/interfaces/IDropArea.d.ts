export interface IDropArea {
  isFirst: boolean;
  isLast?: boolean;
  boardId: string | undefined;
  cardTitle: string;
  listId: number;
  position: number;
  setIsAddCardButtonClicked: (isAddCardButtonClicked: boolean) => void;
  setIsDragged: (isDragged: boolean) => void;
  cards: {
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
  setCards: React.Dispatch<React.SetStateAction<ICard[]>>;
  setDraggedCardNewPos: (element: number) => void;
}
