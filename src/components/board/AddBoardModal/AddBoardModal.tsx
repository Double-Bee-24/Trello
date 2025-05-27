import type { JSX} from 'react';
import React, { useState } from 'react';
import { postBoard } from '@services';
import type { IAddBoardModal, IBoardsList } from '@interfaces';
import styles from './AddBoardModal.module.scss';

export function AddBoardModal({ setIsOpen, setIsBoardCreated }: IAddBoardModal): JSX.Element {
  const [board, setBoard] = useState<IBoardsList>({
    title: '',
    custom: {
      color: '',
      description: '',
    },
  });
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Adds board title to the board that user wanted to create
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const boardTitle = event.target.value;

    // Took away the red frame if there is some text in an input field
    if (boardTitle.length > 0) {
      setIsInputEmpty(false);
      setIsSubmitted(false);
    } else {
      setIsInputEmpty(true);
    }

    setBoard((prevBoard) => ({
      ...prevBoard,
      title: boardTitle,
    }));
  };

  // Sends new board data on server to create this board
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (board.title.length > 0) {
      postBoard(board);
      setIsBoardCreated(true);
      setIsOpen(false);
    } else {
      setIsSubmitted(true);
      setIsInputEmpty(true);
    }
  };

  return (
    <div>
      <div className={styles.dark_bg} onClick={(): void => setIsOpen(false)} />
      <div className={styles.modal}>
        <div className={styles.modal_header}>
          <h5 className={styles.heading}>Створити дошку</h5>
        </div>

        <div className={isInputEmpty ? `${styles.modal_content} ${styles.error}` : styles.modal_content}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Назва дошки"
              onChange={handleChange}
              name="boardTitle"
              className={`${styles.board_name_input} ${isInputEmpty ? styles.error_input : ''}`}
            />
            <div className={`${styles.error_message} ${isInputEmpty && isSubmitted ? '' : styles.invisible}`}>
              Поле не повинно бути порожнім
            </div>
            <div className={styles.modal_actions}>
              <button type="submit" className={styles.create_button}>
                Створити
              </button>
              <button className={styles.cancel_button} onClick={(): void => setIsOpen(false)}>
                Відмінити
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
