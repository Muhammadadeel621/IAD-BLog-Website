import { Link } from 'react-router-dom';

import axios from '@api/axiosClient';

import { useFetch, useAuth } from '@hooks';
import { PostList } from '@components';

import styles from './home.module.css';

function Index() {
  return (
    <main className='main'>
      <Hero />
      <AllPosts />
    </main>
  );
}

function Hero() {
  const { auth } = useAuth();

  return (
    <section className={[styles['hero']].join(' ')}>
      <div className={['wrapper', 'flex-between', styles['flex-between']].join(' ')}>
        <div className={styles['hero__content']}>
          <h1 className={styles['hero__title']}>DevBlogs</h1>
          <p className={styles['hero__subtitle']}>
            A platform for developers to share their knowledge and connect with other developers.
          </p>
          {auth.accessToken ? (
            <Link to='/dashboard' className='btn btn--primary'>
              Get Started
            </Link>
          ) : null}
        </div>
        <div className={styles['hero__image']}>
          <img src='assets/images/landing-page.svg' alt='hero image' />
        </div>
      </div>
    </section>
  );
}

function AllPosts() {
  const initialState = { posts: [] };
  const { data, isLoading, error } = useFetch(`/api/posts/static`, axios, initialState);

  return (
    <section className='py-200'>
      <div className='wrapper'>
        <h2 className='section-title'>Latest Posts</h2>
        <PostList data={data} isLoading={isLoading} error={error} />
      </div>
    </section>
  );
}

export default Index;
