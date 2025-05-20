import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { setIsCardModalOpen, triggerBoardRefresh } from '../../../pages/BoardPage/boardSlice';
import { CardActionMenu } from '@components';
import { removeCard, refreshList } from '@services';
import styles from './CardModal.module.scss';

export function CardModal(): React.JSX.Element {
  const {
    id: receivedCardId,
    title: cardTitle,
    description,
    parentList,
    listId,
    cardPosition,
  } = useAppSelector((state) => state.board.clickedCard);
  const board = useAppSelector((state) => state.board.wholeBoard);
  const { lists } = board;

  const [isCardActionMenuOpen, setIsCardActionMenuOpen] = useState(false);
  const [isMoveButtonClicked, setIsMoveButtonClicked] = useState(false);
  const [isCopyButtonClicked, setIsCopyButtonClicked] = useState(false);
  const [clickedButton, setClickedButton] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { boardId } = useParams();

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
      <div className={styles.dark_bg} onClick={handleClose} />
      <div className={styles.card_modal}>
        <div className={styles.card_modal_title}>
          <p>
            <span className={`${styles.bold} ${styles.card_modal_title}`}>{cardTitle}</span> <br /> У списку{' '}
            <u onClick={handleMoveClick}>{parentList}</u>
          </p>
          <button className={styles.close_btn} onClick={handleClose}>
            X
          </button>
        </div>

        <div className={styles.card_modal_content}>
          <div className={styles.card_modal_main}>
            <div className={styles.modal_members}>
              <div className={styles.modal_members_title}>
                <span className={styles.bold}>Учасники</span>
              </div>
              <div className={styles.modal_members_list}>
                members list
                <button>Доєднатися</button>
              </div>
            </div>
            <div className={styles.description}>
              <div className={styles.description_title}>
                <span className={styles.bold}>Опис</span>
              </div>
              <div className={styles.description_text}>{description}</div>
            </div>
          </div>
          <div className={styles.card_modal_actions}>
            Дії
            <button onClick={handleMoveClick}>Перемістити</button>
            <button onClick={handleCopyClick}>Копіювати</button>
            <button className={styles.remove_btn} onClick={handleRemoveClick}>
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
