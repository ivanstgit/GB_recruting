import { useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import { DATA_RESOURCES, useData } from '../../hooks/DataProvider.js'
import { NewsDetail } from "../../components/shared/News.js";


const NewsDetailPage = (props) => {

    const [item, setItem] = useState();
    const [error, setError] = useState();

    const { id } = useParams();
    const dataProvider = useData();
    const { t } = useTranslation("News");

    if (item) {
        return (
            <div>
                <Link to={"../"} className="btn btn-link">{t("News.back")}</Link>
                <NewsDetail item={item} />
            </div>
        )
    } else {
        dataProvider.getOne(DATA_RESOURCES.publicNews, id)
            .then(res => {
                // console.log(res)
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

export default NewsDetailPage