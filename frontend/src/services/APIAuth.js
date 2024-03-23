import { API, urlPrefix } from "./config"

const tokenGenerateURL = urlPrefix + '/token/'
const tokenVerifyURL = urlPrefix + '/token/verify/'
const tokenRefreshURL = urlPrefix + '/token/refresh/'

const accSignUpURL = urlPrefix + '/v1.0/accounts/signup/'
const accConfirmURL = urlPrefix + '/v1.0/accounts/confirm/'
const accSignInURL = urlPrefix + '/v1.0/accounts/signin/'

export function authGenerate(login, password) {
    return API.post(tokenGenerateURL, { "username": login, "password": password })
}

export function authRefresh(tokenRefresh) {
    return API.post(tokenRefreshURL, { "refresh": tokenRefresh })
}

export function authVerify(token) {
    return API.post(tokenVerifyURL, { "token": token })

}

export function authSignUp(data) {
    return API.post(accSignUpURL, data)
}

export function authConfirm(username, token) {
    return API.post(accConfirmURL, {
        "username": username,
        "token": token
    })
}

export function authSignIn(token) {
    let headers = {
        'Content-Type': 'application/json'
    }
    if (token !== "") {
        headers['Authorization'] = 'Bearer ' + token
    }

    return API.get(accSignInURL, { headers })
}
