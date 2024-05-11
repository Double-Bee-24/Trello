import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BoardPreview } from './components/BoardPreview/BoardPreview';
import { AddBoardModal } from './components/AddBoardModal/AddBoardModal';
import { IBoard } from '../../common/interfaces/IBoard';
import { ProgressBar } from './components/ProgressBar/ProgressBar';
import { getBoards } from '../../api/request';
import './home.scss';

export function Home(): JSX.Element {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [isBoardCreated, setIsBoardCreated] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    setIsBoardCreated(false);
    setIsLoading(true);

    getBoards(setLoadingProgress, setIsLoading, setBoards);
  }, [isBoardCreated]);

  const boardComponents = boards.map((item) => (
    <Link key={item.id} to={`/board/${item.id}`}>
      <BoardPreview key={item.id} title={item.title} background={item.custom?.color || '#92D1AE'} />
    </Link>
  ));

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="home-item">
      {boardComponents}
      <button className="create-board-button" onClick={(): void => setIsOpen(true)}>
        Створити дошку{process.env.REACT_APP_API_URL}
      </button>
      {isOpen && <AddBoardModal setIsOpen={setIsOpen} setIsBoardCreated={setIsBoardCreated} />}
      {isLoading && <ProgressBar progress={loadingProgress} />}
    </div>
  );
}
