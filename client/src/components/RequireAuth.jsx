import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@hooks';

const RequireAuth = ({ shouldBeAuthenticated }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return shouldBeAuthenticated ? (
    auth.accessToken ? (
      <Outlet />
    ) : (
      <Navigate to='/login' state={{ from: location }} replace />
    )
  ) : !auth.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to='/' state={{ from: location }} replace />
  );
};

export default RequireAuth;
