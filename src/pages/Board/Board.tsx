import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { List } from './components/List/List';
import { BoardRenameForm } from './components/BoardRenameForm/BoardRenameForm';
import { AddListForm } from './components/AddListForm/AddListForm';
import { CardModal } from './components/CardModal/CardModal';
import { getBoards, refreshList } from '../../api/request';
import {
  triggerBoardRefresh,
  resetBoardRefreshStatus,
  fetchBoard,
  setBoardsList,
  setIsDropAreaActive,
  resetUpdatedCards,
} from './boardSlice';
import { BoardMenu } from './components/BoardMenu/BoardMenu';
import './board.scss';

export function Board(): JSX.Element {
  // Controls wether form should be displayed or button which leads to form
  const [isTitleClicked, setIsTitleClicked] = useState(false);
  const [isAddListButtonClicked, setIsAddListButtonClicked] = useState(false);
  const [isBoardMenuOpened, setIsBoardMenuOpened] = useState(false);
  const [boards, setBoards] = useState([]);

  const board = useAppSelector((state) => state.board.wholeBoard);
  const shouldBoardBeRefreshed = useAppSelector((state) => state.board.shouldBoardBeRefreshed);
  const isCardModalOpen = useAppSelector((state) => state.board.isCardModalOpen);
  const updatedCards = useAppSelector((state) => state.board.updatedCards);

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
    <div className="board-item" style={boardItemStyle} onDrop={handleDrop} onDragOver={handleDragOver}>
      <div className="title-container">
        <div className={`title-wrapper ${isTitleClicked ? 'hidden' : ''}`} onClick={handleClick}>
          {isTitleClicked ? <BoardRenameForm setIsTitleClicked={setIsTitleClicked} title={board.title} /> : board.title}
        </div>
        <div
          className="board-menu-button-wrapper"
          onClick={() => {
            setIsBoardMenuOpened(true);
          }}
        >
          <img
            src="/assets/three-dots.png"
            alt="menu button"
            className={`board-menu-button ${isBoardMenuOpened ? 'menu-button-hidden' : ''}`}
          />
        </div>
        {isBoardMenuOpened && <BoardMenu boardId={boardId} setIsBoardMenuOpened={setIsBoardMenuOpened} />}
      </div>
      <div className="lists-container">
        {listComponents}
        {isAddListButtonClicked ? (
          <AddListForm lastListPosition={lists.length} setIsAddListButtonClicked={setIsAddListButtonClicked} />
        ) : (
          <button
            className="add-list-button"
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
