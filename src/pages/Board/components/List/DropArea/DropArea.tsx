import React from 'react';
import { IDropArea } from '../../../../../common/interfaces/IDropArea';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { setListToDropId, setDraggedCardNewPosition } from '../../../boardSlice';
import './dropArea.scss';

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
  const dropAreaClasses = `drop-area ${isFirst ? 'first-drop' : ''}
    ${isDropAreaActive ? 'active-drop' : ''} ${isLast ? 'last-drop' : ''}`;

  return (
    <section className={dropAreaClasses} onDragOver={handleDragOver}>
      {cardTitle}
    </section>
  );
}
