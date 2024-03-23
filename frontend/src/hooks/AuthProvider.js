import React from 'react'
import { useContext, createContext } from "react";
// import { useNavigate } from "react-router-dom";

import Cookies from 'universal-cookie';

import { authConfirm, authGenerate, authRefresh, authSignIn, authSignUp } from '../services/APIAuth.js'
import AppPaths from '../routes/AppPaths.js';


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

export const userRoles = {
    employer: "employer",
    employee: "employee",
    moderator: "moderator",
}

const initialState = {
    isAuthenticated: false,
    user: {
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        isValidated: false,
    },
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
            .then(() => this.loadUser())
        console.log("mounted AuthProvider")
    }

    async logIn(login, password) {
        // if (this._isAuthenticated) { this.logout() }
        console.log("login step 1")
        const res = await this.generateToken(login, password) && this.loadUser()
        return res
    }

    async logOut() {
        this._tokenAccess = ""
        AuthCookies.set(authCookieName, { token: "" }, cookieSetOptions)
        AuthCookies.remove(authCookieName, cookieSetOptions)
        this.setState(initialState)
        console.log("Logout successful")
    }

    getAccessToken() {
        return this._tokenAccess
    }

    getPersonalPath() {
        if (this.state.isAuthenticated) {
            if (this.state.user?.isValidated) {
                const role = this.state.user?.role
                if (role === userRoles.employee) {
                    return AppPaths.employee.home
                } else if (role === userRoles.employer) {
                    return AppPaths.employer.home
                } else if (role === userRoles.moderator) {
                    return AppPaths.moderator.home
                }
            }
            return AppPaths.confirm + "?username=" + this.state.user?.username
        }
        return AppPaths.signin
    }

    async loadUser() {
        if (this._tokenAccess !== "") {
            try {
                console.log("load user data")
                const response = await authSignIn(this._tokenAccess)

                if (response.data) {
                    const user = response.data[0]
                    this.setState({
                        isAuthenticated: true,
                        user: {
                            username: user?.username ?? "",
                            firstName: user?.first_name ?? "",
                            lastName: user?.last_name ?? "",
                            email: user?.email ?? "",
                            role: user?.role ?? "",
                            isValidated: user?.is_validated ?? false
                        }
                    })
                    return true
                }
            }
            catch (err) {
                console.log('Login error', err);
                this.logOut()
            }
        }

        this.setState(initialState)
        return false
    }

    async generateToken(login, password) {

        try {
            console.log("sending login response")
            const response = await authGenerate(login, password)

            if (response.data.access) {
                this._tokenAccess = response.data.access
                console.log("Login successful")
                AuthCookies.set(authCookieName, { token: response.data.refresh }, cookieSetOptions)
                return true
            }
        }
        catch (err) {
            console.log('Login error', err);
            this._tokenAccess = ""
        }
        return false
    }

    async refreshToken() {
        let cookieData = AuthCookies.get(authCookieName, cookieSetOptions)

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
                } else {
                    console.log("token is undefined or incorrect")
                    this._tokenAccess = response.data.access = ""
                    AuthCookies.remove(authCookieName)
                }
            }
            catch (err) {
                console.log(err)
                this._tokenAccess = ""
                AuthCookies.remove(authCookieName)
            }
        }
    }

    render() {
        return (
            <AuthContext.Provider value={{
                isAuthenticated: this.state.isAuthenticated,
                user: this.state.user,
                tokenFunc: this.getAccessToken.bind(this),
                logInFunc: this.logIn.bind(this),
                logOutFunc: this.logOut.bind(this),
                tokenRefreshFunc: this.refreshToken.bind(this),
                userRefreshFunc: this.loadUser.bind(this),
                personalPathFunc: this.getPersonalPath.bind(this)
            }}>
                {/* {this.isAuthenticated} */}
                {this.children}
            </AuthContext.Provider>
        )
    }
};

export const accountCreate = async (data) => {
    try {
        console.log("sign up")
        const response = await authSignUp(data)
        console.log(response)

        if (response.status === 201) {
            return { data: response.data, error: null }
        } else {
            console.log(response)
            return { data: response.data, error: response.statusText }
        }
    }
    catch (error) {
        console.log('SignUp error', error);
        return { data: error?.response?.data ?? null, error: error.message }
    }
}

export const accountConfirm = async (username, token) => {
    try {
        console.log("account confirmation")
        const response = await authConfirm(username, token)
        console.log(response)

        if (response.status === 201) {
            return { data: response.data, error: null }
        } else {
            console.log(response)
            return { data: response.data, error: response.statusText }
        }
    }
    catch (error) {
        console.log('SignUp error', error);
        return { data: null, error: error.message }
    }

}

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
