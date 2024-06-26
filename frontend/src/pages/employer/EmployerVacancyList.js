import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { ObjectActions } from "../../routes/AppPaths.js"
import { useData, DATA_RESOURCES, dataStatuses, PrivateDataContext } from '../../hooks/DataProvider.js'
import { ErrorLabel, WarningLabel } from "../../components/common/UICommon.js";
import { ActionButtonCreate, ActionGroup, commonActions } from "../../components/common/Actions.js";
import { VacancyStatusIcon, VacancyStatuses } from "../../components/shared/Vacancy.js";


const EmployerVacancyListPage = () => {
    const { t } = useTranslation("Employer");

    const dataProvider = useData()
    const privateData = useContext(PrivateDataContext)

    const [error, setError] = useState("")
    const [status, setStatus] = useState(dataStatuses.initial)

    const profile = dataProvider.employerProfile?.[0] ?? null
    const isProfileNotExist = profile ? false : true
    const emptyProfileText = profile ? "" : t("Profile.emptyWarning")

    const deleteItem = (id) => {
        if (status !== dataStatuses.loading) {
            setStatus(dataStatuses.loading)
            dataProvider.deleteOne(DATA_RESOURCES.vacancies, id)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                        setStatus(dataStatuses.error)
                    } else {
                        setError("")
                        privateData.refreshVacancyList().then(setStatus(dataStatuses.initial))
                    }
                })
        }
    }

    const publishItem = (id) => {
        if (status !== dataStatuses.loading) {
            setStatus(dataStatuses.loading)
            dataProvider.setStatus(DATA_RESOURCES.vacancies, id, VacancyStatuses.pending)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                        setStatus(dataStatuses.error)
                    } else {
                        setError("")
                        privateData.refreshVacancyList().then(setStatus(dataStatuses.initial))
                    }
                })
        }
    }

    const headerText = t("Vacancies.header")
    const items = privateData.vacancyList

    return (
        <div>

            <h3>{headerText}</h3>

            <div className="row">
                <ErrorLabel errorText={error} />
                <WarningLabel text={emptyProfileText} />
            </div>

            <div className="row">
                <div className="col-6">
                    <ActionButtonCreate disabled={isProfileNotExist} />
                </div>
            </div>
            <div className="row">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">{t("Vacancies.table.header.title")}</th>
                                <th scope="col">{t("Vacancies.table.header.status")}</th>
                                <th scope="col">{t("Vacancies.table.header.position")}</th>
                                <th scope="col">{t("Vacancies.table.header.created")}</th>
                                <th scope="col">{t("Vacancies.table.header.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) =>
                                <EmployerVacancyListItem
                                    key={'VacancyListItem' + index}
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

export default EmployerVacancyListPage

const EmployerVacancyListItem = ({ item, onDelete, onPublish }) => {
    const navigate = useNavigate();
    let actions = {}
    actions[commonActions.detail] = () => navigate(item.id + "/")
    actions[commonActions.copy] = () => navigate(ObjectActions.add, { state: { fromId: item.id } })
    if (item.status.id === VacancyStatuses.draft || item.status.id === VacancyStatuses.rejected) {
        actions[commonActions.edit] = () => navigate(item.id + "/" + ObjectActions.edit)
        actions[commonActions.publish] = () => onPublish(item.id)
    }
    actions[commonActions.delete] = () => onDelete(item.id)

    return (
        <tr>
            <td>{item.title}</td>
            <td><div className="card-text"><VacancyStatusIcon status={item.status} showText={true} /> {item.status_info}</div></td>
            <td><p className="card-text">{item.position}</p></td>
            <td>{new Date(item.created_at).toLocaleString()}</td>
            <td>
                {/* <div className="btn-group btn-group-sm" role="group" aria-label="">
                    <Link to={item.id + "/"} className="btn btn-link btn-secondary">{t("CVs.actions.detail")}</Link>
                    <Link to={item.id + "/" + ObjectActions.edit} className="btn btn-warning">{t("CVs.actions.edit")}</Link>
                    <button className="btn btn-danger" onClick={() => onDelete(item.id)}>{t("CVs.actions.delete")}</button>
                    <button className="btn btn-success" onClick={() => onPublish(item.id)}>{t("CVs.actions.publish")}</button>
                </div> */}
                <ActionGroup actions={actions} size="sm" />
            </td>
        </tr>
    )
}