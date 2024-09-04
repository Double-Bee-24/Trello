import React, { useState, useEffect } from 'react';
import './list.scss';
import { Card } from '../Card/Card';
import { DropArea } from './DropArea/DropArea';
import { AddCardForm } from './AddCardForm/AddCardForm';
import { IList } from '../../../../common/interfaces/IList';
import { setUpdatedCards } from '../../boardSlice';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { AppDispatch } from '../../../../app/store';

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
  cards: {
    id: number;
    title: string;
    position: number;
    description?: string;
    custom?: { deadline: string } | undefined;
  }[],
  draggedCardId: number,
  dispatch: AppDispatch
): void {
  if (id === listToDropId) {
    const draggedCard = listCards.find((item) => item.id === draggedCardId);

    // Position of DropArea is less then card by 1 by default
    const newPosition = draggedCardNewPosition + 1;

    let listCardsCopy = listCards.slice();

    if (draggedCard) {
      // If the dragged card is in the same list and we found it, we change card's position
      listCardsCopy = listCardsCopy.map((item) => {
        if (item.id === draggedCardId) {
          return { ...item, position: newPosition };
        }
        return item;
      });
    } else {
      // If the card in another list, we should create this card
      listCardsCopy.push({ title: draggedCardName, id: draggedCardId, position: newPosition });
    }

    // Restore positions of all cards in the list
    listCardsCopy = listCardsCopy
      .map((item) => {
        if (item.id !== draggedCardId) {
          if (item.position < newPosition) {
            return { ...item, position: item.position - 1 };
          }

          return { ...item, position: item.position + 1 };
        }

        return item;
      })
      .sort((a, b) => a.position - b.position)
      .map((item, index) => ({ ...item, position: index }));
    const updatedCards = listCardsCopy.map((item) => ({ id: item.id, position: item.position, list_id: id }));
    dispatch(setUpdatedCards(updatedCards));

    setCards(listCardsCopy);
  } else {
    // Remove dragged card from the list when this card leaves that list
    const draggedCard = cards.find((item) => item.id === draggedCardId);

    if (draggedCard) {
      const listCardsCopy = listCards
        .slice()
        .filter((item) => item.id !== draggedCardId)
        .map((item, index) => ({ ...item, position: index }));

      setCards(listCardsCopy);
      const updatedCards = listCardsCopy.map((item) => ({ id: item.id, position: item.position, list_id: id }));
      dispatch(setUpdatedCards(updatedCards));
    } else {
      const updatedCards = listCards.map((item) => ({ id: item.id, position: item.position, list_id: id }));
      dispatch(setUpdatedCards(updatedCards));
    }
  }
}

export function List({ title, listCards, id, boardId }: IList): JSX.Element {
  const dispatch = useAppDispatch();

  const [isAddCardButtonClicked, setIsAddCardButtonClicked] = useState(false);
  const [cards, setCards] = useState(listCards);
  const [isDragged, setIsDragged] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [draggedCardNewPosition, setDraggedCardNewPosition] = useState(-2);

  const draggedCardName = useAppSelector((state) => state.board.draggedCardName);
  const draggedCardId = useAppSelector((state) => state.board.draggedCardId);
  const listToDropId = useAppSelector((state) => state.board.listToDropId);

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
      cards,
      draggedCardId,
      dispatch
    );
  }, [draggedCardNewPosition, listToDropId]);

  const sortedCards = cards.slice().sort((a, b) => a.position - b.position);

  const cardElements = sortedCards.map((item, index) => (
    <div key={item.id} className="card-container">
      <Card
        key={item.id}
        title={item.title}
        listId={id}
        cardId={item.id}
        position={item.position}
        boardId={boardId}
        isDragged={isDragged}
        setIsDragged={setIsDragged}
        listTitle={title}
        cardDescription={item.description}
        cards={cards}
      />
      <DropArea
        isFirst={false}
        isLast={index === sortedCards.length - 1}
        boardId={boardId}
        cardTitle={item.title}
        listId={id}
        position={item.position}
        setIsAddCardButtonClicked={setIsAddCardButtonClicked}
        setIsDragged={setIsDragged}
        cards={cards}
        setCards={setCards}
        setDraggedCardNewPos={setDraggedCardNewPosition}
      />
    </div>
  ));

  const handleClick = (): void => {
    setIsAddCardButtonClicked(true);
  };

  const handleDragEnter = (): void => {
    setDragCounter(dragCounter + 1);
  };

  const handleDragLeave = (): void => {
    setDragCounter(dragCounter - 1);
  };

  return (
    <div className="list-item" onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}>
      <span className="list-name">{title}</span>
      <div className="card-container">
        <DropArea
          isFirst
          isLast={sortedCards.length === 0}
          boardId={boardId}
          cardTitle="title"
          listId={id}
          position={-1}
          setIsAddCardButtonClicked={setIsAddCardButtonClicked}
          setIsDragged={setIsDragged}
          cards={sortedCards}
          setCards={setCards}
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
        <button className="add-card-button" onClick={handleClick}>
          Додати картку
        </button>
      )}
    </div>
  );
}
