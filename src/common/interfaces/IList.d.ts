export interface IList {
  title: string;
  cards: [
    {
      title: string;
      id: number;
      position: number;
      description: string;
      custom?: { deadline: string };
    },
  ];
  id: number;
  setShouldListBeRefreshed: (shouldListBeRefreshed: boolean) => void;
}
