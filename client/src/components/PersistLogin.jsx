import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useRefreshToken, useAuth } from '@hooks';
import { Spinner } from '@components';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  // Logs for debugging
  // useEffect(() => {
  //   console.log(`isLoading: ${isLoading}`);
  //   console.log(`AccessToken: ${JSON.stringify(auth?.accessToken)}`);
  // }, [isLoading]);

  return !persist ? <Outlet /> : isLoading ? <Spinner /> : <Outlet />;
};

export default PersistLogin;
