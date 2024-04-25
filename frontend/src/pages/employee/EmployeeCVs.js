import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { ObjectActions } from "../../routes/AppPaths.js"
import { useData, DATA_RESOURCES, dataStatuses } from '../../hooks/DataProvider.js'
import { ErrorLabel } from "../../components/LibUICommon.js";


const ModeratorNewsItem = ({ item, linkTextDetail, linkTextEdit, linkTextDelete, onDelete }) => {
    return (
        <tr>
            <td>{item.title}</td>
            <td>{new Date(item.created_at).toLocaleString()}</td>
            <td><p className="card-text">{item.body}</p></td>
            <td>
                <div className="btn-group btn-group-sm" role="group" aria-label="">
                    <Link to={item.id + "/"} className="btn btn-link btn-secondary">{linkTextDetail}</Link>
                    <Link to={item.id + "/" + ObjectActions.edit} className="btn btn-warning">{linkTextEdit}</Link>
                    <button className="btn btn-danger" onClick={() => onDelete(item.id)}>{linkTextDelete}</button>
                </div>
            </td>
            {/* <Link to={AppPaths.news + item.id + "/"} className="card-link mb-0">{linkText}</Link> */}
        </tr>
    )
}

const ModeratorNewsPage = () => {
    const { t } = useTranslation("Moderator");
    const linkTextDetail = t("News.actions.detail")
    const linkTextAdd = t("News.actions.add")
    const linkTextEdit = t("News.actions.edit")
    const linkTextDelete = t("News.actions.delete")

    const dataProvider = useData()
    const [items, setItems] = useState([])
    const [error, setError] = useState("")
    const [status, setStatus] = useState(dataStatuses.initial)

    if (status === dataStatuses.initial) {
        setStatus(dataStatuses.loading)
        dataProvider.getList(DATA_RESOURCES.staffNews)
            .then((res) => {
                if (res.error) {
                    setItems([])
                    setError(res.error)
                    setStatus(dataStatuses.error)
                } else {
                    setItems(res.data)
                    setError("")
                    setStatus(dataStatuses.success)
                }
            })
    }

    const deleteItem = (id) => {
        dataProvider.deleteOne(DATA_RESOURCES.staffNews, id)
            .then((res) => {
                if (res.error) {
                    setError(res.error)
                    setStatus(dataStatuses.error)
                } else {
                    setError("")
                    setStatus(dataStatuses.initial)
                }
            })
    }


    return (
        <div>

            <h3>{t("News.header")}</h3>

            <div className="row">

                <ErrorLabel errorText={error} />
            </div>


            <div className="row">
                <div className="col-6">
                    <Link to={ObjectActions.add} className="btn btn-primary">{linkTextAdd}</Link>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">{t("News.table.header.title")}</th>
                            <th scope="col">{t("News.table.header.created")}</th>
                            <th scope="col">{t("News.table.header.body")}</th>
                            <th scope="col">{t("News.table.header.actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => <ModeratorNewsItem
                            key={'NewsItem' + index}
                            item={item}
                            linkTextDetail={linkTextDetail}
                            linkTextEdit={linkTextEdit}
                            linkTextDelete={linkTextDelete}
                            onDelete={deleteItem}
                        />)}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default ModeratorNewsPage
