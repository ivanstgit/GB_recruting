import { useState } from "react";
import { useParams } from 'react-router-dom';

import { DATA_RESOURCES, useData } from '../hooks/DataProvider.js'
import AppPaths from "../routes/AppPaths.js"

const PublicNewsDetail = (props) => {

    const [item, setItem] = useState();
    const [error, setError] = useState();

    const { id } = useParams();
    console.log("loading news detail for " + JSON.stringify(id))
    const dataProvider = useData()

    if (item) {
        return (
            <div className="row g-3">
                <div className="h-100 mb-0">
                    <div className="card-body">
                        <h5 className="card-title">{item.title}</h5>
                        <h6 className="card-subtitle">{new Date(item.created_at).toLocaleString()}</h6>
                        <p className="card-text">{item.content}</p>
                    </div>
                </div>
            </div>
        )
    } else {
        dataProvider.getOne(DATA_RESOURCES.publicNews, id)
            .then(res => {
                console.log(res)
                if (res.error) {
                    setError(res.error)
                } else {
                    setItem(res.data)
                }
            })

        return (
            <p className="card-text">{error}</p>
        )
    }
}

export default PublicNewsDetail