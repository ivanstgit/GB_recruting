import React from 'react'
import { useContext, createContext } from "react";
// import { useNavigate } from "react-router-dom";

import Cookies from 'universal-cookie';

import { authGenerate, authRefresh } from '../services/APIAuth.js'

export const AuthContext = createContext();
const AuthCookies = new Cookies()

const authCookieName = 'auth'

const cookieSetOptions = {
    path: '/',
    maxAge: 60 * 60,
    // secure: true,
    // httpOnly: true,
    sameSite: 'lax'
}

const initialState = {
    isAuthenticated: false,
    login: ""
}

class AuthProvider extends React.Component {
    //keeping auth data in state, maneges cookies, provides auth data
    constructor(props) {
        super(props)
        this.children = props.children
        this._tokenAccess = ""
        this.state = initialState
    }

    componentDidMount() {
        console.log("mounting AuthProvider")
        this.refreshToken()
        console.log("mounted AuthProvider")
    }

    async logIn(login, password) {
        // if (this._isAuthenticated) { this.logout() }

        try {
            console.log("sending login response")
            const response = await authGenerate(login, password)

            if (response.data.access) {
                this._tokenAccess = response.data.access
                console.log("Login successful")
                AuthCookies.set(authCookieName, { login: login, token: response.data.refresh }, cookieSetOptions)
                this.setState({
                    isAuthenticated: true,
                    login: login
                })
                return true
            }
        }
        catch (err) {
            console.log('Login error', err);
            this.logOut()
            return false
        }
    }

    async logOut() {
        this._tokenAccess = ""
        AuthCookies.remove(authCookieName)
        this.setState(initialState)
        console.log("Logout successful")
    }

    getAccessToken() {
        return this._tokenAccess
    }

    async refreshToken() {
        let cookieData = AuthCookies.get(authCookieName)

        if (cookieData === undefined || cookieData === "undefined") {
            console.log("no cookie found")
        } else {
            console.log("refreshing token with " + cookieData.token)
            try {
                let response = await authRefresh(cookieData.token)
                if (response.data.access) {
                    this._tokenAccess = response.data.access
                    if (response.data.refresh) {
                        cookieData.token = response.data.refresh
                    }
                    AuthCookies.set(authCookieName, JSON.stringify(cookieData), cookieSetOptions)
                    console.log("refreshed")
                    this.setState({ login: cookieData.login, isAuthenticated: true })
                } else {
                    console.log("token is undefined or incorrect")
                    this._tokenAccess = response.data.access = ""
                    AuthCookies.remove(authCookieName)
                    this.setState(initialState)
                }
            }
            catch (err) {
                console.log(err)
                this._tokenAccess = ""
                AuthCookies.remove(authCookieName)
                this.setState(initialState)
            }
        }
    }

    render() {
        return (
            <AuthContext.Provider value={{
                isAuthenticated: this.state.isAuthenticated,
                login: this.state.login,
                tokenFunc: this.getAccessToken.bind(this),
                logInFunc: this.logIn.bind(this),
                logOutFunc: this.logOut.bind(this),
                tokenRefreshFunc: this.refreshToken.bind(this)
            }}>
                {/* {this.isAuthenticated} */}
                {this.children}
            </AuthContext.Provider>
        )
    }
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};

