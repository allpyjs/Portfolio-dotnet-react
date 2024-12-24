import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import reducer from './reducers';

const encryptor = encryptTransform({
    secretKey: import.meta.env.VITE_ENCRYPTION_KEY,
    onError: (error) => {
        console.error('Encryption error:', error);
    },
});

const persistConfig = {
    key: 'root',
    storage,
    transforms: [encryptor],
}

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer);

export const persistor = persistStore(store);
export default store;
