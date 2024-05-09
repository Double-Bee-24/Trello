import React, { useState } from 'react';
import { CardRenameForm } from './CardRenameForm/CardRenameForm';
import { ICard } from '../../../../common/interfaces/ICard';
import './card.scss';

export function Card({ title, listId, cardId, setShouldListBeRefreshed }: ICard): JSX.Element {
  const [isCardTitleClicked, setIsCardTitleClicked] = useState(false);

  function handleClick(): void {
    setIsCardTitleClicked(true);
  }

  return (
    <div className="card-item" onClick={handleClick}>
      {isCardTitleClicked ? (
        <CardRenameForm
          setIsCardTitleClicked={setIsCardTitleClicked}
          title={title}
          listId={listId}
          cardId={cardId}
          setShouldListBeRefreshed={setShouldListBeRefreshed}
        />
      ) : (
        title
      )}
    </div>
  );
}
