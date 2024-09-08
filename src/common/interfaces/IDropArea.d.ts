export interface IDropArea {
  isFirst: boolean;
  isLast?: boolean;
  cardTitle: string;
  listId: number;
  position: number;
  setDraggedCardNewPos: (element: number) => void;
}
