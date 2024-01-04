/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from "react";
import { PropTypes } from 'prop-types';

const AuthContext = createContext();

const initialState = {
    user: null,
    isAuthenticated: false
}

const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'login':
            return {
                ...state,
                user: action.playload,
                isAuthenticated: true
            }
        case 'logout':
            return {
                ...state,
                user: null,
                isAuthenticated: false
            }

        default: throw new Error('unknown action ! | Auth Reducer');
    }
}

const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthProvider = ({ children }) => {
    const [{ user, isAuthenticated }, dispatch] = useReducer(AuthReducer, initialState);

    const login = (e, email, password) => {
        e.preventDefault();
        if (email === FAKE_USER.email && password === FAKE_USER.password)
            dispatch({
                type: 'login',
                playload: FAKE_USER
            })
    }

    const logout = () => {
        dispatch({ type: 'logout' })
    }


    return <AuthContext.Provider value={{
        user,
        isAuthenticated,
        login,
        logout
    }}>
        {children}
    </AuthContext.Provider>
}

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('Your using AuthContext out of it is scope !!!');
    return context;
}

AuthProvider.PropTypes = {
    children: PropTypes.any
};

export { useAuth, AuthProvider };