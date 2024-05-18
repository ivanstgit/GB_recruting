import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { ObjectActions } from "../../routes/AppPaths.js"
import { useData, DATA_RESOURCES, dataStatuses } from '../../hooks/DataProvider.js'
import { ErrorLabel } from "../../components/common/UICommon.js";
import { ActionButtonCreate, ActionGroup, commonActions } from "../../components/common/Actions.js";


const ModeratorNewsItem = ({ item, onDelete }) => {
    const navigate = useNavigate();
    let actions = {}
    actions[commonActions.detail] = () => navigate(item.id + "/")
    actions[commonActions.edit] = () => navigate(item.id + "/" + ObjectActions.edit)
    actions[commonActions.delete] = () => onDelete(item.id)

    return (
        <tr>
            <td>{item.title}</td>
            <td>{new Date(item.created_at).toLocaleString()}</td>
            <td><p className="card-text">{item.body}</p></td>
            <td>
                <ActionGroup actions={actions} size="sm" />
            </td>
        </tr>
    )
}

const ModeratorNewsPage = () => {
    const { t } = useTranslation("Moderator");

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
                    <ActionButtonCreate />
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
                            onDelete={deleteItem}
                        />)}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default ModeratorNewsPage
