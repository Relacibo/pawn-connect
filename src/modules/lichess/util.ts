

import { get, set, remove } from 'local-storage';
import axios from 'axios';
const lichessBaseURL = 'https://lichess.org';
export async function authorizedLichessAPICall(
    path: string,
    method: 'post' | 'get',
    accessToken: string,
    params?: any
) {
    const response = await axios(path, {
        method,
        baseURL: lichessBaseURL,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        params
    });
    return response;
}
