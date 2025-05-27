import type { JSX} from 'react';
import React, { useState } from 'react';
import { InputComponent } from '@components';
import type { IListRenameForm } from '@interfaces';
import { renameList } from '@services';
import { useAppDispatch } from '../../../app/hooks';
import { triggerBoardRefresh } from '../../../pages/BoardPage/boardSlice';
import styles from './ListRenameForm.module.scss';

export function ListRenameForm({ title, boardId, listId, setIsListRenameActive }: IListRenameForm): JSX.Element {
  const [newTitle, setNewTitle] = useState(title);
  const dispatch = useAppDispatch();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    renameList(boardId, listId, newTitle, () => dispatch(triggerBoardRefresh()));
    setIsListRenameActive(false);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setNewTitle(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.rename_add_card_form}>
      <InputComponent handleChange={handleChange} value={newTitle} setShouldInputBeOpen={setIsListRenameActive} />
    </form>
  );
}
