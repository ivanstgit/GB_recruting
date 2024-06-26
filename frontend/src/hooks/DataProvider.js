import { useContext, createContext, useState, useEffect } from "react";

import { useAuth, userRoles } from "./AuthProvider.js";
import { dataGetList, dataGetOne, dataPostOne, dataDeleteOne, dataPutOne, dataSetStatus, dataSetFavorite, dataAddMessage } from "../services/APIData.js"

export const DATA_RESOURCES = {
    publicNews: {
        api: "publicNews",
        isProtected: false,
        isGlobal: true,
        methods: ["get"]
    },
    publicEmployers: {
        api: "publicEmployers",
        isProtected: false,
        isGlobal: true,
        methods: ["get"]
    },
    accountSignUp: {
        api: "accountSignUp",
        isProtected: false,
        isGlobal: false,
        methods: ["get"]
    },
    commonCities: {
        api: "commonCities",
        isProtected: true,
        isGlobal: false,
        methods: ["get"]
    },
    commonGenders: {
        api: "commonGenders",
        isProtected: true,
        isGlobal: false,
        methods: ["get"]
    },
    employee: {
        api: "employee",
        isProtected: true,
        isGlobal: true,
        roles: [userRoles.employee],
        methods: ["get", "post", "put", "delete"]
    },
    employer: {
        api: "employer",
        isProtected: true,
        isGlobal: true,
        roles: [userRoles.employer, userRoles.moderator],
        methods: ["get", "post", "put", "delete", "status"]
    },
    staffNews: {
        api: "staffNewsPosts",
        isProtected: true,
        isGlobal: false,
        roles: [userRoles.moderator],
        methods: ["get", "post", "put", "delete"]
    },
    cvs: {
        api: "cvs",
        isProtected: true,
        isGlobal: false,
        roles: [userRoles.employee, userRoles.employer, userRoles.moderator],
        methods: ["get", "post", "put", "delete", "status", "favorites"]
    },
    cvResponses: {
        api: "cvResponses",
        isProtected: true,
        isGlobal: false,
        roles: [userRoles.employee, userRoles.employer],
        methods: ["get", "post", "delete", "status", "messages"]
    },
    vacancies: {
        api: "vacancies",
        isProtected: true,
        isGlobal: false,
        roles: [userRoles.employee, userRoles.employer, userRoles.moderator],
        methods: ["get", "post", "put", "delete", "status", "favorites"]
    },
    vacancyResponses: {
        api: "vacancyResponses",
        isProtected: true,
        isGlobal: false,
        roles: [userRoles.employee, userRoles.employer],
        methods: ["get", "post", "delete", "status", "messages"]
    },
}

export const dataStatuses = {
    initial: "initial",
    loading: "loading",
    error: "error",
    success: "success"
}

export const DataContext = createContext();

class TokenExpiredError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

const DataProvider = (props) => {
    //all objects keeping in state to share between them
    const [publicNews, setPublicNews] = useState([]);
    const [publicEmployers, setPublicEmployers] = useState([]);
    const [employeeProfile, setEmployeeProfile] = useState([]);
    const [employerProfile, setEmployerProfile] = useState([]);

    const auth = useAuth()

    const getOne = async (resource, id) => {
        let isTokenExpired = false;
        let token = "";

        if (resource.isProtected && auth.isAuthenticated) {
            token = auth.tokenFunc();
        }

        try {
            let res = await _getOne(resource, id, token)
            return res
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                isTokenExpired = true;
            } else {
                // console.log(error)
                return { data: null, error: error.message }
            }
        }
        if (isTokenExpired) {
            try {
                await auth.tokenRefreshFunc()
                let token = auth.tokenFunc();
                let res = await _getOne(resource, id, token)
                return res
            } catch (error) {
                // console.log(error)
                return { data: null, error: error.message }
            }
        }
        return { data: null, error: null }

    }

    const _getOne = async (resource, id, token) => {
        try {
            let response = await dataGetOne(resource.api, token, id)
            if (response.status === 200) {
                return { data: response.data, error: null }
            } else {
                // console.log(response)
                return { data: null, error: response.error }
            }
        } catch (error) {
            // console.log(error)
            if (error.response && error.response.status === 401) {
                throw new TokenExpiredError("Token expired")
            } else {
                return { data: null, error: error.message }
            }
        }
    }

    const postOne = async (resource, data) => {
        if (auth.isAuthenticated) {
            if (resource.methods.includes("post")) {
                // console.log("posting " + resource + ": " + JSON.stringify(data))

                let isTokenExpired = false;
                let token = auth.tokenFunc();

                try {
                    let res = await _postOne(resource, data, token)
                    return res
                } catch (error) {
                    if (error instanceof TokenExpiredError) {
                        isTokenExpired = true;
                    } else {
                        // console.log(error)
                        return { data: null, error: error.message }
                    }
                }
                if (isTokenExpired) {
                    try {
                        await auth.tokenRefreshFunc()
                        let token = auth.tokenFunc();
                        let res = await _postOne(resource, data, token)
                        return res
                    } catch (error) {
                        // console.log(error)
                        return { data: null, error: error.message }
                    }
                }
                return { data: null, error: null }
            } else {
                return { error: "method not allowed", data: null }
            }
        }
        return { error: "not authenticated", data: null }
    }

    const _postOne = async (resource, data, token) => {
        try {
            let response = await dataPostOne(resource.api, token, data)
            if (response.status === 201) {
                return { data: response.data, error: null }
            } else {
                // console.log(response)
                return { data: null, error: response.error }
            }
        } catch (error) {
            // console.log(error)
            if (error.response && error.response.status === 401) {
                throw new TokenExpiredError("Token expired")
            } else if (error.response && error.response.status === 400) {
                return { data: null, error: JSON.stringify(error.response.data) || "Invalid input" }
            } else {
                return { data: null, error: error.message }
            }
        }
    }

    const putOne = async (resource, id, data) => {
        if (auth.isAuthenticated) {
            if (resource.methods.includes("put")) {
                // console.log("puting " + resource + id + ": " + JSON.stringify(data))

                let isTokenExpired = false;
                let token = auth.tokenFunc();

                try {
                    let res = await _putOne(resource, id, data, token)
                    return res
                } catch (error) {
                    if (error instanceof TokenExpiredError) {
                        isTokenExpired = true;
                    } else {
                        // console.log(error)
                        return { data: null, error: error.message }
                    }
                }
                if (isTokenExpired) {
                    try {
                        await auth.tokenRefreshFunc()
                        let token = auth.tokenFunc();
                        let res = await _putOne(resource, id, data, token)
                        return res
                    } catch (error) {
                        // console.log(error)
                        return { data: null, error: error.message }
                    }
                }
                return { data: null, error: null }
            } else {
                return { error: "method not allowed", data: null }
            }
        }
        return { error: "not authenticated", data: null }
    }

    const _putOne = async (resource, id, data, token) => {
        try {
            let response = await dataPutOne(resource.api, token, id, data)
            if (response.status === 200) {
                return { data: response.data.results, error: null }
            } else {
                // console.log(response)
                return { data: null, error: response.error }
            }
        } catch (error) {
            // console.log(error)
            if (error.response && error.response.status === 401) {
                throw new TokenExpiredError("Token expired")
            } else if (error.response && error.response.status === 400) {
                return { data: null, error: JSON.stringify(error.response.data) || "Invalid input" }
            } else {
                return { data: null, error: error.message }
            }
        }
    }

    const setStatus = async (resource, id, status, info = "") => {
        if (auth.isAuthenticated) {
            if (resource.methods.includes("status")) {

                let isTokenExpired = false;
                let token = auth.tokenFunc();

                try {
                    let res = await _setStatus(resource, id, status, info, token)
                    return res
                } catch (error) {
                    if (error instanceof TokenExpiredError) {
                        isTokenExpired = true;
                    } else {
                        // console.log(error)
                        return { data: null, error: error.message }
                    }
                }
                if (isTokenExpired) {
                    try {
                        await auth.tokenRefreshFunc()
                        let token = auth.tokenFunc();
                        let res = await _setStatus(resource, id, status, token)
                        return res
                    } catch (error) {
                        // console.log(error)
                        return { data: null, error: error.message }
                    }
                }
                return { data: null, error: null }
            } else {
                return { error: "method not allowed", data: null }
            }
        }
        return { error: "not authenticated", data: null }
    }

    const _setStatus = async (resource, id, status, info, token) => {
        try {
            let response = await dataSetStatus(resource.api, token, id, status, info)
            if (response.status === 200) {
                return { data: response.data.results, error: null }
            } else {
                // console.log(response)
                return { data: null, error: response.error }
            }
        } catch (error) {
            // console.log(error)
            if (error.response && error.response.status === 401) {
                throw new TokenExpiredError("Token expired")
            } else if (error.response && error.response.status === 400) {
                return { data: null, error: JSON.stringify(error.response.data) || "Invalid input" }
            } else {
                return { data: null, error: error.message }
            }
        }
    }

    const setFavorite = async (resource, id, isFavorite = true) => {
        const successResult = { error: null }
        const errorResult = (text) => { return { error: text } }
        const parseResponse = (response) => {
            if ((isFavorite && response.status === 201) || (!isFavorite && response.status === 204)) {
                return successResult
            } else {
                // console.log(response)
                return { error: response.error }
            }
        }
        const parseError = (error) => { return { error: error.message } }

        const _setFavorite = async (resource, id, isFavorite, token) => {
            try {
                let response = await dataSetFavorite(resource.api, token, id, isFavorite)
                return parseResponse(response)
            } catch (error) {
                // console.log(error)
                if (error.response && error.response.status === 401) {
                    throw new TokenExpiredError("Token expired")
                } else {
                    return parseError(error)
                }
            }
        }

        if (!auth.isAuthenticated) return errorResult("not authenticated")
        if (!resource.methods.includes("favorites")) return errorResult("method not allowed")

        let isTokenExpired = false;
        for (let step = 0; step < 2; step++) {
            let token = auth.tokenFunc();
            try {
                if (isTokenExpired) {
                    await auth.tokenRefreshFunc()
                }
                let res = await _setFavorite(resource, id, isFavorite, token)
                return res
            } catch (error) {
                if (error instanceof TokenExpiredError) {
                    if (isTokenExpired) return parseError(error)
                    isTokenExpired = true;
                } else {
                    return parseError(error)
                }
            }
        }
    }

    const addMessage = async (resource, id, msgText) => {
        const successResult = { error: null }
        const errorResult = (text) => { return { error: text } }
        const parseResponse = (response) => {
            if (response.status === 201) {
                return successResult
            } else {
                // console.log(response)
                return { error: response.error }
            }
        }
        const parseError = (error) => { return { error: error.message } }

        const _addMessage = async (resource, id, msgText, token) => {
            try {
                let response = await dataAddMessage(resource.api, token, id, msgText)
                return parseResponse(response)
            } catch (error) {
                // console.log(error)
                if (error.response && error.response.status === 401) {
                    throw new TokenExpiredError("Token expired")
                } else {
                    return parseError(error)
                }
            }
        }

        if (!auth.isAuthenticated) return errorResult("not authenticated")
        if (!resource.methods.includes("messages")) return errorResult("method not allowed")

        let isTokenExpired = false;
        for (let step = 0; step < 2; step++) {
            let token = auth.tokenFunc();
            try {
                if (isTokenExpired) {
                    await auth.tokenRefreshFunc()
                }
                let res = await _addMessage(resource, id, msgText, token)
                return res
            } catch (error) {
                if (error instanceof TokenExpiredError) {
                    if (isTokenExpired) return parseError(error)
                    isTokenExpired = true;
                } else {
                    return parseError(error)
                }
            }
        }
    }

    const deleteOne = async (resource, id) => {
        if (auth.isAuthenticated) {
            if (resource.methods.includes("delete")) {
                // console.log("deleting " + resource + ": " + id)

                let isTokenExpired = false;
                let token = auth.tokenFunc();

                try {
                    let res = await _deleteOne(resource, id, token)
                    return res
                } catch (error) {
                    if (error instanceof TokenExpiredError) {
                        isTokenExpired = true;
                    } else {
                        // console.log(error)
                        return { data: null, error: error.message }
                    }
                }
                if (isTokenExpired) {
                    try {
                        await auth.tokenRefreshFunc()
                        let token = auth.tokenFunc();
                        let res = await _deleteOne(resource, id, token)
                        return res
                    } catch (error) {
                        // console.log(error)
                        return { data: null, error: error.message }
                    }
                }
                return { data: null, error: null }
            } else {
                return { error: "method not allowed", data: null }
            }
        }
        return { error: "not authenticated", data: null }
    }

    const _deleteOne = async (resource, id, token) => {
        try {
            let response = await dataDeleteOne(resource.api, token, id)
            if (response.status === 204) {
                return { data: response.data, error: null }
            } else {
                // console.log(response)
                return { data: null, error: response.error }
            }
        } catch (error) {
            // console.log(error)
            if (error.response && error.response.status === 401) {
                throw new TokenExpiredError("Token expired")
            } else {
                return { data: null, error: error.message }
            }
        }
    }

    const getList = async (resource, params) => {
        // console.log("loading " + resource.api)

        const emptyResult = { data: [], error: null, count: 0 }
        const parseResponse = (response) => {
            if (response.status === 200) {
                let res = response.data.results ?? response.data ?? []
                let cnt = response.data.count ?? res.length ?? 0
                return { data: res, error: null, count: cnt }
            } else {
                // console.log(response)
                return { data: [], error: response.error, count: 0 }
            }
        }
        const parseError = (error) => { return { data: [], error: error.message, count: 0 } }

        if (!resource.isProtected) {
            try {
                let token = "";
                let response = await dataGetList(resource.api, token, params)
                // console.log(response)
                return parseResponse(response)
            } catch (error) {
                // console.log(error)
                return parseError(error)
            }
        }
        else if (auth.isAuthenticated) {

            let isTokenExpired = false;

            try {
                let token = auth.tokenFunc();
                let response = await dataGetList(resource.api, token, params)
                return parseResponse(response)
            } catch (error) {
                // console.log(error)
                if (error.response && error.response.status === 401) {
                    isTokenExpired = true;
                } else {
                    return parseError(error)
                }
            }

            if (isTokenExpired) {
                try {
                    await auth.tokenRefreshFunc()
                    let token = auth.tokenFunc();
                    let response = await dataGetList(resource.api, token, params)
                    return parseResponse(response)
                }
                catch (error) { return parseError(error) }
            }

            return emptyResult
        } else {
            return emptyResult
        };
    };

    const refresh = (resource, params = {}) => {
        if (!resource.isGlobal) {
            return
        }

        let callback = () => { }
        if (resource.api === DATA_RESOURCES.publicNews.api) {
            callback = setPublicNews
        } else if (resource.api === DATA_RESOURCES.publicEmployers.api) {
            callback = setPublicEmployers
        } else if (resource.api === DATA_RESOURCES.employee.api) {
            callback = setEmployeeProfile
        } else if (resource.api === DATA_RESOURCES.employer.api) {
            callback = setEmployerProfile
        }

        if (!resource.isProtected || (resource.isProtected && resource.roles.includes(auth.user.role))) {

            getList(resource, params)
                .then(res => {
                    if (res.error) {
                        // console.log("error refreshing" + resource + ": " + res.error)
                        callback([])
                    } else {
                        callback(res.data)
                    }
                })
                .catch(error => {
                    callback([])
                    // console.log("error refreshing" + resource + ": " + error)
                })
        } else {
            callback([])
        }
    }

    const refreshDelayed = (resource, delay = 0) => {
        setTimeout(() => refresh(resource), delay)
    }

    // After user change triggers effect with refreshing data
    useEffect(() => {
        // console.log("refreshing after auth change for user " + JSON.stringify(auth.user))
        refresh(DATA_RESOURCES.publicNews)
        refresh(DATA_RESOURCES.publicEmployers)
        refresh(DATA_RESOURCES.employee)
        refresh(DATA_RESOURCES.employer)
        // eslint-disable-next-line
    }, [auth.user.username]);

    return (
        // two types/groups:
        // 1) global data (public + profiles) and refresh method
        // 2) methods for local use in children
        <DataContext.Provider value={
            {
                publicNews, publicEmployers, employeeProfile, employerProfile, refreshDelayed,
                getList, getOne, postOne, putOne, deleteOne, setStatus, setFavorite, addMessage
            }
        }>
            {props.children}
        </DataContext.Provider>
    );

};

export default DataProvider;

export const useData = () => {
    return useContext(DataContext);
};

export const PrivateDataContext = createContext();
export const usePrivateData = () => {
    return useContext(PrivateDataContext);
};
