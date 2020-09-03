/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */

/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ProgramState } from '../../root/types';
import { settingsStoreValue } from '../../modules/settings/actions';
import { LICHESS_TOKEN } from '../../modules/settings/enums/configKeys';

const SettingsForm = (props: Props) => {
  let [config, setConfig] = useState(props.config);


  const storeValue = (key: string, value: any) => {
    props.settingsStoreValue({
      key,
      value
    });
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    storeValue(target.id, target.value);
    e.preventDefault();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter': {
        const target = e.target as HTMLInputElement;
        storeValue(e.key, target.value);
        e.preventDefault();
        break;
      }
      default:
        break;
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setConfig(config.set(target.id, target.value))
  };
  const [className, setClassName] = useState('')
  return (
    <form className={className}>
      <label htmlFor={LICHESS_TOKEN}>
        Lichess Auth Token:
          <input
          id={LICHESS_TOKEN}
          type="text"
          onBlur={onBlur}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={config.get(LICHESS_TOKEN) || ''}
        />
      </label>
    </form>
  );
}

function mapStateToProps(state: ProgramState) {
  return {
    config: state.settings.config
  };
}

const actionCreators = {
  settingsStoreValue
};

const connector = connect(mapStateToProps, actionCreators);
export type Props = ConnectedProps<typeof connector>;
export default connector(SettingsForm);
