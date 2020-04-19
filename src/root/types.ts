import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import createRootReducer from './rootReducer';

export type ProgramState = ReturnType<ReturnType<typeof createRootReducer>>;

export type GetState = () => ProgramState;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<ProgramState, Action<string>>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  ProgramState,
  unknown,
  Action<string>
>;
