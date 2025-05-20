import { instance } from 'src/api/axiosConfig';
import { toast } from 'react-toastify';

const createList = async (
  boardId: string | undefined,
  listTitle: string,
  lastListPosition: number,
  setIsAddListButtonClicked: (isAddListButtonClicked: boolean) => void,
  triggerBoardRefresh: () => void
): Promise<void> => {
  try {
    await instance.post(`/board/${boardId}/list`, {
      title: listTitle,
      position: lastListPosition + 1,
    });
    setIsAddListButtonClicked(false);
    triggerBoardRefresh();
  } catch (error) {
    console.error('Error while creating new list: ', error);
    toast('Помилка при спробі створити список');
  }
};

const refreshList = async (
  boardId: string | undefined,
  updatedCards: { id: number; position: number; list_id: number }[],
  triggerBoardRefresh: () => void
): Promise<void> => {
  try {
    await instance.put(`/board/${boardId}/card`, updatedCards);
    triggerBoardRefresh();
  } catch (error) {
    console.error('Cannot update the board: ', error);
  }
};

const renameList = async (
  boardId: string | undefined,
  listId: number,
  title: string,
  triggerBoardRefresh: () => void
): Promise<void> => {
  try {
    await instance.put(`/board/${boardId}/list/${listId}`, { title });
    triggerBoardRefresh();
  } catch (error) {
    console.error('Cannot rename list: ', error);
  }
};

export { createList, refreshList, renameList };
