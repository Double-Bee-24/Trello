import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Board } from './pages/Board/Board';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>React app main page</div>,
  },
  {
    path: '/board',
    element: <Board />,
  },
]);

function App(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;
