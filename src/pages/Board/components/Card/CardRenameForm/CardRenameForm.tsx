import React, { useState } from 'react';
import { useParams } from 'react-router';
import { renameCard } from '../../../../../api/request';
import { ICardRenameForm } from '../../../../../common/interfaces/ICardRenameForm';
import { InputComponent } from '../../../../Misc/InputComponent/InputComponent';
import { useAppDispatch } from '../../../../../app/hooks';
import { triggerBoardRefresh } from '../../../boardSlice';
import './cardRenameForm.scss';

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
    <form onSubmit={handleSubmit} className="rename-add-card-form">
      <InputComponent handleChange={handleChange} value={newTitle} setShouldInputBeOpen={setIsCardTitleClicked} />
    </form>
  );
}
