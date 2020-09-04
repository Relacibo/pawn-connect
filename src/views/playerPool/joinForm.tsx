import React, { useState, FormEvent, ChangeEvent } from "react";
import { ProgramState } from "@root/root/types";
import { connect, ConnectedProps } from "react-redux";
import styles from './css/playerPool.css';
import { connectToPlayer } from '@modules/playerPool/actions';
import { useHistory } from "react-router";
import routes from '@root/routes.json'


function mapStateToProps(state: ProgramState) {
  return {

  };
}

const actionCreators = {
  connectToPlayer
};

const connector = connect(mapStateToProps, actionCreators);

type Props = ConnectedProps<typeof connector>;
const JoinForm = (props: Props) => {
  let [lichessId, setLichessId] = useState('')
  const history = useHistory();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setLichessId(event.target.value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await props.connectToPlayer(lichessId);
    history.push(routes.PLAYER_POOL);
  }

  return (
    <form onSubmit={handleSubmit} >
    <h4 style={{marginTop: '.5rem'}}>Join Player Pool</h4>
      <div>
        <label className={styles.label}>Lichess username</label>
        <input className={styles.input} value={lichessId} onChange={handleChange}></input>
      </div>
      <div>
        <input className={styles.submit} type="submit" value="Submit" />
      </div>
    </form >
  );
}

export default connector(JoinForm)
