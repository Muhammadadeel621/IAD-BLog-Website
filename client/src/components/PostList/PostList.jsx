import { PostCard, PostCardSkeleton, Error } from '@components';

import styles from './post-list.module.css';

function PostList({ isLoading, error, data }) {
  if (error) return <Error message={error} />;

  return (
    <section className={styles['posts']}>
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
      ) : data.posts?.length === 0 ? (
        <Error message='No posts found' image='no-data.svg' />
      ) : (
        data.posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </section>
  );
}

export default PostList;
