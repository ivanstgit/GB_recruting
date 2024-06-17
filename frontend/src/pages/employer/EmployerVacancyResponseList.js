import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { useData, DATA_RESOURCES, dataStatuses, PrivateDataContext } from '../../hooks/DataProvider.js'
import { ErrorLabel } from "../../components/common/UICommon.js";
import { ActionGroup, commonActions } from "../../components/common/Actions.js";
import { VacancyResponseStatusIcon, VacancyResponseStatuses } from "../../components/shared/VacancyResponse.js";
import { CVCard } from "../../components/shared/CV.js";
import { VacancyCard } from "../../components/shared/Vacancy.js";


const EmployerVacancyResponseListPage = ({ CVTo, vacancyTo }) => {
    const { t } = useTranslation("Employer");

    const dataProvider = useData()
    const privateData = useContext(PrivateDataContext)

    const [error, setError] = useState("")
    const [status, setStatus] = useState(dataStatuses.initial)

    const navigate = useNavigate()

    const acceptItem = (id) => {
        if (status !== dataStatuses.loading) {
            setStatus(dataStatuses.loading)
            dataProvider.setStatus(DATA_RESOURCES.vacancyResponses, id, VacancyResponseStatuses.approved)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                        setStatus(dataStatuses.error)
                    } else {
                        setError("")
                        privateData.refreshVacancyResponseList().then(setStatus(dataStatuses.initial))
                    }
                })
        }
    }

    const rejectItem = (id) => {
        if (status !== dataStatuses.loading) {
            setStatus(dataStatuses.loading)
            dataProvider.setStatus(DATA_RESOURCES.vacancyResponses, id, VacancyResponseStatuses.rejected)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                        setStatus(dataStatuses.error)
                    } else {
                        setError("")
                        privateData.refreshVacancyResponseList().then(setStatus(dataStatuses.initial))
                    }
                })
        }
    }

    const headerText = t("VacancyResponses.header")
    const items = privateData.vacancyResponseList

    return (
        <div>

            <h3>{headerText}</h3>

            <div className="row">
                <ErrorLabel errorText={error} />
            </div>

            <div className="row">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col" width="40%">{t("VacancyResponses.table.header.vacancy")}</th>
                                <th scope="col" width="40%">{t("VacancyResponses.table.header.cv")}</th>
                                <th scope="col">{t("VacancyResponses.table.header.status")}</th>
                                <th scope="col">{t("VacancyResponses.table.header.updated")}</th>
                                <th scope="col">{t("VacancyResponses.table.header.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) =>
                                <EmployerVacancyResponseListItem
                                    key={'VacancyResponseListItem' + index}
                                    item={item}
                                    onAccept={acceptItem}
                                    onReject={rejectItem}
                                    onCVDetail={(id) => navigate(CVTo + id)}
                                    onVacancyDetail={(id) => navigate(vacancyTo + id)}
                                />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default EmployerVacancyResponseListPage

const EmployerVacancyResponseListItem = ({ item, onAccept, onReject, onCVDetail, onVacancyDetail }) => {
    const navigate = useNavigate();
    let actions = {}
    actions[commonActions.detail] = () => navigate(item.id + "/")
    if (item.status.id === VacancyResponseStatuses.pending) {
        actions[commonActions.accept] = () => onAccept(item.id)
        actions[commonActions.reject] = () => onReject(item.id)
    }

    let CVActions = {}
    CVActions[commonActions.detail] = () => onCVDetail(item.cv.id)
    let vacancyActions = {}
    vacancyActions[commonActions.detail] = () => onVacancyDetail(item.vacancy.id)

    return (
        <tr>
            <td><VacancyCard item={item.vacancy} actions={vacancyActions} /></td>
            <td><CVCard item={item.cv} actions={CVActions} /></td>
            <td><div className="card-text"><VacancyResponseStatusIcon status={item.status} showText={true} /> {item.status_info}</div></td>
            <td>{new Date(item.updated_at).toLocaleString()}</td>
            <td>
                <ActionGroup actions={actions} size="sm" />
            </td>
        </tr>
    )
}