import { API, urlPrefix } from "./config"

// class TokenExpiredError extends Error {
//     constructor(message) {
//         super(message);
//         this.name = this.constructor.name;
//         if (typeof Error.captureStackTrace === 'function') {
//             Error.captureStackTrace(this, this.constructor);
//         } else {
//             this.stack = (new Error(message)).stack;
//         }
//     }
// }

export const API_LIST = {
    publicNews: "/v1.0/public/news/",
    staffNewsPosts: "/v1.0/staff/news/posts/",
    staffNewsTags: "/v1.0/staff/news/tags/",
    commonGenders: "/v1.0/common/genders/",
    commonCities: "/v1.0/common/cities/",
    employeeProfile: "/v1.0/employee/profile/",
}

function getHeader(token) {
    let headers = {
        'Content-Type': 'application/json'
    }
    if (token !== "") {
        headers['Authorization'] = 'Bearer ' + token
    }
    return headers
}

export function dataGetList(api, token, params) {
    const headers = getHeader(token)
    const url = urlPrefix + API_LIST[api]

    return API.get(url, { headers: headers, params: params })
}

export function dataGetOne(api, token, id) {
    let headers = getHeader(token)
    let url = urlPrefix + API_LIST[api] + id + "/"

    return API.get(url, { headers })
}

export function dataPostOne(api, token, data) {
    let headers = getHeader(token)
    let url = urlPrefix + API_LIST[api]

    return API.post(url, data, { headers })
}

export function dataPutOne(api, token, id, data) {
    let headers = getHeader(token)
    let url = urlPrefix + API_LIST[api] + id + "/"

    return API.put(url, data, { headers })
}

export function dataDeleteOne(api, token, id) {
    let headers = getHeader(token)
    let url = urlPrefix + API_LIST[api] + id + "/"

    return API.delete(url, { headers })
}

