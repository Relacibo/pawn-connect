import { AppThunk } from "@root/root/types";
import { ERROR, SUCCESS } from "./actionEnum";

export function createError(message: string): AppThunk {
    return dispatch => {
        dispatch({
            type: ERROR,
            payload: {
                message
            }
        })
    }
}

export function createSuccess(message: string): AppThunk {
    return dispatch => {
        dispatch({
            type: SUCCESS,
            payload: {
                message
            }
        })
    }
}