/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Link } from 'react-router-dom';
import routes from '@root/routes.json';
import styles from './style.css';
import LichessLogin from '../lichess/component'

const Home = () => {
  return (
    <div className={styles.container} data-tid="container">
      <LichessLogin />
      <h2>Home</h2>
      <div>
        <div>
          <Link to={routes.SETTINGS}>Settings</Link>
        </div>
        <div>
          <Link to={routes.PEER_CONNECTION_TEST}>Peer</Link>
        </div>
        <div>
          <Link to={routes.TOURNAMENT}>Tournament</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
