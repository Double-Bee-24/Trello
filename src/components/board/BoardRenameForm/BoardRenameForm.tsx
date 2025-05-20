import React, { JSX, useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router';
import { renameBoard } from '@services';
import { IBoardRenameForm } from '@interfaces';
import { InputComponent } from '@components';
import { useAppDispatch } from '../../../app/hooks';
import { triggerBoardRefresh } from '../../../pages/BoardPage/boardSlice';
import styles from './BoardRenameForm.module.scss';

// Shows a form Element when user clickes on a title line
export function BoardRenameForm({ setIsTitleClicked, title }: IBoardRenameForm): JSX.Element {
  const [newTitle, setNewTitle] = useState(title);
  const [isInputEmpty, setIsInputEmpty] = useState(false);

  const dispatch = useAppDispatch();
  const { boardId } = useParams();

  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    renameBoard(boardId, newTitle, setIsInputEmpty);

    setIsTitleClicked(false);
    dispatch(triggerBoardRefresh());
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setNewTitle(event.target.value);
    if (event.target.value.length > 0) {
      setIsInputEmpty(false);
    } else {
      setIsInputEmpty(true);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={styles.board_rename_form_container}>
      <form onSubmit={handleSubmit}>
        <InputComponent
          placeholder="Введіть назву дошки..."
          setShouldInputBeOpen={setIsTitleClicked}
          handleChange={handleChange}
          className="board-rename-form-input"
          value={newTitle}
        />
      </form>
      <div className={`${styles.error_message} ${isInputEmpty ? '' : styles.invisible}`}>
        Поле не повинно бути порожнім
      </div>
    </div>
  );
}
