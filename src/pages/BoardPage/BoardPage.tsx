import type { JSX} from 'react';
import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { BoardRenameForm, List, AddListForm, CardModal, BoardMenu } from '@components';
import { getBoards, refreshList } from '@services';
import {
  triggerBoardRefresh,
  resetBoardRefreshStatus,
  fetchBoard,
  setBoardsList,
  setIsDropAreaActive,
  resetUpdatedCards,
} from './boardSlice';
import styles from './BoardPage.module.scss';

export function BoardPage(): JSX.Element {
  // Controls wether form should be displayed or button which leads to form
  const [isTitleClicked, setIsTitleClicked] = useState(false);
  const [isAddListButtonClicked, setIsAddListButtonClicked] = useState(false);
  const [isBoardMenuOpened, setIsBoardMenuOpened] = useState(false);
  const [boards, setBoards] = useState([]);

  const {
    wholeBoard: board,
    shouldBoardBeRefreshed,
    isCardModalOpen,
    updatedCards,
  } = useAppSelector((state) => state.board);

  const boardColor = board.custom.color;
  const { lists } = board;

  const dispatch = useAppDispatch();
  const { boardId } = useParams();

  useEffect(() => {
    dispatch(resetBoardRefreshStatus());
    dispatch(fetchBoard({ boardId }));
    getBoards(setBoards);

    if (isCardModalOpen) {
      // Set data to 'selectedBoard' state, which is used to have options while moving a card between boards
      const isSelectedBoard = true;
      dispatch(fetchBoard({ boardId, isSelectedBoard }));
    }
  }, [shouldBoardBeRefreshed]);

  useEffect(() => {
    dispatch(setBoardsList(boards));
  });

  function handleClick(): void {
    setIsTitleClicked(true);
    setIsAddListButtonClicked(false);
  }

  const listComponents = lists.map((item) => (
    <List key={item.id} title={item.title} listCards={item.cards} id={item.id} boardId={boardId} />
  ));

  const boardItemStyle = {
    // For passing color from React to css
    backgroundColor: boardColor,
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();

    dispatch(setIsDropAreaActive(false));

    refreshList(boardId, updatedCards, () => triggerBoardRefresh());
    dispatch(triggerBoardRefresh());
    dispatch(resetUpdatedCards());
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
  };

  return (
    <div className={styles.board_item} style={boardItemStyle} onDrop={handleDrop} onDragOver={handleDragOver}>
      <div className={styles.title_container}>
        <div className={`${styles.title_wrapper} ${isTitleClicked ? styles.hidden : ''}`} onClick={handleClick}>
          {isTitleClicked ? <BoardRenameForm setIsTitleClicked={setIsTitleClicked} title={board.title} /> : board.title}
        </div>
        <div
          className={styles.board_menu_button_wrapper}
          onClick={() => {
            setIsBoardMenuOpened(true);
          }}
        >
          <img
            src="/assets/three-dots.png"
            alt="menu button"
            className={`${styles.board_menu_button} ${isBoardMenuOpened ? styles.menu_button_hidden : ''}`}
          />
        </div>
        {isBoardMenuOpened && <BoardMenu boardId={boardId} setIsBoardMenuOpened={setIsBoardMenuOpened} />}
      </div>
      <div className={styles.lists_container}>
        {listComponents}
        {isAddListButtonClicked ? (
          <AddListForm lastListPosition={lists.length} setIsAddListButtonClicked={setIsAddListButtonClicked} />
        ) : (
          <button
            className={styles.add_list_button}
            onClick={(): void => {
              setIsAddListButtonClicked(true);
            }}
          >
            Створити список
          </button>
        )}
      </div>
      {isCardModalOpen && <CardModal />}
      <ToastContainer />
    </div>
  );
}
