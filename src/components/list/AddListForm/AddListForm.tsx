import type { JSX} from 'react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { createList } from '@services';
import type { IAddListForm } from '@interfaces';
import { InputComponent } from '@components';
import { useAppDispatch } from '../../../app/hooks';
import { triggerBoardRefresh } from '../../../pages/BoardPage/boardSlice';
import styles from './AddListForm.module.scss';

export function AddListForm({ lastListPosition, setIsAddListButtonClicked }: IAddListForm): JSX.Element {
  const [listTitle, setListTitle] = useState('');
  const { boardId } = useParams();
  const dispatch = useAppDispatch();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    createList(boardId, listTitle, lastListPosition, setIsAddListButtonClicked, () => dispatch(triggerBoardRefresh()));
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const changedListTitle = event.target.value;
    setListTitle(changedListTitle);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.addList_form}>
      <InputComponent
        placeholder="Введіть назву списку"
        handleChange={handleChange}
        setShouldInputBeOpen={setIsAddListButtonClicked}
        isAddForm
        value={listTitle}
      />
      <div className={styles.actions_container}>
        <button type="submit" className={styles.add_button}>
          Додати список
        </button>
        <button onClick={(): void => setIsAddListButtonClicked(false)} className={styles.close_button}>
          X
        </button>
      </div>
    </form>
  );
}
