import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IBoardMenu } from '../../../../common/interfaces/IBoardMenu';
import { removeBoard, changeBoardColor } from '../../../../api/request';
import { useAppDispatch } from '../../../../app/hooks';
import './boardMenu.scss';
import { triggerBoardRefresh } from '../../boardSlice';

export function BoardMenu({ boardId, setIsBoardMenuOpened }: IBoardMenu): JSX.Element {
  const [isColorFormVisible, setIsColorFormVisible] = useState(false);
  const [newColor, setNewColor] = useState('#ffffff');
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // Ініціалізуємо navigate

  const handleDeleteClick = (): void => {
    removeBoard(boardId);
  };

  const handleColorChangeClick = (): void => {
    setIsColorFormVisible(!isColorFormVisible);
  };

  const handleClose = (): void => {
    setIsBoardMenuOpened(false);
  };

  const handleColorFormClose = (): void => {
    setIsColorFormVisible(false);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewColor(e.target.value);
  };

  const handleColorSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsColorFormVisible(false);
    setIsBoardMenuOpened(false);
    changeBoardColor(boardId, newColor, () => {
      dispatch(triggerBoardRefresh());
    });
  };

  const handleLogout = async (): Promise<void> => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authorizationStatus');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="board-menu">
      <div className="close-btn-container">
        <div className="close-btn-wrapper">
          <button className="close-btn" onClick={handleClose}>
            X
          </button>
        </div>
      </div>
      <div className="common-button-container">
        <button onClick={handleDeleteClick} className="delete-btn">
          Видалити
        </button>
        <button onClick={handleColorChangeClick} className="change-color-btn">
          Змінити колір
        </button>
        <button onClick={handleLogout} className="logout-btn">
          Вийти
        </button>
      </div>
      {isColorFormVisible && (
        <div className="color-form-wrapper">
          <form onSubmit={handleColorSubmit} className="color-change-form">
            <div className="color-form-header">
              <span>Виберіть колір</span>
              <button type="button" className="close-form-btn" onClick={handleColorFormClose}>
                X
              </button>
            </div>
            <input type="color" value={newColor} onChange={handleColorChange} />
            <button type="submit" className="submit-color-btn">
              Зберегти
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
