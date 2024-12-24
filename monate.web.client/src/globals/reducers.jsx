import initialState from "./initialState";

export const SET_PASSWORD = 'SET_PASSWORD';
export const SET_LIGHT_MODE = 'SET_LIGHT_MODE';
export const SET_REGION = 'SET_REGION';
export const SET_STATE_ADDR = 'SET_STATE_ADDR';
export const SET_TOKEN = 'SET_TOKEN'
export const SET_EMAIL = 'SET_EMAIL';
export const SET_FIRST_NAME = 'SET_FIRST_NAME';
export const SET_LAST_NAME = 'SET_LAST_NAME';
export const SET_TITLE = 'SET_TITLE';
export const SET_AVATAR = 'SET_AVATAR';

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PASSWORD:
            return {
                ...state,
                password: action.payload,
            };
        case SET_LIGHT_MODE:
            return {
                ...state,
                lightMode: action.payload,
            };
        case SET_REGION:
            return {
                ...state,
                region: action.payload,
            };
        case SET_STATE_ADDR:
            return {
                ...state,
                stateAddr: action.payload,
            };
        case SET_TOKEN:
            return {
                ...state,
                token: action.payload,
            };
        case SET_EMAIL:
            return {
                ...state,
                email: action.payload,
            }
        case SET_FIRST_NAME:
            return {
                ...state,
                firstName: action.payload,
            };
        case SET_LAST_NAME:
            return {
                ...state,
                lastName: action.payload,
            };
        case SET_TITLE:
            return {
                ...state,
                title: action.payload,
            };
        case SET_AVATAR:
            return {
                ...state,
                avatar: action.payload,
            };
        default:
            return state;
    }
};

export const setPassword = (password) => ({
    type: SET_PASSWORD,
    payload: password,
});

export const setLightMode = (lightMode) => ({
    type: SET_LIGHT_MODE,
    payload: lightMode,
});

export const setRegion = (region) => ({
    type: SET_REGION,
    payload: region,
});

export const setStateAddr = (stateAddr) => ({
    type: SET_STATE_ADDR,
    payload: stateAddr,
});

export const setToken = (token) => ({
    type: SET_TOKEN,
    payload: token,
});

export const setEmail = (email) => ({
    type: SET_EMAIL,
    payload: email,
});

export const setFirstName = (firstName) => ({
    type: SET_FIRST_NAME,
    payload: firstName,
});

export const setLastName = (lastName) => ({
    type: SET_LAST_NAME,
    payload: lastName,
});

export const setTitle = (title) => ({
    type: SET_TITLE,
    payload: title,
});

export const setAvatar = (avatar) => ({
    type: SET_AVATAR,
    payload: avatar,
});

export default reducer;