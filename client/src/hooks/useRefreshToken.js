import axios from '@api/axiosClient';
import { useAuth } from '@hooks';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get('/refresh', {
      withCredentials: true,
    });

    setAuth((prev) => {
      // console.log(JSON.stringify(prev));
      // console.log(response.data.accessToken);
      return {
        ...prev,
        accessToken: response.data.accessToken,
        username: response.data.user.username,
      };
    });
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
