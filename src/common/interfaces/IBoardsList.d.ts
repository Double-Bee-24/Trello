import { ILists } from './ILists';

export interface IBoardsList {
  id?: number;
  title: string;
  custom?: {
    color: string;
    description: string;
  };
  lists?: ILists;
}
