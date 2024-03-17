import { useContext, createContext, useState, useEffect } from "react";

import { useAuth } from "./AuthProvider.js";
import { dataGetList, dataGetOne, dataPostOne, dataDeleteOne } from "../services/APIData.js"

export const DATA_RESOURCES = {
    publicNews: {
        api: "publicNews",
        isProtected: false
    }
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
            if (resource === "to do later") {
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
            let response = await dataPostOne(resource, token, data)
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

    const deleteOne = async (resource, id) => {
        if (auth.isAuthenticated) {
            if (resource === DATA_RESOURCES.todos || resource === DATA_RESOURCES.publicNews) {
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
            let response = await dataDeleteOne(resource, token, id)
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

    const getList = async (resource) => {
        console.log("loading " + resource.api)
        if (!resource.isProtected) {
            try {
                let token = "";
                let response = await dataGetList(resource.api, token)
                console.log(response)
                if (response.status === 200) {
                    return { data: response.data.results, error: null }
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
                    return { data: response.data.results, error: null }
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

                        return { data: response.data.results, error: null }
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
        let callback = () => { }
        if (resource.api === DATA_RESOURCES.publicNews.api) {
            callback = setPublicNews
        }

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
    }

    const refreshDelayed = (resource, delay = 0) => {
        setTimeout(() => refresh(resource), delay)
    }

    // After user change triggers effect with refreshing data
    useEffect(() => {
        console.log("refreshing after auth change for user " + auth.login)
        refresh(DATA_RESOURCES.publicNews)
        // eslint-disable-next-line
    }, [auth.login]);

    return (
        // two different examples:
        // 1) for direct transfer (child component refers to context => automatic rerenders)
        // 2) for async refreshing (child component should use effect on entire dataProvider if needed)
        // getList 
        <DataContext.Provider value={{ publicNews, refreshDelayed, getOne, postOne, deleteOne }}>
            {props.children}
        </DataContext.Provider>
    );

};

export default DataProvider;

export const useData = () => {
    return useContext(DataContext);
};
