import type { JSX} from 'react';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { createCard } from '@services';
import { InputComponent } from '@components';
import { useAppDispatch } from '../../../app/hooks';
import { triggerBoardRefresh } from '../../../pages/BoardPage/boardSlice';
import type { IAddCardForm } from '@interfaces';
import styles from './AddCardForm.module.scss';

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
    <form onSubmit={handleSubmit} className={styles.addCard_form}>
      <InputComponent
        placeholder="Ввести назву для цієї картки..."
        setShouldInputBeOpen={setIsAddCardButtonClicked}
        handleChange={handleChange}
        value={cardTitle}
        isAddForm
      />
      <div className={styles.actionButtons_container}>
        <button type="submit" className={styles.add_button}>
          Додати картку
        </button>
        <button className={styles.close_button} onClick={handleClose}>
          X
        </button>
      </div>
    </form>
  );
}
