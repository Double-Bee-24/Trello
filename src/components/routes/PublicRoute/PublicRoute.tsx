import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: JSX.Element;
}

// Available only for unauthorized user
export function PublicRoute({ children }: PublicRouteProps): JSX.Element {
  const authorizationStatus = localStorage.getItem('authorizationStatus');

  if (authorizationStatus === 'Authorized') {
    return <Navigate to="/" replace />;
  }

  return children;
}
