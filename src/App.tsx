import React from 'react';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';
import { store } from './app/store';
import { CardModal } from './pages/Board/components/CardModal/CardModal';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/board/:boardId/*',
    element: <Board />,
    children: [
      {
        path: 'card/:cardId',
        element: <CardModal />,
      },
    ],
  },
]);

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
