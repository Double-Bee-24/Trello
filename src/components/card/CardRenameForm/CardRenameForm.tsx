import React, { JSX, useState } from 'react';
import { useParams } from 'react-router';
import { renameCard } from '@services';
import { InputComponent } from '@components';
import { useAppDispatch } from 'src/app/hooks';
import { triggerBoardRefresh } from 'src/pages/BoardPage/boardSlice';
import { ICardRenameForm } from '@interfaces';
import styles from './CardRenameForm.module.scss';

export function CardRenameForm({ setIsCardTitleClicked, title, listId, cardId }: ICardRenameForm): JSX.Element {
  const [newTitle, setNewTitle] = useState(title);
  const { boardId } = useParams();
  const dispatch = useAppDispatch();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    renameCard(boardId, cardId, newTitle, listId, setIsCardTitleClicked, () => dispatch(triggerBoardRefresh()));
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setNewTitle(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.rename_add_card_form}>
      <InputComponent handleChange={handleChange} value={newTitle} setShouldInputBeOpen={setIsCardTitleClicked} />
    </form>
  );
}
