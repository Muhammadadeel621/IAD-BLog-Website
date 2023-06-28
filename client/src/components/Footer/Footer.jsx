import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles['footer']}>
      <div className='wrapper'>
        <div className={[styles['footer-content'], styles['flex-between'], 'flex-between'].join(' ')}>
          <Link to='/' className={styles['footer-logo']}>
            DevBlogs
          </Link>
          <ul className={styles['footer-social']}>
            <li className={styles['footer-social__item']}>
              <a href='#' className={styles['footer-social__link']}>
                <FontAwesomeIcon icon={faFacebook} />
              </a>
            </li>
            <li className={styles['footer-social__item']}>
              <a href='#' className={styles['footer-social__link']}>
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </li>
            <li className={styles['footer-social__item']}>
              <a href='#' className={styles['footer-social__link']}>
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </li>
            <li className={styles['footer-social__item']}>
              <a href='#' className={styles['footer-social__link']}>
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </li>
          </ul>
        </div>
        <p className={styles['footer-bottom']}>&copy; 2023 DevBlogs. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
