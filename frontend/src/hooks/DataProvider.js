import { useContext, createContext, useState, useEffect } from "react";

import { useAuth, userRoles } from "./AuthProvider.js";
import { dataGetList, dataGetOne, dataPostOne, dataDeleteOne, dataPutOne } from "../services/APIData.js"

export const DATA_RESOURCES = {
    publicNews: {
        api: "publicNews",
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
    employeeProfile: {
        api: "employeeProfile",
        isProtected: true,
        isGlobal: true,
        roles: [userRoles.employee],
        methods: ["get", "post", "put", "delete"]
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
        methods: ["get", "post", "put", "delete", "patch"]
    }
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
    const [employeeProfile, setEmployeeProfile] = useState([]);

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
                console.log(error)
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
                console.log(error)
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
                console.log(response)
                return { data: null, error: response.error }
            }
        } catch (error) {
            console.log(error)
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
                console.log("posting " + resource + ": " + JSON.stringify(data))

                let isTokenExpired = false;
                let token = auth.tokenFunc();

                try {
                    let res = await _postOne(resource, data, token)
                    return res
                } catch (error) {
                    if (error instanceof TokenExpiredError) {
                        isTokenExpired = true;
                    } else {
                        console.log(error)
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
                        console.log(error)
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
                return { data: response.data.results, error: null }
            } else {
                console.log(response)
                return { data: null, error: response.error }
            }
        } catch (error) {
            console.log(error)
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
                console.log("puting " + resource + id + ": " + JSON.stringify(data))

                let isTokenExpired = false;
                let token = auth.tokenFunc();

                try {
                    let res = await _putOne(resource, id, data, token)
                    return res
                } catch (error) {
                    if (error instanceof TokenExpiredError) {
                        isTokenExpired = true;
                    } else {
                        console.log(error)
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
                        console.log(error)
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
                console.log(response)
                return { data: null, error: response.error }
            }
        } catch (error) {
            console.log(error)
            if (error.response && error.response.status === 401) {
                throw new TokenExpiredError("Token expired")
            } else if (error.response && error.response.status === 400) {
                return { data: null, error: JSON.stringify(error.response.data) || "Invalid input" }
            } else {
                return { data: null, error: error.message }
            }
        }
    }

    const deleteOne = async (resource, id) => {
        if (auth.isAuthenticated) {
            if (resource.methods.includes("delete")) {
                console.log("deleting " + resource + ": " + id)

                let isTokenExpired = false;
                let token = auth.tokenFunc();

                try {
                    let res = await _deleteOne(resource, id, token)
                    return res
                } catch (error) {
                    if (error instanceof TokenExpiredError) {
                        isTokenExpired = true;
                    } else {
                        console.log(error)
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
                        console.log(error)
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
                console.log(response)
                return { data: null, error: response.error }
            }
        } catch (error) {
            console.log(error)
            if (error.response && error.response.status === 401) {
                throw new TokenExpiredError("Token expired")
            } else {
                return { data: null, error: error.message }
            }
        }
    }

    const getList = async (resource, params) => {
        console.log("loading " + resource.api)
        if (!resource.isProtected) {
            try {
                let token = "";
                let response = await dataGetList(resource.api, token, params)
                console.log(response)
                if (response.status === 200) {
                    let res = response.data.results ?? response.data ?? []
                    return { data: res, error: null }
                } else {
                    console.log(response)
                    return { data: [], error: response.error }
                }
            } catch (error) {
                console.log(error)
                return { data: [], error: error.message }
            }
        }
        else if (auth.isAuthenticated) {

            let isTokenExpired = false;

            try {
                let token = auth.tokenFunc();
                let response = await dataGetList(resource.api, token)
                if (response.status === 200) {
                    let res = response.data.results ?? response.data ?? []
                    return { data: res, error: null }
                } else {
                    console.log(response)
                    return { data: [], error: response.error }
                }
            } catch (error) {
                console.log(error)
                if (error.response && error.response.status === 401) {
                    isTokenExpired = true;
                } else {
                    return { data: [], error: error.message }
                }
            }

            if (isTokenExpired) {
                try {
                    await auth.tokenRefreshFunc()
                    let token = auth.tokenFunc();
                    let response = await dataGetList(resource.api, token)
                    if (response.status === 200) {

                        let res = response.data.results ?? response.data ?? []
                        return { data: res, error: null }
                    } else {
                        console.log(response)
                        return { data: [], error: response.error }
                    }
                }
                catch (error) {
                    console.log(error)
                    return { data: [], error: error.message || "error..." }
                }
            }

            return { data: [], error: null }
        } else {
            return { data: [], error: null }
        };
    };

    const refresh = (resource) => {
        if (!resource.isGlobal) {
            return
        }

        let callback = () => { }
        if (resource.api === DATA_RESOURCES.publicNews.api) {
            callback = setPublicNews
        } else if (resource.api === DATA_RESOURCES.employeeProfile.api) {
            callback = setEmployeeProfile
        }

        if (!resource.isProtected || (resource.isProtected && resource.roles.includes(auth.user.role))) {

            getList(resource)
                .then(res => {
                    if (res.error) {
                        console.log("error refreshing" + resource + ": " + res.error)
                        callback([])
                    } else {
                        callback(res.data)
                    }
                })
                .catch(error => {
                    callback([])
                    console.log("error refreshing" + resource + ": " + error)
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
        console.log("refreshing after auth change for user " + JSON.stringify(auth.user))
        refresh(DATA_RESOURCES.publicNews)
        refresh(DATA_RESOURCES.employeeProfile)
        // eslint-disable-next-line
    }, [auth.user.username]);

    return (
        // two different examples:
        // 1) for direct transfer (child component refers to context => automatic rerenders)
        // 2) for async refreshing (child component should use effect on entire dataProvider if needed)
        // getList 
        <DataContext.Provider value={{ publicNews, employeeProfile, refreshDelayed, getList, getOne, postOne, putOne, deleteOne }}>
            {props.children}
        </DataContext.Provider>
    );

};

export default DataProvider;

export const useData = () => {
    return useContext(DataContext);
};
