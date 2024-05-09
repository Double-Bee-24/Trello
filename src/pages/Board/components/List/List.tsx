import React, { useState, useEffect } from 'react';
import './list.scss';
import { Card } from '../Card/Card';
import { AddCardForm } from './AddCardForm/AddCardForm';
import { IList } from '../../../../common/interfaces/IList';

export function List({ title, cards, id, setShouldListBeRefreshed }: IList): JSX.Element {
  const [isAddCardButtonClicked, setIsAddCardButtonClicked] = useState(false);
  const [lastCardPosition, setLastCardPosition] = useState(0);

  const cardElements = cards.map((item) => (
    <Card
      key={item.id}
      title={item.title}
      listId={id}
      cardId={item.id}
      setShouldListBeRefreshed={setShouldListBeRefreshed}
    />
  ));

  function handleClick(): void {
    setIsAddCardButtonClicked(true);
  }

  useEffect(() => {
    if (cards.length > 0) {
      const lastPosition = cards[cards.length - 1].position;
      setLastCardPosition(lastPosition);
    }
  }, [cards]);

  return (
    <div className="list-item">
      <span className="list-name">{title}</span>
      {cardElements}
      {isAddCardButtonClicked ? (
        <AddCardForm
          setIsAddCardButtonClicked={setIsAddCardButtonClicked}
          setShouldListBeRefreshed={setShouldListBeRefreshed}
          listId={id}
          lastCardPosition={lastCardPosition}
        />
      ) : (
        <button className="add-card-button" onClick={handleClick}>
          Додати картку
        </button>
      )}
    </div>
  );
}
