import { API, urlPrefix } from "./config"

const tokenGenerateURL = urlPrefix + '/token/'
const tokenVerifyURL = urlPrefix + '/token/verify/'
const tokenRefreshURL = urlPrefix + '/token/refresh/'

export function authGenerate(login, password) {
    return API.post(tokenGenerateURL, { username: login, password: password })
}

export function authRefresh(tokenRefresh) {
    return API.post(tokenRefreshURL, { "refresh": tokenRefresh })
}

export function authVerify(token) {
    return API.post(tokenVerifyURL, { "token": token })

}


