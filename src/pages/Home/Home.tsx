import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BoardPreview } from './components/BoardPreview/BoardPreview';
import { AddBoardModal } from './components/AddBoardModal/AddBoardModal';
import { IBoardsList } from '../../common/interfaces/IBoardsList';
import { ProgressBar } from './components/ProgressBar/ProgressBar';
import { getBoards } from '../../api/request';
import './home.scss';

export function Home(): JSX.Element {
  const [boards, setBoards] = useState<IBoardsList[]>([]);
  const [isBoardCreated, setIsBoardCreated] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setIsBoardCreated(false);
    setIsLoading(true);

    getBoards(setBoards, setIsLoading, setLoadingProgress);
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
    <div className="home-item-container">
      <div className="home-item">
        {boardComponents}
        <button className="create-board-button" onClick={(): void => setIsOpen(true)}>
          Створити дошку
        </button>
        {isOpen && <AddBoardModal setIsOpen={setIsOpen} setIsBoardCreated={setIsBoardCreated} />}
        {/* {isLoading && <ProgressBar progress={loadingProgress} />} */}
      </div>
      <div className="logout-container">
        <p onClick={handleLogout}>Вийти</p>
      </div>
    </div>
  );
}
