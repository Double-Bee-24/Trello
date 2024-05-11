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

  const [boardColor, setBoardColor] = useState('#92D1AE');

  // Controls wether form should be displayed or button which leads to form
  const [isTitleClicked, setIsTitleClicked] = useState(false);
  const [isAddListButtonClicked, setIsAddListButtonClicked] = useState(false);

  const [shouldListBeRefreshed, setShouldListBeRefreshed] = useState(false);

  const { boardId } = useParams();

  useEffect(() => {
    fetchBoard(boardId, setLists, setTitle, setShouldListBeRefreshed, setBoardColor);
  }, [shouldListBeRefreshed]);

  function handleClick(): void {
    setIsTitleClicked(true);
    setIsAddListButtonClicked(false);
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
    setBoardColor(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    changeBoardColor(boardId, boardColor, setShouldListBeRefreshed);
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
          <AddListForm
            lastListPosition={lists.length}
            setIsAddListButtonClicked={setIsAddListButtonClicked}
            setShouldListBeRefreshed={setShouldListBeRefreshed}
          />
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
