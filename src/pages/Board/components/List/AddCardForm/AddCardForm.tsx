import React, { useState } from 'react';
import { useParams } from 'react-router';
import { createCard } from '../../../../../api/request';
import { IAddCardForm } from '../../../../../common/interfaces/IAddCardForm';
import './addCardForm.scss';
import { InputComponent } from '../../../../Misc/InputComponent/InputComponent';
import { useAppDispatch } from '../../../../../app/hooks';
import { triggerBoardRefresh } from '../../../boardSlice';

export function AddCardForm({ setIsAddCardButtonClicked, listId, lastCardPosition }: IAddCardForm): JSX.Element {
  const [cardTitle, setCardTitle] = useState('');
  const { boardId } = useParams();
  const dispatch = useAppDispatch();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    createCard(boardId, cardTitle, listId, lastCardPosition, setIsAddCardButtonClicked, () =>
      dispatch(triggerBoardRefresh())
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCardTitle(e.target.value);
  };

  const handleClose = (): void => {
    setIsAddCardButtonClicked(false);
  };

  return (
    <form onSubmit={handleSubmit} className="addCard-form">
      <InputComponent
        placeholder="Ввести назву для цієї картки..."
        setShouldInputBeOpen={setIsAddCardButtonClicked}
        handleChange={handleChange}
        value={cardTitle}
        isAddForm
      />
      <div className="actionButtons-container">
        <button type="submit" className="add-button">
          Додати картку
        </button>
        <button className="close-button" onClick={handleClose}>
          X
        </button>
      </div>
    </form>
  );
}
