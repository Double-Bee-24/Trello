import { JSX, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BoardPreview, AddBoardModal } from '@components';
import { IBoardsList } from '@interfaces';
import { getBoards } from '@services';
import styles from './HomePage.module.scss';

export function HomePage(): JSX.Element {
  const [boards, setBoards] = useState<IBoardsList[]>([]);
  const [isBoardCreated, setIsBoardCreated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsBoardCreated(false);

    getBoards(setBoards);
  }, [isBoardCreated]);

  const boardComponents = boards.map((item) => (
    <NavLink key={item.id} to={`/board/${item.id}`}>
      <BoardPreview key={item.id} title={item.title} background={item.custom?.color || '#92D1AE'} />
    </NavLink>
  ));

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

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.home_item_container}>
      <div className={styles.home_item}>
        {boardComponents}
        <button className={styles.create_board_button} onClick={(): void => setIsOpen(true)}>
          Створити дошку
        </button>
        {isOpen && <AddBoardModal setIsOpen={setIsOpen} setIsBoardCreated={setIsBoardCreated} />}
      </div>
      <div className={styles.logout_container}>
        <p onClick={handleLogout}>Вийти</p>
      </div>
    </div>
  );
}
