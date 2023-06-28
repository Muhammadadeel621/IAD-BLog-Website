import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-hot-toast';

import { useFetch, useAuth, useAxiosPrivate } from '@hooks';
import axios from '@api/axiosClient';

import styles from './single-post-page.module.css';

function SinglePostPage() {
  const [isFetching, setIsFetching] = useState(false);
  const { id } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const initialState = { post: null };

  const { data, error, isLoading } = useFetch(`/api/posts/${id}`, axios, initialState);

  // determine if the current user is the author of the post
  const isAuthor = data?.post?.author.username === auth.username;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      setIsFetching(true);
      const res = await axiosPrivate.delete(`/posts/${id}`);
      toast.success(res.data.message);
      navigate('/');
    } catch (err) {
      // check if the error is a response from the server
      if (err.response) return toast.error(err.response.data.message);

      // check if the error is a network error
      if (err.request) return toast.error('Network error. Please try again later.');

      // check if the error is anything else
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsFetching(false);
    }
  };

  const content = isLoading ? (
    <PostCardSkeleton />
  ) : error ? (
    <p>{error}</p>
  ) : data.post ? (
    <PostCard post={data.post} isAuthor={isAuthor} handleDelete={handleDelete} isFetching={isFetching} />
  ) : (
    <p>Post not found</p>
  );

  return (
    <main className='main'>
      <div className='wrapper'>{content}</div>
    </main>
  );
}

function PostCard({ post, isAuthor, handleDelete, isFetching }) {
  const createdAt = new Date(post.createdAt);
  const updatedAt = new Date(post.updatedAt);

  const isUpdated = updatedAt > createdAt;

  const formattedDate = (isUpdated ? updatedAt : createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const imagePath = post.cover ? `${import.meta.env.VITE_BACKEND_URL}${post.cover}` : '/assets/images/logo-dark.svg';

  return (
    <section className={styles['post']}>
      <div className={styles['post__cover']}>
        <img src={imagePath} alt='' />
      </div>
      <div className={styles['post__content']}>
        <div className={styles['post__meta']}>
          <Link to={`/users/${post.author.username}/posts`} className={styles['post__author-name']}>
            By {post.author.username}
          </Link>
          <time className={styles['post__date']} dateTime={isUpdated ? updatedAt : createdAt}>
            {isUpdated ? 'Updated on ' : 'Posted on '} {formattedDate}
          </time>
        </div>
        <h3 className={styles['post__title']}>{post.title}</h3>
        <div className={styles['post__dumped-data']} dangerouslySetInnerHTML={{ __html: post.content }} />
        {isAuthor ? (
          <div className={styles['post__actions']}>
            <Link to={`/posts/${post._id}/edit`} className={[styles['post__edit'], 'btn'].join(' ')}>
              Edit
              <FontAwesomeIcon icon={faEdit} />
            </Link>
            <button
              className={[styles['post__delete'], 'btn', 'btn--danger'].join(' ')}
              onClick={handleDelete}
              disabled={isFetching}
            >
              Delete
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function PostCardSkeleton() {
  return (
    <section className={[styles['post'], styles['skeleton']].join(' ')}>
      <div className={[styles['post__cover'], 'pulse-animation'].join(' ')}></div>
      <div className={[styles['post__content']].join(' ')}>
        <div className={[styles['post__meta'], 'pulse-animation'].join(' ')}></div>
        <h3 className={[styles['post__title'], 'pulse-animation'].join(' ')}></h3>
        <h3 className={[styles['post__title'], 'pulse-animation'].join(' ')} style={{ '--_width': '60%' }}></h3>
        <div className={[styles['post__dumped-data'], 'pulse-animation'].join(' ')}></div>
        <div className={[styles['post__dumped-data'], 'pulse-animation'].join(' ')}></div>
        <div className={[styles['post__dumped-data'], 'pulse-animation'].join(' ')}></div>
        <div className={[styles['post__dumped-data'], 'pulse-animation'].join(' ')} style={{ '--_width': '80%' }}></div>
      </div>
    </section>
  );
}

export default SinglePostPage;
