import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { ObjectActions } from "../../routes/AppPaths.js"
import { useData, DATA_RESOURCES, PrivateDataContext } from '../../hooks/DataProvider.js'
import { ErrorLabel } from "../../components/common/UICommon.js";
import { ActionGroup, commonActions } from "../../components/common/Actions.js";
import { VacancyStatuses } from "../../components/shared/Vacancy.js";


const ModeratorVacancyListItem = ({ item, onAccept }) => {
    const navigate = useNavigate();
    let actions = {}
    actions[commonActions.detail] = () => navigate(item.id + "/")
    actions[commonActions.accept] = () => { onAccept(item.id) }
    actions[commonActions.reject] = () => navigate(item.id + "/" + ObjectActions.reject)

    return (
        <tr>
            <td>{item.owner}</td>
            <td>{item.employer.name}</td>
            <td><p className="card-text">{item.position}</p></td>
            <td>{new Date(item.updated_at).toLocaleString()}</td>
            <td>
                <ActionGroup actions={actions} size="sm" />
            </td>
        </tr>
    )
}

const ModeratorVacancyListPage = () => {
    const privateData = useContext(PrivateDataContext)
    const { t } = useTranslation("Moderator");

    const [error, setError] = useState();

    const dataProvider = useData()

    const acceptItem = (id) => {
        dataProvider.setStatus(DATA_RESOURCES.vacancies, id, VacancyStatuses.approved)
            .then((res) => {
                if (res.error) {
                    setError(res.error)
                } else {
                    setError("")
                    privateData.refreshVacancyList()
                }
            })
    }
    const items = privateData.vacancyList

    const headerText = t("Vacancies.header")

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
                                <th scope="col">{t("Vacancies.table.header.owner")}</th>
                                <th scope="col">{t("Vacancies.table.header.name")}</th>
                                <th scope="col">{t("Vacancies.table.header.position")}</th>
                                <th scope="col">{t("Vacancies.table.header.updated")}</th>
                                <th scope="col">{t("Vacancies.table.header.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) =>
                                <ModeratorVacancyListItem
                                    key={'VacancyListItem' + index}
                                    item={item}
                                    onAccept={acceptItem}
                                />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ModeratorVacancyListPage
