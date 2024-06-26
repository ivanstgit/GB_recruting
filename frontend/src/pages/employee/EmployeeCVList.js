import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { ObjectActions } from "../../routes/AppPaths.js"
import { useData, DATA_RESOURCES, dataStatuses, PrivateDataContext } from '../../hooks/DataProvider.js'
import { ErrorLabel, WarningLabel } from "../../components/common/UICommon.js";
import { ActionButtonCreate, ActionGroup, commonActions } from "../../components/common/Actions.js";
import { CVStatusIcon, CVStatuses } from "../../components/shared/CV.js";


const EmployeeCVListPage = () => {
    // const { tEmployee } = useTranslation("Employee");
    const { t } = useTranslation("Employee");

    const dataProvider = useData()
    const privateData = useContext(PrivateDataContext)

    const [error, setError] = useState("")
    const [status, setStatus] = useState(dataStatuses.initial)

    const profile = dataProvider.employeeProfile?.[0] ?? null
    const isProfileNotExist = profile ? false : true
    const emptyProfileText = profile ? "" : t("Profile.emptyWarning")


    const deleteItem = (id) => {
        if (status !== dataStatuses.loading) {
            dataProvider.deleteOne(DATA_RESOURCES.cvs, id)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                        setStatus(dataStatuses.error)
                    } else {
                        setError("")
                        privateData.refreshCVList().then(setStatus(dataStatuses.initial))
                    }
                })
        }
    }

    const publishItem = (id) => {
        if (status !== dataStatuses.loading) {
            dataProvider.setStatus(DATA_RESOURCES.cvs, id, CVStatuses.pending)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                        setStatus(dataStatuses.error)
                    } else {
                        setError("")
                        privateData.refreshCVList().then(setStatus(dataStatuses.initial))
                    }
                })
        }
    }

    const headerText = t("CVs.header")
    const items = privateData.CVList

    return (
        <div>

            <h3>{headerText}</h3>

            <div className="row">
                <WarningLabel text={emptyProfileText} />
                <ErrorLabel errorText={error} />
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
                                <th scope="col">{t("CVs.table.header.title")}</th>
                                <th scope="col">{t("CVs.table.header.status")}</th>
                                <th scope="col">{t("CVs.table.header.position")}</th>
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

export default EmployeeCVListPage

const EmployeeCVListItem = ({ item, onDelete, onPublish }) => {
    const navigate = useNavigate();
    let actions = {}
    actions[commonActions.detail] = () => navigate(item.id + "/")
    actions[commonActions.copy] = () => navigate(ObjectActions.add, { state: { fromId: item.id } })
    if (item.status.id === CVStatuses.draft || item.status.id === CVStatuses.rejected) {
        actions[commonActions.edit] = () => navigate(item.id + "/" + ObjectActions.edit)
        actions[commonActions.publish] = () => onPublish(item.id)
    }
    actions[commonActions.delete] = () => onDelete(item.id)

    return (
        <tr>
            <td>{item.title}</td>
            <td><div className="card-text"><CVStatusIcon status={item.status} showText={true} /> {item.status_info}</div></td>
            <td><p className="card-text">{item.position}</p></td>
            <td>{new Date(item.created_at).toLocaleString()}</td>
            <td>
                <ActionGroup actions={actions} size="sm" />
            </td>
        </tr>
    )
}