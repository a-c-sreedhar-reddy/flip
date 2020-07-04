import {createStore} from 'redux';
import rootReducer from './RootReducer';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

const persistConfig = {
  key: 'root',
  whitelist: ['game'],
  storage: AsyncStorage,
};
const pReducer = persistReducer(persistConfig, rootReducer());
let store = createStore(pReducer);
persistStore(store);
store.subscribe(() => {});

export {store};
