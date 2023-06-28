import styles from './post-card.module.css';

function PostCardSkeleton() {
  return (
    <article className={styles['post']}>
      <div className={[styles['post-card'], styles['skeleton']].join(' ')}>
        <div className={[styles['post__cover'], 'pulse-animation'].join(' ')}></div>
        <div className={styles['post__content']}>
          <div className={[styles['post__meta'], 'pulse-animation'].join(' ')}></div>
          <h3 className={styles['post__title']}></h3>
          <p className={[styles['post__description'], 'pulse-animation'].join(' ')}></p>
          <p className={[styles['post__description'], 'pulse-animation'].join(' ')}></p>
          <p className={[styles['post__description'], 'pulse-animation'].join(' ')}></p>
        </div>
      </div>
    </article>
  );
}

export default PostCardSkeleton;
