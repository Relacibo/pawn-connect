import React from "react";
import { useRouteMatch, Switch, Route } from "react-router";
import styles from "../main/style.css";
import { Link } from "react-router-dom";
import { ProgramState } from "@root/root/types";
import { connect, ConnectedProps } from "react-redux";

type State = {

}

class HostForm extends React.Component<Props, State, any> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <form><input></input></form>
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

export default connector(HostForm);
