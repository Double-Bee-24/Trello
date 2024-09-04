import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router';
import { renameBoard } from '../../../../api/request';
import { IBoardRenameForm } from '../../../../common/interfaces/IBoardRenameForm';
import { InputComponent } from '../../../Misc/InputComponent/InputComponent';
import { useAppDispatch } from '../../../../app/hooks';
import { triggerBoardRefresh } from '../../boardSlice';
import './boardRenamedForm.scss';

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
    <div className="board-rename-form-container">
      <form onSubmit={handleSubmit}>
        <InputComponent
          placeholder="Введіть назву дошки..."
          setShouldInputBeOpen={setIsTitleClicked}
          handleChange={handleChange}
          className="board-rename-form-input"
          value={newTitle}
        />
      </form>
      <div className={`error-message ${isInputEmpty ? '' : 'invisible'}`}>Поле не повинно бути порожнім</div>
    </div>
  );
}
