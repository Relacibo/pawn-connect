import { get } from 'local-storage';
import OAuth from './types/OAuth';

export default function initializeState() {
    return { oauth: get<OAuth>('lichess_state') };
}