export interface ILists {
  id: number;
  title: string;
  position?: number;
  cards: {
    title: string;
    id: number;
    position: number;
    description?: string;
    custom?: { deadline: string };
  }[];
  setShouldListBeRefreshed?: (shouldListBeRefreshed: boolean) => void;
}
