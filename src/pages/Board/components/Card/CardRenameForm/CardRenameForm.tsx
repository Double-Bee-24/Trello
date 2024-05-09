import React, { useState } from 'react';
import { useParams } from 'react-router';
import { renameCard } from '../../../../../api/request';
import { ICardRenameForm } from '../../../../../common/interfaces/ICardRenameForm';
import './cardRenameForm.scss';
import { InputComponent } from '../../../../Misc/InputComponent/InputComponent';

export function CardRenameForm({
  setIsCardTitleClicked,
  title,
  listId,
  cardId,
  setShouldListBeRefreshed,
}: ICardRenameForm): JSX.Element {
  const [newTitle, setNewTitle] = useState(title);
  const { boardId } = useParams();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    renameCard(boardId, cardId, newTitle, listId, setIsCardTitleClicked, setShouldListBeRefreshed);
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
