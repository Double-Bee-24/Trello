import React, { useState } from 'react';
import { List } from './components/List/List';
import './board.scss';

export function Board(): JSX.Element {
  const [title, setTitle] = useState('Моя тестова дошка');
  const [lists, setLists] = useState([
    {
      id: 1,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 2,
      title: 'В процесі',
      cards: [{ id: 4, title: 'подивитися серіал' }],
    },
    {
      id: 3,
      title: 'Зроблено',
      cards: [
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакою' },
      ],
    },
  ]);

  const listComponents = lists.map((item) => <List key={item.id} title={item.title} cards={item.cards} />);

  return (
    <div className="board-item">
      {title}
      {listComponents}
      <button className="add-list-button">Створити список</button>
    </div>
  );
}
