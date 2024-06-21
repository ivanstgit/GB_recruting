import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import { ActionGroup, commonActions } from "../../components/common/Actions.js";
import { ErrorLabel, WarningLabel } from "../../components/common/UICommon.js";
import EmployeeProfileCard from "../../components/shared/Employee.js";
import { DATA_RESOURCES, useData } from "../../hooks/DataProvider.js";
import { ObjectActions } from "../../routes/AppPaths.js";

const EmployeeProfilePage = () => {
    const { t } = useTranslation("Employee");

    const navigate = useNavigate();
    const dataProvider = useData();

    const [error, setError] = useState();

    const profile = dataProvider.employeeProfile?.[0] ?? null
    const emptyProfileText = profile ? "" : t("Profile.emptyWarning")

    let actions = {}
    actions[commonActions.edit] = () => navigate(ObjectActions.edit)
    if (profile) {
        actions[commonActions.delete] = () => {
            dataProvider.deleteOne(DATA_RESOURCES.employee, profile.id)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                    } else {
                        setError("")
                        dataProvider.refreshDelayed(DATA_RESOURCES.employee)
                    }
                })
        }
    }

    return (
        <div>
            <h3> {t("Profile.header")} </h3>

            <div className="row">
                <WarningLabel text={emptyProfileText} />
                <ErrorLabel errorText={error} />

            </div>
            <div className="row">
                <div className="col">
                    <ActionGroup actions={actions} size="" showText={true} />
                </div>
            </div>
            <div className="row">
                <EmployeeProfileCard profile={profile} />
            </div>
        </div>

    )
}
export default EmployeeProfilePage
