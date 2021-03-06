import { Store as ReduxStore, Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import createRootReducer from './rootReducer';

export type ProgramState = ReturnType<ReturnType<typeof createRootReducer>>;

export type GetState = () => ProgramState;

export type Dispatch = ThunkDispatch<ProgramState, unknown, Action<string>>;

export type Store = ReduxStore<ProgramState, Action<string>>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  ProgramState,
  unknown,
  Action<string>
>;
