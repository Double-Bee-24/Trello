import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { setIsCardModalOpen, triggerBoardRefresh } from '../../boardSlice';
import { CardActionMenu } from './CardActionMenu/CardActionMenu';
import { removeCard, refreshList } from '../../../../api/request';
import './cardModal.scss';

export function CardModal(): JSX.Element {
  const {
    id: receivedCardId,
    title: cardTitle,
    description,
    parentList,
    listId,
    cardPosition,
  } = useAppSelector((state) => state.board.clickedCard);

  const [isCardActionMenuOpen, setIsCardActionMenuOpen] = useState(false);
  const [isMoveButtonClicked, setIsMoveButtonClicked] = useState(false);
  const [isCopyButtonClicked, setIsCopyButtonClicked] = useState(false);
  const [clickedButton, setClickedButton] = useState('');
  const navigate = useNavigate();
  const { boardId } = useParams();
  const board = useAppSelector((state) => state.board.wholeBoard);
  const { lists } = board;

  useEffect(() => {
    if (isCopyButtonClicked) {
      setClickedButton('copy');
    } else if (isMoveButtonClicked) {
      setClickedButton('move');
    } else {
      setClickedButton('');
    }
    setIsCopyButtonClicked(false);
    setIsMoveButtonClicked(false);
  }, [isCardActionMenuOpen]);

  const dispatch = useAppDispatch();

  const handleClose = (): void => {
    navigate(`/board/${boardId}`);
    dispatch(setIsCardModalOpen(false));
  };

  const handleMoveClick = (): void => {
    setIsMoveButtonClicked(true);
    setIsCardActionMenuOpen(true);
  };

  const handleCopyClick = (): void => {
    setIsCopyButtonClicked(true);
    setIsCardActionMenuOpen(true);
  };

  const handleRemoveClick = (): void => {
    removeCard(boardId, receivedCardId, () => dispatch(triggerBoardRefresh()));
    dispatch(setIsCardModalOpen(false));

    // Updates cards positions after removing
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].id === listId) {
        const listCardsCopy = lists[i].cards
          .slice()
          .filter((item) => item.id !== receivedCardId)
          .map((item, index) => ({ ...item, position: index }));

        const updatedCards = listCardsCopy.map((item) => ({ id: item.id, position: item.position, list_id: listId }));
        refreshList(boardId, updatedCards, () => triggerBoardRefresh());

        break;
      }
    }
  };

  return (
    <div>
      <div className="dark-bg" onClick={handleClose} />
      <div className="card-modal">
        <div className="card-modal-title">
          <p>
            <span className="bold card-modal-title">{cardTitle}</span> <br /> У списку{' '}
            <u onClick={handleMoveClick}>{parentList}</u>
          </p>
          <button className="close-btn" onClick={handleClose}>
            X
          </button>
        </div>

        <div className="card-modal-content">
          <div className="card-modal-main">
            <div className="modal-members">
              <div className="modal-members-title">
                <span className="bold">Учасники</span>
              </div>
              <div className="modal-members-list">
                members list
                <button>Доєднатися</button>
              </div>
            </div>
            <div className="description">
              <div className="description-title">
                <span className="bold">Опис</span>
              </div>
              <div className="description-text">{description}</div>
            </div>
          </div>
          <div className="card-modal-actions">
            Дії
            <button onClick={handleMoveClick}>Перемістити</button>
            <button onClick={handleCopyClick}>Копіювати</button>
            <button className="remove-btn" onClick={handleRemoveClick}>
              Видалити
            </button>
            {isCardActionMenuOpen && (
              <CardActionMenu
                setIsCardActionMenuOpen={setIsCardActionMenuOpen}
                performedAction={clickedButton}
                cardTitle={cardTitle}
                openedBoardId={boardId || ''}
                cardId={receivedCardId}
                boardId={boardId}
                listId={listId}
                cardPosition={cardPosition}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
