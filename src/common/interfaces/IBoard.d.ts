export interface IBoard {
  title: string;
  custom: {
    color: string;
  };
  lists: {
    id: number;
    title: string;
    position: number;
    cards: {
      id: number;
      title: string;
      position: number;
      description: string;
    }[];
  }[];
  users: {
    id: number;
    username: string;
  }[];
}
