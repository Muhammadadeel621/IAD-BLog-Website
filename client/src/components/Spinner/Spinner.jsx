import styles from './spinner.module.css';

function Spinner() {
  return (
    <main className='main'>
      <div className={styles['loader']}></div>
      <div className={styles['loader2']}></div>
      <div className={styles['loader3']}></div>
    </main>
  );
}

export default Spinner;
