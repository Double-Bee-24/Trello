export interface IResponse {
  title: string;
  lists: ICard[];
  users: [{ id: number; userName: string }];
  custom: { color: string; description: string };
  boards: [];
}
