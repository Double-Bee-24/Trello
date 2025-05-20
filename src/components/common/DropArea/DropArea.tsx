import React, { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setListToDropId, setDraggedCardNewPosition } from '../../../pages/BoardPage/boardSlice';
import { IDropArea } from '@interfaces';
import styles from './DropArea.module.scss';

export function DropArea({
  isFirst,
  cardTitle,
  listId,
  position,
  setDraggedCardNewPos,
  isLast,
}: IDropArea): JSX.Element {
  const { isDropAreaActive } = useAppSelector((state) => state.board);

  const dispatch = useAppDispatch();

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();

    setDraggedCardNewPos(position);
    dispatch(setDraggedCardNewPosition(position));
    dispatch(setListToDropId(listId));
  };

  // For css
  const dropAreaClasses = `${styles.drop_area} ${isFirst ? styles.first_drop : ''}
    ${isDropAreaActive ? styles.active_drop : ''} ${isLast ? styles.last_drop : ''}`;

  return (
    <section className={dropAreaClasses} onDragOver={handleDragOver}>
      {cardTitle}
    </section>
  );
}
