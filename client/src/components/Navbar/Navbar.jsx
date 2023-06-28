import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useAuth, useLogout } from '@hooks';

import styles from './navbar.module.css';

export default function Header() {
  const [showNav, setShowNav] = useState(false);
  const navRef = useRef(null);
  const { auth } = useAuth();

  const logout = useLogout();

  const handleLogout = async () => {
    await logout();
  };

  const handleHambugerClick = () => {
    setShowNav((prevState) => !prevState);
  };

  const handleNavLinkClick = () => {
    setShowNav(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowNav(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className={styles['primary-nav']}>
      <div className='wrapper'>
        <div className={styles['flex-between']}>
          <Link to='/' className={styles['logo']}>
            DevBlogs
            <img src='/assets/images/logo.svg' alt='logo' />
          </Link>

          <Hamburger showNav={showNav} handleHambugerClick={handleHambugerClick} />

          <ul className={styles['nav__items']} ref={navRef} aria-hidden={!showNav}>
            <li className={styles['nav__item']}>
              <Link to='/posts' className={styles['nav__link']} onClick={handleNavLinkClick}>
                All Posts
              </Link>
            </li>
            {auth.accessToken && (
              <>
                <li className={styles['nav__item']}>
                  <Link to='/posts/create' className={styles['nav__link']} onClick={handleNavLinkClick}>
                    Create Post
                  </Link>
                </li>
                <li className={styles['nav__item']}>
                  <Link to='/dashboard' className={styles['nav__link']} onClick={handleNavLinkClick}>
                    Dashboard
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className={[styles['nav-ctas'], 'flex-between'].join(' ')}>
            {auth.accessToken ? (
              <li>
                <button className='btn' onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to='/login' className='btn'>
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function Hamburger({ showNav, handleHambugerClick }) {
  return (
    <button className={styles['hamburger']} onClick={handleHambugerClick} aria-expanded={showNav}>
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
}
