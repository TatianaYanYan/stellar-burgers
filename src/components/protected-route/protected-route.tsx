import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { ROUTES } from '../../constants/routes';
import { ReactElement } from 'react';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: ReactElement;
  isRouteUnauthorized?: boolean;
};

export const ProtectedRoute = ({
  children,
  isRouteUnauthorized = false
}: ProtectedRouteProps) => {
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();

  // Ждем завершения проверки авторизации
  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (isRouteUnauthorized && user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  if (!isRouteUnauthorized && !user) {
    return (
      <Navigate to={`${ROUTES.LOGIN}?next=${location.pathname}`} replace />
    );
  }

  return children;
};
