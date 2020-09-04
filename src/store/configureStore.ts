import configureStoreDev from './configureStore.dev';
import configureStoreProd from './configureStore.prod';
import initializeLichessState from '@root/modules/lichess/initializeState';

const selectedConfigureStore =
  process.env.NODE_ENV === 'production'
    ? configureStoreProd
    : configureStoreDev;
const initialState = {
  lichess: initializeLichessState()
}

const { history, configureStore: configureStoreWithoutInit } = selectedConfigureStore;
const configureStore = () => configureStoreWithoutInit(initialState as any)
export { history, configureStore };
 
