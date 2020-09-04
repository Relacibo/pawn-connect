import { AppThunk } from "@root/root/types";
import { REMOVE_UI_MESSAGES } from "./enums/actions";

export function removeUIMessages(): AppThunk {
    return dispatch => {
        dispatch({
            type: REMOVE_UI_MESSAGES
        })
    }
}