import React, { useState } from 'react';
import { useParams } from 'react-router';
import { createCard } from '../../../../../api/request';
import { IAddCardForm } from '../../../../../common/interfaces/IAddCardForm';
import './addCardForm.scss';
import { InputComponent } from '../../../../Misc/InputComponent/InputComponent';

export function AddCardForm({
  setIsAddCardButtonClicked,
  setShouldListBeRefreshed, // for page refreshing after adding a new card
  listId,
  lastCardPosition,
}: IAddCardForm): JSX.Element {
  const { boardId } = useParams();
  const [cardTitle, setCardTitle] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    createCard(boardId, cardTitle, listId, lastCardPosition, setIsAddCardButtonClicked, setShouldListBeRefreshed);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCardTitle(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="addCard-form">
      <InputComponent
        placeholder="Ввести назву для цієї картки..."
        setShouldInputBeOpen={setIsAddCardButtonClicked}
        handleChange={handleChange}
        isAddForm
      />
      <div className="actionButtons-container">
        <button type="submit" className="add-button">
          Додати картку
        </button>
        <button className="close-button">X</button>
      </div>
    </form>
  );
}
