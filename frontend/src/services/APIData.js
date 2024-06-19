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
    publicEmployers: "/v1.0/public/employers/",
    staffNewsPosts: "/v1.0/protected/news/posts/",
    staffNewsTags: "/v1.0/protected/news/tags/",
    commonGenders: "/v1.0/protected/genders/",
    commonCities: "/v1.0/protected/cities/",
    employee: "/v1.0/protected/employees/",
    employer: "/v1.0/protected/employers/",
    cvs: "/v1.0/protected/cvs/",
    vacancies: "/v1.0/protected/vacancies/",
    cvResponses: "/v1.0/protected/cv-responses/",
    vacancyResponses: "/v1.0/protected/vacancy-responses/"
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

export function dataSetStatus(api, token, id, status, info) {
    let headers = getHeader(token)
    let url = urlPrefix + API_LIST[api] + id + "/status/"

    return API.patch(url, { "status": status, "info": info }, { headers })
}

export function dataSetFavorite(api, token, id, isFavorite) {
    let headers = getHeader(token)
    let url = urlPrefix + API_LIST[api] + id + "/favorite/"

    if (isFavorite) return API.post(url, {}, { headers })
    else return API.delete(url, { headers })
}

export function dataAddMessage(api, token, id, msgText) {
    let headers = getHeader(token)
    let url = urlPrefix + API_LIST[api] + id + "/messages/"

    return API.patch(url, { "content": msgText }, { headers })
}
