import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { setPathname } from '../../Board/boardSlice';

interface ProtectedRouteProps {
  children: JSX.Element;
}

// Available only for authorized user
export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const authorizationStatus = localStorage.getItem('authorizationStatus');
  const location = useLocation();
  const dispatch = useAppDispatch();

  if (authorizationStatus !== 'Authorized') {
    dispatch(setPathname(location.pathname));
    return <Navigate to="/login" replace />;
  }

  return children;
}
