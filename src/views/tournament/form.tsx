import React from 'react';
import styles from './css/tournament.css'

const TournamentForm = () => {
  return (
    <div className={styles['button-group']}>
      <div className={styles.button}>Connect to Tournament</div>
      <div className={styles.button}>Host Tournament</div>
    </div>
  );
}

export default TournamentForm;
