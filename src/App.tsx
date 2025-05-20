import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BoardPage, HomePage, LoginPage } from '@pages';
import { CardModal, ProtectedRoute, PublicRoute } from '@components';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
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
        <BoardPage />
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

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
