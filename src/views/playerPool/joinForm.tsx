import React, { ChangeEvent } from "react";
import { useRouteMatch, Switch, Route } from "react-router";
import styles from "../main/style.css";
import { Link } from "react-router-dom";
import { ProgramState } from "@root/root/types";
import { connect, ConnectedProps } from "react-redux";

type State = {
  v: String
}

class JoinForm extends React.Component<Props, State, any> {
  render() {
    return (
      <form><input ></input><label>Test</label></form>
    );
  }
}

function mapStateToProps(state: ProgramState) {
  return {
  };
}

const actionCreators = {

};

const connector = connect(mapStateToProps, actionCreators);

type Props = ConnectedProps<typeof connector>;

export default connector(JoinForm);
