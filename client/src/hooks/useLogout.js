import axios from '@api/axiosClient';
import { useAuth } from '@hooks';

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({ username: undefined, accessToken: undefined });
    try {
      const res = await axios.post('/logout', undefined, { withCredentials: true });
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
