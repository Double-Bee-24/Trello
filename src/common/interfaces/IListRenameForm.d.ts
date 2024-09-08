export interface IListRenameForm {
  title: string;
  boardId: string | undefined;
  listId: number;
  setIsListRenameActive: (value: boolean) => void;
}
