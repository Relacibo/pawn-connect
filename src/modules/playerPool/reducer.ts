import { combineReducers } from 'redux';
import * as reducers from './subReducers';

const reducer = combineReducers(reducers);
export default reducer;
