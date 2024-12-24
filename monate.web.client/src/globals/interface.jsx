import { useDispatch, useSelector } from 'react-redux';

import {
    setPassword,
    setLightMode,
    setRegion,
    setStateAddr,
    setToken,
    setEmail,
    setFirstName,
    setLastName,
    setTitle,
    setAvatar,
} from './reducers';

export const useSavePassword = () => {
    const dispatch = useDispatch();
    return (password) => dispatch(setPassword(password));
};

export const useSaveLightMode = () => {
    const dispatch = useDispatch();
    return (lightMode) => dispatch(setLightMode(lightMode));
};

export const useSaveRegion = () => {
    const dispatch = useDispatch();
    return (region) => dispatch(setRegion(region));
};

export const useSaveStateAddr = () => {
    const dispatch = useDispatch();
    return (stateAddr) => dispatch(setStateAddr(stateAddr));
};

export const useSaveToken = () => {
    const dispatch = useDispatch();
    return (token) => dispatch(setToken(token));
};

export const useSaveEmail = () => {
    const dispatch = useDispatch();
    return (email) => dispatch(setEmail(email));
};

export const useSaveFirstName = () => {
    const dispatch = useDispatch();
    return (firstName) => dispatch(setFirstName(firstName));
};

export const useSaveLastName = () => {
    const dispatch = useDispatch();
    return (lastName) => dispatch(setLastName(lastName));
};

export const useSaveTitle = () => {
    const dispatch = useDispatch();
    return (title) => dispatch(setTitle(title));
};

export const useSaveAvatar = () => {
    const dispatch = useDispatch();
    return (avatar) => dispatch(setAvatar(avatar));
};

export const usePassword = () => {
    return useSelector((state) => state.password);
};

export const useLightMode = () => {
    return useSelector((state) => state.lightMode);
};

export const useRegion = () => {
    return useSelector((state) => state.region);
};

export const useStateAddr = () => {
    return useSelector((state) => state.stateAddr);
};

export const useToken = () => {
    return useSelector((state) => state.token);
};

export const useEmail = () => {
    return useSelector((state) => state.email);
};

export const useFirstName = () => {
    return useSelector((state) => state.firstName);
};

export const useLastName = () => {
    return useSelector((state) => state.lastName);
};

export const useTitle = () => {
    return useSelector((state) => state.title);
};

export const useAvatar = () => {
    return useSelector((state) => state.avatar);
};