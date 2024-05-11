import React, { useState, useEffect } from 'react';
import './list.scss';
import { Card } from '../Card/Card';
import { AddCardForm } from './AddCardForm/AddCardForm';
import { IList } from '../../../../common/interfaces/IList';

export function List({ title, cards, id, setShouldListBeRefreshed }: IList): JSX.Element {
  const [isAddCardButtonClicked, setIsAddCardButtonClicked] = useState(false);

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

  return (
    <div className="list-item">
      <span className="list-name">{title}</span>
      {cardElements}
      {isAddCardButtonClicked ? (
        <AddCardForm
          setIsAddCardButtonClicked={setIsAddCardButtonClicked}
          setShouldListBeRefreshed={setShouldListBeRefreshed}
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
