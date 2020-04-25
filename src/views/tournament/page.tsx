import React from 'react';
import TournamentForm from './form';
import { Link } from 'react-router-dom';
import routes from '@root/routes.json';
import styles from './css/tournament.css';

const Tournament = () => {
  return (
    <div>
      <Link className="back-link" to={routes.HOME}>
        Back
      </Link>
      <div className={styles['tournament-form']}><TournamentForm /></div>
    </div>
  );
}
export default Tournament;
