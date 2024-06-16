import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { useData, DATA_RESOURCES, dataStatuses, PrivateDataContext } from '../../hooks/DataProvider.js'
import { ErrorLabel } from "../../components/common/UICommon.js";
import { ActionGroup, commonActions } from "../../components/common/Actions.js";
import { CVResponseStatusIcon, CVResponseStatuses } from "../../components/shared/CVResponse.js";
import { CVCard } from "../../components/shared/CV.js";
import { VacancyCard } from "../../components/shared/Vacancy.js";


const EmployerCVResponseListPage = ({ CVTo, vacancyTo }) => {
    const { t } = useTranslation("Employer");

    const dataProvider = useData()
    const privateData = useContext(PrivateDataContext)

    const [error, setError] = useState("")
    const [status, setStatus] = useState(dataStatuses.initial)

    const navigate = useNavigate()

    const deleteItem = (id) => {
        if (status !== dataStatuses.loading) {
            setStatus(dataStatuses.loading)
            dataProvider.deleteOne(DATA_RESOURCES.cvResponses, id)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                        setStatus(dataStatuses.error)
                    } else {
                        setError("")
                        privateData.refreshCVResponseList().then(setStatus(dataStatuses.initial))
                    }
                })
        }
    }

    const publishItem = (id) => {
        if (status !== dataStatuses.loading) {
            setStatus(dataStatuses.loading)
            dataProvider.setStatus(DATA_RESOURCES.cvResponses, id, CVResponseStatuses.pending)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                        setStatus(dataStatuses.error)
                    } else {
                        setError("")
                        privateData.refreshCVResponseList().then(setStatus(dataStatuses.initial))
                    }
                })
        }
    }

    const headerText = t("CVResponses.header")
    const items = privateData.CVResponseList

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
                                <th scope="col" width="40%">{t("CVResponses.table.header.cv")}</th>
                                <th scope="col" width="40%">{t("CVResponses.table.header.vacancy")}</th>
                                <th scope="col">{t("CVResponses.table.header.status")}</th>
                                <th scope="col">{t("CVResponses.table.header.updated")}</th>
                                <th scope="col">{t("CVResponses.table.header.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) =>
                                <EmployerCVResponseListItem
                                    key={'CVResponseListItem' + index}
                                    item={item}
                                    onDelete={deleteItem}
                                    onPublish={publishItem}
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

export default EmployerCVResponseListPage

const EmployerCVResponseListItem = ({ item, onDelete, onPublish, onCVDetail, onVacancyDetail }) => {
    const navigate = useNavigate();
    let actions = {}
    actions[commonActions.detail] = () => navigate(item.id + "/")
    if (item.status.id === CVResponseStatuses.draft) {
        actions[commonActions.publish] = () => onPublish(item.id)
    }
    actions[commonActions.delete] = () => onDelete(item.id)

    let CVActions = {}
    CVActions[commonActions.detail] = () => onCVDetail(item.cv.id)
    let vacancyActions = {}
    vacancyActions[commonActions.detail] = () => onVacancyDetail(item.vacancy.id)

    return (
        <tr>
            <td><CVCard item={item.cv} actions={CVActions} /></td>
            <td><VacancyCard item={item.vacancy} actions={vacancyActions} /></td>
            <td><div className="card-text"><CVResponseStatusIcon status={item.status} showText={true} /> {item.status_info}</div></td>
            <td>{new Date(item.updated_at).toLocaleString()}</td>
            <td>
                <ActionGroup actions={actions} size="sm" />
            </td>
        </tr>
    )
}