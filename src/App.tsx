import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/board/:boardId',
    element: <Board />,
  },
]);

function App(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;
