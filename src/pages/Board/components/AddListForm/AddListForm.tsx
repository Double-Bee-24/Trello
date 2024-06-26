import React, { useState } from 'react';
import { useParams } from 'react-router';
import { createList } from '../../../../api/request';
import { IAddListForm } from '../../../../common/interfaces/IAddListForm';
import './addListForm.scss';
import { InputComponent } from '../../../Misc/InputComponent/InputComponent';

export function AddListForm({
  lastListPosition,
  setIsAddListButtonClicked,
  setShouldListBeRefreshed,
}: IAddListForm): JSX.Element {
  const [listTitle, setListTitle] = useState('');
  const { boardId } = useParams();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    createList(boardId, listTitle, lastListPosition, setIsAddListButtonClicked, setShouldListBeRefreshed);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const changedListTitle = event.target.value;
    setListTitle(changedListTitle);
  };

  return (
    <form onSubmit={handleSubmit} className="addList-form">
      <InputComponent
        placeholder="Введіть назву списку"
        handleChange={handleChange}
        setShouldInputBeOpen={setIsAddListButtonClicked}
        isAddForm
      />
      <div className="actions-container">
        <button type="submit" className="add-button">
          Додати список
        </button>
        <button onClick={(): void => setIsAddListButtonClicked(false)} className="close-button">
          X
        </button>
      </div>
    </form>
  );
}
