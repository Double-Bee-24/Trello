import React from 'react';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';
import { store } from './app/store';
import { CardModal } from './pages/Board/components/CardModal/CardModal';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { ProtectedRoute } from './pages/Misc/ProtectedRoute/ProtectedRoute';
import { PublicRoute } from './pages/Misc/PublicRoute/PublicRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/board/:boardId/*',
    element: (
      <ProtectedRoute>
        <Board />
      </ProtectedRoute>
    ),
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
