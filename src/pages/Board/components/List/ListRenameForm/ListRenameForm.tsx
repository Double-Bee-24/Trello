import React, { useState } from 'react';
import { InputComponent } from '../../../../Misc/InputComponent/InputComponent';
import { IListRenameForm } from '../../../../../common/interfaces/IListRenameForm';
import { renameList } from '../../../../../api/request';
import { useAppDispatch } from '../../../../../app/hooks';
import { triggerBoardRefresh } from '../../../boardSlice';
import './listRenameForm.scss';

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
    <form onSubmit={handleSubmit} className="rename-add-card-form">
      <InputComponent handleChange={handleChange} value={newTitle} setShouldInputBeOpen={setIsListRenameActive} />
    </form>
  );
}
