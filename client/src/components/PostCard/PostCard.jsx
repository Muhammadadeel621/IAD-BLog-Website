import { Link } from 'react-router-dom';
import styles from './post-card.module.css';

function PostCard({ post }) {
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
    <article className={styles['post']}>
      <div className={styles['post-card']}>
        <div className={styles['post__cover']}>
          <img src={imagePath} alt='' />
        </div>
        <div className={styles['post__content']}>
          <div className={styles['post__meta']}>
            <Link to={`/users/${post.author.username}/posts`} className={styles['post__author-name']}>
              By {post.author.username}
            </Link>
            <time className={styles['post__date']} dateTime={isUpdated ? updatedAt : createdAt}>
              {formattedDate}
            </time>
          </div>
          <h3 className={styles['post__title']}>{post.title}</h3>
          <p className={styles['post__description']}>
            {post.summary.length > 100 ? post.summary.slice(0, 150) + '...' : post.summary}
          </p>
          <Link to={`/posts/${post._id}`} className='btn btn--primary'>
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
