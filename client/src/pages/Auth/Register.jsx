import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import axios from '@api/axiosClient';

import styles from './auth.module.css';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{6,24}$/;

export default function RegisterPage() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg('Invalid Entry');
      return;
    }

    try {
      const response = await axios.post('/register', JSON.stringify({ user, pwd }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      setSuccess(true);
      //clear state and controlled inputs
      setUser('');
      setPwd('');
      setMatchPwd('');
    } catch (err) {
      if (!err.response) return setErrMsg('No Server Response');
      if (!err.response.data) return setErrMsg('Registration Failed');
      if (err.response.data.message) return setErrMsg(err.response.data.message);
      if (err.response.status === 400) return setErrMsg('Invalid Entry');
      if (err.response.status === 409) return setErrMsg('Username already exists');
      errRef.current.focus();
    }
  };

  return (
    <main className='main'>
      <div className='wrapper'>
        {success ? (
          <section className={styles['auth-screen-section']}>
            <h1>Success!</h1>
            <p>
              <Link to='/login'>Login</Link>
            </p>
          </section>
        ) : (
          <section className={styles['auth-screen-section']}>
            <p ref={errRef} className={styles[errMsg ? 'errmsg' : 'offscreen']} aria-live='assertive'>
              {errMsg}
            </p>
            <h1>Register</h1>
            <form onSubmit={handleSubmit} className={styles['auth-form']}>
              <div className='form-group'>
                <label htmlFor='username'>
                  Username:
                  <FontAwesomeIcon icon={faCheck} className={styles[validName ? 'valid' : 'hide']} />
                  <FontAwesomeIcon icon={faTimes} className={styles[validName || !user ? 'hide' : 'invalid']} />
                </label>
                <input
                  type='text'
                  id='username'
                  ref={userRef}
                  autoComplete='off'
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                  aria-invalid={validName ? 'false' : 'true'}
                  aria-describedby='uidnote'
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                />
                <p id='uidnote' className={styles[userFocus && user && !validName ? 'instructions' : 'offscreen']}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  4 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </div>

              <div className='form-group'>
                <label htmlFor='password'>
                  Password:
                  <FontAwesomeIcon icon={faCheck} className={styles[validPwd ? 'valid' : 'hide']} />
                  <FontAwesomeIcon icon={faTimes} className={styles[validPwd || !pwd ? 'hide' : 'invalid']} />
                </label>
                <input
                  type='password'
                  id='password'
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  aria-invalid={validPwd ? 'false' : 'true'}
                  aria-describedby='pwdnote'
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
                <p id='pwdnote' className={styles[pwdFocus && !validPwd ? 'instructions' : 'offscreen']}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  8 to 24 characters.
                  <br />
                  Must include uppercase and lowercase letters, a number and a special character.
                  <br />
                  Allowed special characters: <span aria-label='exclamation mark'>!</span>{' '}
                  <span aria-label='at symbol'>@</span> <span aria-label='hashtag'>#</span>{' '}
                  <span aria-label='dollar sign'>$</span> <span aria-label='percent'>%</span>
                </p>
              </div>

              <div className='form-group'>
                <label htmlFor='confirm_pwd'>
                  Confirm Password:
                  <FontAwesomeIcon icon={faCheck} className={styles[validMatch && matchPwd ? 'valid' : 'hide']} />
                  <FontAwesomeIcon icon={faTimes} className={styles[validMatch || !matchPwd ? 'hide' : 'invalid']} />
                </label>
                <input
                  type='password'
                  id='confirm_pwd'
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  aria-invalid={validMatch ? 'false' : 'true'}
                  aria-describedby='confirmnote'
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                />
                <p id='confirmnote' className={styles[matchFocus && !validMatch ? 'instructions' : 'offscreen']}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must match the first password input field.
                </p>
              </div>

              <button className='btn btn--primary' disabled={!validName || !validPwd || !validMatch ? true : false}>
                Sign Up
              </button>
            </form>
            <p>
              Already registered?
              <br />
              <span className={styles['line']}>
                <Link to='/login'>Sign In</Link>
              </span>
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
