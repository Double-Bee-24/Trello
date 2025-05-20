import { instance } from 'src/api/axiosConfig';
import { toast } from 'react-toastify';

const removeCard = async (
  boardId: string | undefined,
  cardId: number,
  triggerBoardRefresh: () => void
): Promise<void> => {
  try {
    await instance.delete(`board/${boardId}/card/${cardId}`);

    triggerBoardRefresh();
  } catch (error) {
    console.error('Card removing error: ', error);
    toast('Помилка видалення картки');
  }
};

const createCard = async (
  boardId: string | undefined,
  cardTitle: string,
  listId: number,
  lastCardPosition: number,
  setIsAddCardButtonClicked?: (isAddCardButtonClicked: boolean) => void,
  triggerBoardRefresh?: () => void
): Promise<void> => {
  if (cardTitle.length === 0) {
    if (setIsAddCardButtonClicked) {
      setIsAddCardButtonClicked(false);
    }
    return;
  }

  try {
    await instance.post(`/board/${boardId}/card`, {
      title: cardTitle,
      list_id: listId,
      position: lastCardPosition,
      description: 'washing process',
      custom: {
        deadline: '2022-08-31 12:00',
      },
    });

    if (setIsAddCardButtonClicked) {
      setIsAddCardButtonClicked(false);
    }
    if (triggerBoardRefresh) {
      triggerBoardRefresh();
    }
  } catch (error) {
    toast('Помилка при спробі додати картку');
    console.error('Error while trying to create new card:', error);
  }
};

const renameCard = async (
  boardId: string | undefined,
  cardId: number,
  newTitle: string,
  listId: number,
  setIsCardTitleClicked: (isCardTitleClicked: boolean) => void,
  triggerBoardRefresh: () => void
): Promise<void> => {
  try {
    await instance.put(`/board/${boardId}/card/${cardId}`, {
      title: newTitle,
      description: 'petting process',
      list_id: listId,
    });
    setIsCardTitleClicked(false);
    triggerBoardRefresh();
  } catch (error) {
    console.error('Rename card error: ', error);
    toast('Помилка перейменування картки');
  }
};

export { removeCard, createCard, renameCard };
