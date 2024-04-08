import React from 'react';
import './card.scss';

interface CardProps {
  title: string;
}

export function Card({ title }: CardProps): JSX.Element {
  return <div className="card-item">{title}</div>;
}
