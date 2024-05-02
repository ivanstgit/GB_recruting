import { useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import { DATA_RESOURCES, useData } from '../../hooks/DataProvider.js'
import { NewsDetail } from "../../components/shared/News.js";


const ModeratorNewsDetailPage = ({ backTo }) => {

    const [item, setItem] = useState();
    const [error, setError] = useState();

    const { t } = useTranslation("Moderator");
    const { id } = useParams();
    const dataProvider = useData()

    if (item) {
        return (
            <>
                <div className="row">
                    <div className="col-6">
                        <Link to={backTo} className="btn btn-link">{t("News.actions.back")}</Link>
                    </div>
                </div>
                <div className="row">
                    <NewsDetail item={item} />
                </div>
            </>
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

export default ModeratorNewsDetailPage