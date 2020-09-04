import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { ProgramState } from '@root/root/types';

function Overlay(props: Props) {
    return (<div></div>);
}

function mapStateToProps(state: ProgramState) {
    return {
    };
}

const actionCreators = {
};

const connector = connect(mapStateToProps, actionCreators);

type Props = ConnectedProps<typeof connector>;

export default connector(Overlay);