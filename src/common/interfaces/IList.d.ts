export interface IList {
  title: string;
  listCards: {
    id: number;
    title: string;
    position: number;
    description?: string;
    custom?: { deadline: string } | undefined;
  }[];
  boardId: string | undefined;
  id: number;
}
