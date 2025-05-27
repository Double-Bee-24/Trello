import type { JSX} from 'react';
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { triggerBoardRefresh, fetchBoard } from '../../../pages/BoardPage/boardSlice';
import { InputComponent } from '@components';
import { createCard, refreshList, removeCard } from '@services';
import type { AppDispatch } from '../../../app/store';
import type { IUpdatedCards, ILists, ICardActionMenu, IBoardsList } from '@interfaces';
import styles from './CardActionMenu.module.scss';

// Copy or move 'card' item
async function makeAction(
  performedAction: string,
  boardId: string,
  cardId: number,
  selectedPosition: number,
  selectedList: {
    id: number;
    title: string;
    position: number;
    cards: { id: number; title: string; position: number }[];
  },
  dispatch: AppDispatch,
  selectedBoard: IBoardsList,
  title: string,
  activeListId: number,
  lists: ILists[],
  startCardPosition: number
): Promise<void> {
  // We have indexes from 0 and positions from 1, so we should decrease it by one
  const cardIndex = selectedPosition - 1;

  if (performedAction === 'move') {
    // Refresh the list from which the card was moved
    if (selectedList.id !== activeListId) {
      const activeList = lists.find((item) => item.id === activeListId);

      let updatedCardsInSourceList: IUpdatedCards[];

      if (activeList) {
        updatedCardsInSourceList = activeList?.cards
          .filter((item) => item.id !== cardId)
          .map((item, index) => ({
            id: item.id,
            position: index,
            list_id: activeListId,
          }));
      } else {
        updatedCardsInSourceList = [];
      }

      await refreshList(boardId, updatedCardsInSourceList, () => dispatch(triggerBoardRefresh()));
    }

    if (selectedBoard.id !== Number(boardId)) {
      // Server cannot move card between different boards, so we should to remove it in an old board and create in the new
      createCard(String(selectedBoard.id), title, selectedList.id, cardIndex, () => dispatch(triggerBoardRefresh()));

      removeCard(boardId, cardId, () => triggerBoardRefresh());
    }

    // Refresh the list to which the card was moved

    // Add a new card to the list
    const destinationListCards = selectedList.cards.map((item) => {
      if (cardId === item.id && activeListId === selectedList.id) {
        // Set the correct position for moved card before changing other positions
        return { ...item, position: cardIndex };
      }
      // Decrease or increase positions of other cards compared to selected position
      if (
        item.position < cardIndex ||
        // Correctly positioning in cases when we move the card inside one list
        (item.position === cardIndex && activeListId === selectedList.id && cardIndex > startCardPosition)
      ) {
        return { ...item, position: item.position - 1 };
      }
      return { ...item, position: item.position + 1 };
    });

    if (activeListId !== selectedList.id) {
      destinationListCards.push({ id: cardId, position: cardIndex, title });
    }

    const updatedCardsInDestinationList = destinationListCards
      .sort((a, b) => a.position - b.position)
      .map((item, index) => ({
        id: item.id,
        position: index,
        list_id: selectedList.id,
      }));

    // Move card inside one board
    refreshList(String(selectedBoard.id), updatedCardsInDestinationList, () => dispatch(triggerBoardRefresh()));
  } else {
    createCard(String(selectedBoard.id), title, selectedList.id, cardIndex, () => dispatch(triggerBoardRefresh()));
  }
}

export function CardActionMenu({
  setIsCardActionMenuOpen,
  performedAction,
  cardTitle,
  cardId,
  listId,
  cardPosition,
  boardId,
}: ICardActionMenu): JSX.Element {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(cardTitle);

  // Lists of the boards, contains id, title and 'custom' fiels of all the board lists
  const boardsList = useAppSelector((state) => state.board.boardsList);
  const boardOptions = boardsList.map((item) => <option key={item.id}>{item.title}</option>);

  const openedBoard = useAppSelector((state) => state.board.wholeBoard);
  const defaultBoard = boardsList.find((item) => item.title === openedBoard.title);
  const [selectedBoard, setSelectedBoard] = useState(defaultBoard);

  const board = useAppSelector((state) => state.board.selectedBoard);
  const { lists } = board;
  const [selectedList, setSelectedList] = useState({
    id: 0,
    title: '',
    position: 0,
    cards: [
      {
        id: 0,
        title: '',
        position: 0,
        description: '',
      },
    ],
  });
  const listsOptions = lists.map((item) => <option key={item.id}>{item.title}</option>);

  const [selectedPosition, setSelectedPosition] = useState(() => {
    if (selectedList && selectedList.id === listId) {
      return selectedList.cards.length;
    }
    return selectedList ? selectedList.cards.length + 1 : 1;
  });

  const [positionArrayLength, setPositionArrayLength] = useState(() =>
    selectedList ? selectedList.cards.length + 1 : 1
  );

  useEffect(() => {
    if (selectedList) {
      setPositionArrayLength(selectedList.cards.length + 1);
    }
  }, [selectedList]);

  const defaultPositionOptions = Array.from({ length: positionArrayLength }, (_, i) => (
    <option key={i + 1}>{i + 1}</option>
  ));

  const [positionOptions, setPositionOptions] = useState(defaultPositionOptions);

  useEffect(() => {
    if (lists && lists.length > 0) {
      const updatedList = lists.find((item) => item.id === selectedList.id) || lists[0];
      setSelectedList(updatedList);
    }
  }, [lists]);

  useEffect(() => {
    if (selectedBoard) {
      const fetchBoardId = String(selectedBoard.id);
      const isSelectedBoard = true;
      dispatch(fetchBoard({ boardId: fetchBoardId, isSelectedBoard }));
    }
  }, [selectedBoard]);

  useEffect(() => {
    const updatedList = lists.find((item) => item.id === selectedList.id);
    if (updatedList) {
      setSelectedList(updatedList);
    }
  }, [board]);

  useEffect(() => {
    let length;
    if (selectedList.id === listId && performedAction === 'move') {
      length = selectedList.cards.length;
    } else {
      length = selectedList.cards.length + 1;
    }
    const newPositionOptions = Array.from({ length }, (_, index) => <option key={index + 1}>{index + 1}</option>);
    setPositionOptions(newPositionOptions);
    setSelectedPosition(length);
  }, [selectedList]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    switch (name) {
      case 'board-select': {
        const element = boardsList.find((item) => item.title === value);
        if (element) {
          setSelectedBoard(element);
        }
        break;
      }
      case 'list-select': {
        const element = lists.find((item) => item.title === value);
        if (element) {
          setSelectedList(element);
        }
        break;
      }
      case 'position-select': {
        if (value) {
          setSelectedPosition(Number(value));
        }
        break;
      }
      default:
        break;
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const handleClick = async (): Promise<void> => {
    if (selectedBoard) {
      // const boardId = String(selectedBoard.id);

      makeAction(
        performedAction,
        boardId || '',
        cardId,
        selectedPosition,
        selectedList,
        dispatch,
        selectedBoard,
        title,
        listId,
        lists,
        cardPosition
      );
    }

    setIsCardActionMenuOpen(false);
  };

  const actionName = performedAction === 'move' ? 'Перемістити картку' : 'Копіювати картку';
  const actionSubtitle = performedAction === 'move' ? 'Вибрати місце призначення' : 'Cкопіювати в...';
  const buttonName = performedAction === 'move' ? 'Перемістити' : 'Створити картку';

  return (
    <div className={styles.card_action_menu}>
      <div className={styles.action_menu_title}>
        <p>{actionName}</p>
        <button className={styles.close_btn} onClick={() => setIsCardActionMenuOpen(false)}>
          X
        </button>
      </div>
      {performedAction === 'copy' && (
        <>
          <p className={styles.input_title}>Назва</p>
          <InputComponent value={title} handleChange={handleInputChange} className={styles.card_action_menu_input} />
        </>
      )}
      <div className={styles.action_subtitle}>{actionSubtitle}</div>
      <div className={styles.choose_menu}>
        <div className={styles.board_selection}>
          <p>Дошка</p>
          <select onChange={handleChange} name="board-select" value={selectedBoard ? selectedBoard.title : ''}>
            {boardOptions}
          </select>
        </div>
        <div className={styles.list_wrapper}>
          <div className={styles.list_selection}>
            <p>Список</p>
            <select onChange={handleChange} name="list-select" value={selectedList.title}>
              {listsOptions}
            </select>
          </div>
          <div className={styles.position_selection}>
            <p>Положення</p>
            <select onChange={handleChange} name="position-select" value={selectedPosition}>
              {positionOptions}
            </select>
          </div>
        </div>
        <button className={styles.action_btn} onClick={handleClick}>
          {buttonName}
        </button>
      </div>
    </div>
  );
}
