import React, { useState } from 'react';
import './addBoardModal.scss';
import { postBoard } from '../../../../api/request';
import { IAddBoardModal } from '../../../../common/interfaces/IAddBoardModal';
import { IBoard } from '../../../../common/interfaces/IBoard';

export function AddBoardModal({ setIsOpen, setIsBoardCreated }: IAddBoardModal): JSX.Element {
  const [board, setBoard] = useState<IBoard>({
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
      <div className="dark-bg" onClick={(): void => setIsOpen(false)} />
      <div className="modal">
        <div className="modal-header">
          <h5 className="heading">Створити дошку</h5>
        </div>

        <div className={isInputEmpty ? 'modal-content error' : 'modal-content'}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Назва дошки"
              onChange={handleChange}
              name="boardTitle"
              className={`board-name-input ${isInputEmpty ? 'error-input' : ''}`}
            />
            <div className={`error-message ${isInputEmpty && isSubmitted ? '' : 'invisible'}`}>
              Поле не повинно бути порожнім
            </div>
            <div className="modal-actions">
              <button type="submit" className="create-button">
                Створити
              </button>
              <button className="cancel-button" onClick={(): void => setIsOpen(false)}>
                Відмінити
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
