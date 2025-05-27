import type { JSX} from 'react';
import React, { useState, useEffect } from 'react';
import type { IList } from '@interfaces';
import { setUpdatedCards } from '../../../pages/BoardPage/boardSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { AppDispatch } from '../../../app/store';
import { ListRenameForm, AddCardForm, DropArea, Card } from '@components';
import styles from './List.module.scss';

function refreshLists(
  id: number,
  listToDropId: number,
  listCards: {
    id: number;
    title: string;
    position: number;
    description?: string;
    custom?: { deadline: string } | undefined;
  }[],
  draggedCardName: string,
  draggedCardNewPosition: number,
  setCards: React.Dispatch<
    React.SetStateAction<
      { id: number; title: string; position: number; description?: string; custom?: { deadline: string } | undefined }[]
    >
  >,
  draggedCardId: number,
  dispatch: AppDispatch
): void {
  // Create copy of an array
  // let listCardsCopy = listCards.slice();
  let listCardsCopy = [...listCards];

  if (id === listToDropId) {
    const draggedCard = listCards.find((item) => item.id === draggedCardId);

    // Position of DropArea is less then card by 1 by default
    const newPosition = draggedCardNewPosition + 1;

    if (draggedCard) {
      // If the dragged card is in the same list and we found it, we change card's position
      listCardsCopy = listCardsCopy.map((item) =>
        item.id === draggedCardId ? { ...item, position: newPosition } : item
      );
    } else {
      // If the card is in another list, we should create this card
      listCardsCopy.push({ title: draggedCardName, id: draggedCardId, position: newPosition });
    }
    // Restore positions of all cards in the list
    listCardsCopy = listCardsCopy
      .map((item) =>
        item.position >= newPosition && item.id !== draggedCardId ? { ...item, position: item.position + 1 } : item
      )
      .sort((a, b) => a.position - b.position)
      .map((item, index) => ({ ...item, position: index }));
  } else {
    listCardsCopy = listCardsCopy
      .filter((item) => item.id !== draggedCardId)
      .map((item, index) => ({ ...item, position: index }));
  }
  setCards(listCardsCopy);
  const updatedCards = listCardsCopy.map((item) => ({ id: item.id, position: item.position, list_id: id }));
  dispatch(setUpdatedCards(updatedCards));
}

export function List({ title, listCards, id, boardId }: IList): JSX.Element {
  const dispatch = useAppDispatch();

  const [isAddCardButtonClicked, setIsAddCardButtonClicked] = useState(false);
  const [isListRenameActive, setIsListRenameActive] = useState(false);
  const [cards, setCards] = useState(listCards);
  const [draggedCardNewPosition, setDraggedCardNewPosition] = useState(-2);

  const { draggedCardName, draggedCardId, listToDropId } = useAppSelector((state) => state.board);

  useEffect(() => {
    setCards(listCards);
  }, [listCards]);

  // Refresh cards list to corrrectly display cards when dragging a card
  useEffect(() => {
    refreshLists(
      id,
      listToDropId,
      listCards,
      draggedCardName,
      draggedCardNewPosition,
      setCards,
      draggedCardId,
      dispatch
    );
  }, [draggedCardNewPosition, listToDropId, listCards]);

  const sortedCards = cards.slice().sort((a, b) => a.position - b.position);

  const cardElements = sortedCards.map((item, index) => (
    <div key={item.id} className={styles.card_container}>
      <Card
        key={item.id}
        title={item.title}
        listId={id}
        cardId={item.id}
        position={item.position}
        listTitle={title}
        cardDescription={item.description}
        cards={cards}
      />
      <DropArea
        key={item.id + 1}
        isFirst={false}
        isLast={index === sortedCards.length - 1}
        cardTitle={item.title}
        listId={id}
        position={item.position}
        setDraggedCardNewPos={setDraggedCardNewPosition}
      />
    </div>
  ));

  const handleClick = (): void => {
    setIsAddCardButtonClicked(true);
  };

  const handleListTitleClick = (): void => {
    setIsListRenameActive(true);
  };

  return (
    <div className={styles.list_item}>
      <span className={styles.list_name} onClick={handleListTitleClick}>
        {isListRenameActive ? (
          <ListRenameForm title={title} boardId={boardId} listId={id} setIsListRenameActive={setIsListRenameActive} />
        ) : (
          title
        )}
      </span>
      <div className={styles.card_container}>
        <DropArea
          isFirst
          isLast={sortedCards.length === 0}
          cardTitle="title"
          listId={id}
          position={-1}
          setDraggedCardNewPos={setDraggedCardNewPosition}
        />
      </div>
      {cardElements}
      {isAddCardButtonClicked ? (
        <AddCardForm
          setIsAddCardButtonClicked={setIsAddCardButtonClicked}
          listId={id}
          lastCardPosition={cards ? cards.length : 0}
        />
      ) : (
        <button className={styles.add_card_button} onClick={handleClick}>
          Додати картку
        </button>
      )}
    </div>
  );
}
