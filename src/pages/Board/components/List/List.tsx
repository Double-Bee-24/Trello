import React from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import './list.scss';
import { Card } from '../Card/Card';

interface ListProps {
  title: string;
  cards: ICard[];
}

export function List({ title, cards }: ListProps): JSX.Element {
  const cardElements = cards.map((item) => <Card key={item.id} title={item.title} />);

  return (
    <div className="list-item">
      <span className="list-name">{title}</span>
      {cardElements}
      <button className="add-card-button">Додати картку</button>
    </div>
  );
}
