import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { ObjectActions } from "../../routes/AppPaths.js"
import { useData, DATA_RESOURCES, dataStatuses } from '../../hooks/DataProvider.js'
import { ErrorLabel } from "../../components/common/UICommon.js";


const EmployeeCVListItem = ({ item, onDelete, onPublish }) => {
    const { t } = useTranslation("Employee");

    return (
        <tr>
            <td>{item.title}</td>
            <td><p className="card-text">{item.status}</p></td>
            <td>{new Date(item.created_at).toLocaleString()}</td>
            <td>
                <div className="btn-group btn-group-sm" role="group" aria-label="">
                    <Link to={item.id + "/"} className="btn btn-link btn-secondary">{t("CVs.actions.detail")}</Link>
                    <Link to={item.id + "/" + ObjectActions.edit} className="btn btn-warning">{t("CVs.actions.edit")}</Link>
                    <button className="btn btn-danger" onClick={() => onDelete(item.id)}>{t("CVs.actions.delete")}</button>
                    <button className="btn btn-success" onClick={() => onPublish(item.id)}>{t("CVs.actions.publish")}</button>
                </div>
            </td>
        </tr>
    )
}

const EmployeeCVsPage = () => {
    // const { tEmployee } = useTranslation("Employee");
    const { t } = useTranslation("Employee");

    const dataProvider = useData()

    const [items, setItems] = useState([])
    const [error, setError] = useState("")
    const [status, setStatus] = useState(dataStatuses.initial)

    const loadItems = () => {
        dataProvider.getList(DATA_RESOURCES.cvs)
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
        dataProvider.deleteOne(DATA_RESOURCES.cvs, id)
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

    const publishItem = (id) => {
        // dataProvider.deleteOne(DATA_RESOURCES.cvs, id)
        //     .then((res) => {
        //         if (res.error) {
        //             setError(res.error)
        //             setStatus(dataStatuses.error)
        //         } else {
        //             setError("")
        //             setStatus(dataStatuses.initial)
        //         }
        //     })
    }


    if (status === dataStatuses.initial) {
        setStatus(dataStatuses.loading)
        loadItems()
    }

    const headerText = t("CVs.header")

    return (
        <div>

            <h3>{headerText}</h3>

            <div className="row">
                <ErrorLabel errorText={error} />
            </div>

            <div className="row">
                <div className="col-6">
                    <Link to={ObjectActions.add} className="btn btn-primary">{t("CVs.actions.add")}</Link>
                </div>
            </div>
            <div className="row">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">{t("CVs.table.header.title")}</th>
                                <th scope="col">{t("CVs.table.header.status")}</th>
                                <th scope="col">{t("CVs.table.header.created")}</th>
                                <th scope="col">{t("CVs.table.header.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) =>
                                <EmployeeCVListItem
                                    key={'CVListItem' + index}
                                    item={item}
                                    onDelete={deleteItem}
                                    onPublish={publishItem}
                                />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default EmployeeCVsPage
