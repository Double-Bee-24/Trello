import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router';
import { List } from './components/List/List';
import { BoardRenameForm } from './components/BoardRenameForm/BoardRenameForm';
import { AddListForm } from './components/AddListForm/AddListForm';
import { ILists } from '../../common/interfaces/ILists';
import { fetchBoard, changeBoardColor } from '../../api/request';

import './board.scss';

export function Board(): JSX.Element {
  const [title, setTitle] = useState('');
  const [lists, setLists] = useState<ILists[]>([]);

  // List should have 'position' value, if there are list already, this 'position' is received from last list
  const [lastListPosition, setLastListPosition] = useState(0);

  const [boardColor, setBoardColor] = useState('#92D1AE');
  const [newBoardColor, setNewBoardColor] = useState('');

  // Controls wether form should be displayed or button which leads to form
  const [isTitleClicked, setIsTitleClicked] = useState(false);
  const [isAddListButtonClicked, setIsAddListButtonClicked] = useState(false);

  const [shouldListBeRefreshed, setShouldListBeRefreshed] = useState(false);

  const { boardId } = useParams();

  useEffect(() => {
    fetchBoard(boardId, setLists, setLastListPosition, setTitle, setShouldListBeRefreshed, setBoardColor);
  }, [isAddListButtonClicked, shouldListBeRefreshed]);

  function handleClick(): void {
    setIsTitleClicked(true);
    setIsAddListButtonClicked(false);
  }

  function handleOnAddList(): void {
    setIsAddListButtonClicked(true);
  }

  const listComponents = lists.map((item) => (
    <List
      key={item.id}
      title={item.title}
      cards={item.cards}
      id={item.id}
      setShouldListBeRefreshed={setShouldListBeRefreshed}
    />
  ));

  function handleColorChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setNewBoardColor(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    changeBoardColor(boardId, newBoardColor, setShouldListBeRefreshed);
  }

  const boardItemStyle = {
    // For passing color from React to css
    backgroundColor: boardColor,
  };

  return (
    <div className="board-item" style={boardItemStyle}>
      <div className="title-container" onClick={handleClick}>
        {isTitleClicked ? (
          <BoardRenameForm
            setIsTitleClicked={setIsTitleClicked}
            title={title}
            setShouldListBeRefreshed={setShouldListBeRefreshed}
          />
        ) : (
          title
        )}
      </div>
      <div className="lists-container">
        {listComponents}
        {isAddListButtonClicked ? (
          <AddListForm lastListPosition={lastListPosition} setIsAddListButtonClicked={setIsAddListButtonClicked} />
        ) : (
          <button className="add-list-button" onClick={handleOnAddList}>
            Створити список
          </button>
        )}
      </div>
      <div className="form-change-color-container">
        Змінити колір:
        <form onSubmit={handleSubmit} onBlur={handleSubmit}>
          <input type="color" value={boardColor || '#92D1AE'} onChange={handleColorChange} />
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
