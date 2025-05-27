import type { JSX} from 'react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IBoardMenu } from '@interfaces';
import { removeBoard, changeBoardColor } from '@services';
import { useAppDispatch } from '../../../app/hooks';
import { triggerBoardRefresh } from '../../../pages/BoardPage/boardSlice';
import styles from './BoardMenu.module.scss';

export function BoardMenu({ boardId, setIsBoardMenuOpened }: IBoardMenu): JSX.Element {
  const [isColorFormVisible, setIsColorFormVisible] = useState(false);
  const [newColor, setNewColor] = useState('#ffffff');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
    <div className={styles.board_menu}>
      <div className={styles.close_btn_container}>
        <div className={styles.close_btn_wrapper}>
          <button className={styles.close_btn} onClick={handleClose}>
            X
          </button>
        </div>
      </div>
      <div className={styles.common_button_container}>
        <button onClick={handleDeleteClick} className={styles.delete_btn}>
          Видалити
        </button>
        <button onClick={handleColorChangeClick} className={styles.change_color_btn}>
          Змінити колір
        </button>
        <button onClick={handleLogout} className={styles.logout_btn}>
          Вийти
        </button>
      </div>
      {isColorFormVisible && (
        <div className={styles.color_form_wrapper}>
          <form onSubmit={handleColorSubmit} className={styles.color_change_form}>
            <div className={styles.color_form_header}>
              <span>Виберіть колір</span>
              <button type="button" className={styles.close_form_btn} onClick={handleColorFormClose}>
                X
              </button>
            </div>
            <input type="color" value={newColor} onChange={handleColorChange} />
            <button type="submit" className={styles.submit_color_btn}>
              Зберегти
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
