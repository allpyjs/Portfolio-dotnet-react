//import { useEffect } from 'react';
//import { useDispatch } from 'react-redux';
//import {
//    setPassword,
//    setLightMode,
//    setRegion,
//    setStateAddr,
//    setToken,
//    setEmail,
//    setFirstName,
//    setLastName,
//    setTitle,
//    setAvatar,
//} from './reducers';

//const useStorageHooks = () => {
//    const dispatch = useDispatch();

//    const parseStr = (str) => {
//        return str === 'null' ? null : str.slice(1, -1);
//    }

//    const parseBoolean = (str) => {
//        return str === 'true' ? true : false;
//    }

//    useEffect(() => {
//        const handleStorageChange = (event) => {
//            if (event.key === 'persist:root') {
//                try {
//                    const persistedState = JSON.parse(event.newValue);

//                    if (persistedState == null)
//                        return;

//                    const newPassword = parseStr(persistedState.password);
//                    const newLightMode = parseBoolean(persistedState.lightMode);
//                    const newRegion = parseStr(persistedState.region);
//                    const newStateAddr = parseStr(persistedState.stateAddr);
//                    const newToken = parseStr(persistedState.token);
//                    const newEmail = parseStr(persistedState.email);
//                    const newFirstName = parseStr(persistedState.firstName);
//                    const newLastName = parseStr(persistedState.lastName);
//                    const newTitle = parseStr(persistedState.title);
//                    const newAvatar = parseStr(persistedState.avatar);

//                    if (newPassword) {
//                        dispatch(setPassword(newPassword));
//                    }
//                    if (newLightMode) {
//                        dispatch(setLightMode(newLightMode));
//                    }
//                    if (newRegion) {
//                        dispatch(setRegion(newRegion));
//                    }
//                    if (newStateAddr) {
//                        dispatch(setStateAddr(newStateAddr));
//                    }
//                    if (newToken) {
//                        dispatch(setToken(newToken));
//                    }
//                    if (newEmail) {
//                        dispatch(setEmail(newEmail));
//                    }
//                    if (newFirstName) {
//                        dispatch(setFirstName(newFirstName));
//                    }
//                    if (newLastName) {
//                        dispatch(setLastName(newLastName));
//                    }
//                    if (newTitle) {
//                        dispatch(setTitle(newTitle));
//                    }
//                    if (newAvatar) {
//                        dispatch(setAvatar(newAvatar));
//                    }
//                } catch (error) {
//                    console.error('Error while decrypting state:', error);
//                }
//            }
//        };

//        window.addEventListener('storage', handleStorageChange);

//        return () => {
//            console.log("removed");
//            window.removeEventListener('storage', handleStorageChange);
//        };
//    }, [dispatch]);
//};

//export default useStorageHooks;
