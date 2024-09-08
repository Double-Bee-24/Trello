import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { CardRenameForm } from './CardRenameForm/CardRenameForm';
import { ICard } from '../../../../common/interfaces/ICard';
import {
  setIsCardModalOpen,
  setClickedCard,
  setCards,
  setDraggedCardName,
  setDraggedCardId,
  setIsDropAreaActive,
} from '../../boardSlice';
import './card.scss';

export function Card({ position, cardId, listId, title, listTitle, cardDescription, cards = [] }: ICard): JSX.Element {
  const [isCardTitleClicked, setIsCardTitleClicked] = useState(false);

  const draggedCardId = useAppSelector((state) => state.board.draggedCardId);
  const isCardModalOpen = useAppSelector((state) => state.board.isCardModalOpen);
  const isDropAreaActive = useAppSelector((state) => state.board.isDropAreaActive);
  const board = useAppSelector((state) => state.board.wholeBoard);
  const { lists } = board;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { boardId } = useParams();

  const handleOnDragStart = (e: React.DragEvent, draggedCard: string): void => {
    e.dataTransfer.setData('card', draggedCard);

    dispatch(setIsDropAreaActive(true));
    dispatch(setDraggedCardId(cardId));
    dispatch(setDraggedCardName(title));
  };

  const handleClick = (): void => {
    const shortenedCards = cards.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      position: item.position,
    }));

    dispatch(setIsCardModalOpen(true));
    dispatch(
      setClickedCard({
        title,
        description: cardDescription,
        parentList: listTitle,
        id: cardId,
        listId,
        cardPosition: position,
      })
    );
    dispatch(setCards(shortenedCards));
    navigate(`/board/${boardId}/card/${cardId}`);
  };

  useEffect(() => {
    // Here we decide wether we should display CardModal with related data or close CardModal depends on our URL
    if (location.pathname.includes('card') && !isCardModalOpen) {
      const shortenedCards = cards.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        position: item.position,
      }));

      const clickedCardId = Number(location.pathname.split('/').at(-1));

      const parentListObject = lists.find((list) => list.cards.find((card) => card.id === clickedCardId));

      const foundCard = parentListObject?.cards.find((card) => card.id === clickedCardId);
      dispatch(setIsCardModalOpen(true));

      if (foundCard && parentListObject) {
        const parentList = parentListObject.title;
        const parentListId = parentListObject.id;

        dispatch(
          setClickedCard({
            title: foundCard.title,
            description: foundCard.description,
            parentList,
            id: foundCard.id,
            listId: parentListId,
            cardPosition: foundCard.position,
          })
        );
      }

      dispatch(setCards(shortenedCards));
    } else if (!location.pathname.includes('card')) {
      dispatch(setIsCardModalOpen(false));
    }
  }, [location]);

  const cardClasses = `card-item ${isDropAreaActive && cardId === draggedCardId ? 'semi-visible' : ''}`;

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      draggable="true"
      onDragStart={(e) => {
        handleOnDragStart(e, JSON.stringify({ title, cardId, listId, cardDescription }));
      }}
    >
      {isCardTitleClicked ? (
        <CardRenameForm setIsCardTitleClicked={setIsCardTitleClicked} title={title} listId={listId} cardId={cardId} />
      ) : (
        title
      )}
      <div
        className={`redacting-mark-wrapper ${isCardTitleClicked || isDropAreaActive ? 'redacting-hidden' : ''} `}
        onClick={(e) => {
          e.stopPropagation();
          setIsCardTitleClicked(true);
        }}
      >
        <img src="/assets/reducting-mark.png" alt="redacting mark" className="redacting-mark" />
      </div>
    </div>
  );
}
