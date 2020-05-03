import React from 'react';
import PlayerPoolForm from './form';
import styles from './css/playerPool.css';
import Back from '../components/back';

const PlayerPool = () => {
  return (
    <div>
      <Back />
      <div className={styles['player-pool-form']}><PlayerPoolForm /></div>
    </div>
  );
}
export default PlayerPool;
