/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../root/routes.json';
import SettingsForm, { Props } from './settingsForm';

/* https://redux.js.org/basics/usage-with-react */
/* https://goshakkk.name/on-forms-react/ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Settings = () => {
  return (
    <div data-tid="container">
      <Link className="back-link" to={routes.HOME}>
        Back
      </Link>
      <h2>Settings</h2>
      <SettingsForm />
    </div>
  );
};

export default Settings;
