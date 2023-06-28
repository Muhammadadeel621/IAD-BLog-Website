import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '@hooks';

import axios from '@api/axiosClient';

import styles from './auth.module.css';

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.post('/auth', JSON.stringify({ user, pwd }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const {
        user: { username },
        accessToken,
      } = response.data;

      setAuth({ username, accessToken });
      setUser('');
      setPwd('');
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response?.data) setErrMsg(err.response.data.message);
      else if (!err.response) setErrMsg('No Server Response');
      else setErrMsg('Login Failed');

      errRef.current.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem('persist', persist);
  }, [persist]);

  const disabled = isLoading || !user || !pwd;

  return (
    <main className='main'>
      <div className='wrapper'>
        <section className={styles['auth-screen-section']}>
          <p ref={errRef} className={styles[errMsg ? 'errmsg' : 'offscreen']} aria-live='assertive'>
            {errMsg}
          </p>
          <h1>Sign In</h1>
          <form className={styles['auth-form']} onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='username'>Username:</label>
              <input
                type='text'
                id='username'
                ref={userRef}
                autoComplete='off'
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password:</label>
              <input type='password' id='password' onChange={(e) => setPwd(e.target.value)} value={pwd} required />
            </div>
            <button className='btn btn--primary' disabled={disabled}>
              Sign In
            </button>
            <div className={styles['persistCheck']}>
              <input type='checkbox' id='persist' onChange={togglePersist} checked={persist} />
              <label htmlFor='persist'>Trust This Device</label>
            </div>
          </form>
          <p>
            Need an Account?
            <br />
            <span className={styles['line']}>
              <Link to='/register'>Sign Up</Link>
            </span>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Login;
