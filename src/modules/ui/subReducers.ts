import { Action } from 'redux';
import { List } from 'immutable';
import { ERROR, SUCCESS } from '../actionEnum';
import { REMOVE_UI_MESSAGES } from './enums/actions';

export function messages(state: List<UIMessage> = List(), action: Action<string>): List<UIMessage> {
    switch (action.type) {
        case ERROR: {
            const { message } = (action as any).payload
            return state.push({type: 'error', message})
        }
        case SUCCESS: {
            const { message } = (action as any).payload
            return state.push({type: 'success', message})
        }
        case REMOVE_UI_MESSAGES: {
            return List();
        }
        default:
            return state;
    }
}